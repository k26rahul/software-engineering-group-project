"""Service layer for Reports API."""

from datetime import date

import calendar

from sqlmodel import Session, func, select, text

from models.book import Book, BookCopy
from models.budget import BookPurchaseEntry, BudgetEntry
from models.enums import MemberApprovalStatus, UserRole, PaymentType
from models.transaction import Transaction
from models.user import User
from models.payment import Payment
from models.subscription import Subscription
from schemas.budget import (
    ExpenseItemResponse,
    ExpenseReportResponse,
    UsageReportResponse,
    MonthlyTrendItem,
    CategoryBreakdownItem,
    TopBorrowedBookItem,
    ExpenseSummaryItem,
    MonthlyExpenseItem,
)


class ReportsService:
  """Service for managing reports."""

  @staticmethod
  def get_usage_report(session: Session) -> UsageReportResponse:
    """Retrieve aggregated usage metrics."""
    # Active members
    active_members_stmt = select(func.count(User.id)).where(
      User.role == UserRole.MEMBER,
      User.is_active == True,  # noqa: E712
      User.approval_status == MemberApprovalStatus.APPROVED,
    )
    active_members = session.exec(active_members_stmt).one_or_none() or 0

    # Total books issued
    books_issued_stmt = select(func.count(Transaction.id)).where(Transaction.return_date.is_(None))
    books_issued = session.exec(books_issued_stmt).one_or_none() or 0

    # Popular categories (using raw SQL logic or query Book via Transaction)
    # We join Transaction -> BookCopy -> Book
    # Let's do it using a simple join:
    # SELECT b.category, COUNT(t.id) as cnt FROM 'transaction' t
    # JOIN bookcopy c ON t.book_copy_id = c.id
    # JOIN book b ON c.book_id = b.id
    # Category breakdown based on checkouts
    cat_stmt = text("""
      SELECT book.category, COUNT('transaction'.id) as cnt 
      FROM 'transaction' 
      JOIN bookcopy ON 'transaction'.book_copy_id = bookcopy.id 
      JOIN book ON bookcopy.book_id = book.id 
      GROUP BY book.category 
      ORDER BY cnt DESC
    """)
    cat_results = session.exec(cat_stmt).all()
    total_checkouts_for_percent = sum(row[1] for row in cat_results) if cat_results else 1
    category_breakdown = [
        CategoryBreakdownItem(
            category=row[0] or "Uncategorized",
            checkouts=row[1],
            percentage=round((row[1] / total_checkouts_for_percent) * 100, 1)
        )
        for row in cat_results
    ]
    popular_categories = [c.category for c in category_breakdown[:3]]

    # Monthly trends (last 6 months)
    today = date.today()
    monthly_trends = []
    for i in range(5, -1, -1):
        y = today.year
        m = today.month - i
        while m <= 0:
            m += 12
            y -= 1
        
        start_date = date(y, m, 1)
        end_date = date(y, m, calendar.monthrange(y, m)[1])
        
        # Count checkouts
        co_stmt = select(func.count(Transaction.id)).where(
            Transaction.issue_date >= start_date,
            Transaction.issue_date <= end_date
        )
        checkouts = session.exec(co_stmt).one_or_none() or 0
        
        # Count returns
        ret_stmt = select(func.count(Transaction.id)).where(
            Transaction.return_date >= start_date,
            Transaction.return_date <= end_date
        )
        returns = session.exec(ret_stmt).one_or_none() or 0
        
        monthly_trends.append(MonthlyTrendItem(
            month=start_date.strftime("%b %Y"),
            checkouts=checkouts,
            returns=returns
        ))

    # Top borrowed books
    # Instead of raw SQL, we can use it to fetch IDs, or just raw SQL to fetch everything
    top_books_stmt = text("""
      SELECT book.id, book.title, book.author, book.category, COUNT('transaction'.id) as cnt
      FROM 'transaction' 
      JOIN bookcopy ON 'transaction'.book_copy_id = bookcopy.id 
      JOIN book ON bookcopy.book_id = book.id 
      GROUP BY book.id 
      ORDER BY cnt DESC
    """)
    top_books_results = session.exec(top_books_stmt).all()
    top_borrowed_books = []
    for row in top_books_results:
        book_id, title, author, category, checkouts = row
        # Count available copies for this book
        available = session.exec(
            select(func.count(BookCopy.id)).where(
                BookCopy.book_id == book_id,
                BookCopy.status == "AVAILABLE"
            )
        ).one_or_none() or 0
        
        top_borrowed_books.append(TopBorrowedBookItem(
            id=book_id,
            title=title,
            author=author,
            category=category or "Uncategorized",
            checkouts=checkouts,
            available=available
        ))

    return UsageReportResponse(
      active_members=active_members,
      books_issued=books_issued,
      popular_categories=popular_categories,
      monthly_trends=monthly_trends,
      category_breakdown=category_breakdown,
      top_borrowed_books=top_borrowed_books,
    )

  @staticmethod
  def get_expense_report(session: Session) -> ExpenseReportResponse:
    """Retrieve formatted expense report data for current month."""
    today = date.today()
    month = today.month
    year = today.year

    statement = select(BookPurchaseEntry).where(
      func.extract("month", BookPurchaseEntry.purchase_date) == month,
      func.extract("year", BookPurchaseEntry.purchase_date) == year,
    )
    entries = session.exec(statement).all()

    items = [
      ExpenseItemResponse(
        title=entry.title,
        category=entry.category,
        copies=entry.copies,
        price_per_copy=entry.price_per_copy,
        total_cost=entry.total_cost(),
        purchase_date=entry.purchase_date,
      )
      for entry in entries
    ]

    # Fetch active subscriptions for monthly recurring costs
    active_subs = session.exec(select(Subscription).where(Subscription.is_active == True)).all()
    monthly_sub_spend = sum(s.monthly_cost() for s in active_subs)

    # Add active subscriptions to the items list for current month
    for sub in active_subs:
        title = getattr(sub.newspaper, "title", None) or getattr(getattr(sub.magazine, "book", None), "title", None) or f"{sub.type.value} Subscription"
        items.append(ExpenseItemResponse(
            title=title.title() if title else "Subscription",
            category="Subscription",
            copies=1,
            price_per_copy=sub.monthly_cost(),
            total_cost=sub.monthly_cost(),
            purchase_date=date(today.year, today.month, 1),
        ))

    # Add manual BudgetEntry expenses for current month
    manual_expenses_stmt = select(BudgetEntry).where(
      BudgetEntry.type == "EXPENSE",
      func.extract("month", BudgetEntry.date) == month,
      func.extract("year", BudgetEntry.date) == year,
    )
    manual_expenses = session.exec(manual_expenses_stmt).all()
    
    for me in manual_expenses:
      items.append(ExpenseItemResponse(
        title=me.description,
        category=me.category,
        copies=1,
        price_per_copy=me.amount,
        total_cost=me.amount,
        purchase_date=me.date,
        status="PAID"
      ))

    # Calculate summary (Current Month)
    total_budget = 10000.0
    month_start = date(today.year, today.month, 1)
    month_end = date(today.year, today.month, calendar.monthrange(today.year, today.month)[1])
    
    # Calculate current month book purchases
    month_book_purchases = session.exec(select(BookPurchaseEntry).where(
        BookPurchaseEntry.purchase_date >= month_start,
        BookPurchaseEntry.purchase_date <= month_end
    )).all()
    book_spend_month = sum(p.total_cost() for p in month_book_purchases)
    
    # Subscription spend is monthly
    sub_spend_month = monthly_sub_spend

    # Calculate manual budget expenses
    month_manual_expenses_stmt = select(func.sum(BudgetEntry.amount)).where(
        BudgetEntry.type == "EXPENSE",
        BudgetEntry.date >= month_start,
        BudgetEntry.date <= month_end
    )
    manual_spend_month = session.exec(month_manual_expenses_stmt).one_or_none() or 0.0

    total_spent = book_spend_month + sub_spend_month + manual_spend_month

    month_start_str = month_start.strftime("%Y-%m-%d")
    month_end_str = month_end.strftime("%Y-%m-%d")
    
    # Calculate automated fine income for current month
    fine_income_stmt = select(func.sum(Payment.amount)).where(
        Payment.type == PaymentType.FINE_PAYMENT,
        func.date(Payment.created_at) >= month_start_str,
        func.date(Payment.created_at) <= month_end_str
    )
    automated_fine_income = session.exec(fine_income_stmt).one_or_none() or 0.0

    # Calculate manual budget income
    month_manual_income_stmt = select(func.sum(BudgetEntry.amount)).where(
        BudgetEntry.type == "INCOME",
        BudgetEntry.date >= month_start,
        BudgetEntry.date <= month_end
    )
    manual_income_month = session.exec(month_manual_income_stmt).one_or_none() or 0.0

    fine_income = automated_fine_income + manual_income_month

    net_spend = total_spent - fine_income
    budget_utilization_percent = round((total_spent / total_budget) * 100, 1) if total_budget > 0 else 0.0

    summary = ExpenseSummaryItem(
        total_budget=total_budget,
        total_spent=total_spent,
        fine_income=fine_income,
        net_spend=net_spend,
        budget_utilization_percent=budget_utilization_percent,
    )

    # Calculate monthly trends (last 6 months)
    monthly_expenses = []
    for i in range(5, -1, -1):
        y = today.year
        m = today.month - i
        while m <= 0:
            m += 12
            y -= 1
        
        start_date = date(y, m, 1)
        end_date = date(y, m, calendar.monthrange(y, m)[1])
        
        # Spent this month
        purchases_this_month = session.exec(
            select(BookPurchaseEntry).where(
                BookPurchaseEntry.purchase_date >= start_date,
                BookPurchaseEntry.purchase_date <= end_date
            )
        ).all()
        
        manual_exp_this_month_stmt = select(func.sum(BudgetEntry.amount)).where(
            BudgetEntry.type == "EXPENSE",
            BudgetEntry.date >= start_date,
            BudgetEntry.date <= end_date
        )
        manual_exp_this_month = session.exec(manual_exp_this_month_stmt).one_or_none() or 0.0
        
        month_spent = sum(p.total_cost() for p in purchases_this_month) + monthly_sub_spend + manual_exp_this_month
        
        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")

        # Income this month (since Payment.created_at is a datetime, we compare with dates using SQLite date())
        month_income_stmt = select(func.sum(Payment.amount)).where(
            Payment.type == PaymentType.FINE_PAYMENT,
            func.date(Payment.created_at) >= start_date_str,
            func.date(Payment.created_at) <= end_date_str
        )
        automated_month_income = session.exec(month_income_stmt).one_or_none() or 0.0
        
        manual_inc_this_month_stmt = select(func.sum(BudgetEntry.amount)).where(
            BudgetEntry.type == "INCOME",
            BudgetEntry.date >= start_date,
            BudgetEntry.date <= end_date
        )
        manual_inc_this_month = session.exec(manual_inc_this_month_stmt).one_or_none() or 0.0
        
        month_income = automated_month_income + manual_inc_this_month
        
        monthly_expenses.append(MonthlyExpenseItem(
            month=start_date.strftime("%b %Y"),
            budget=10000.0,
            spent=month_spent,
            income=month_income
        ))

    return ExpenseReportResponse(
      month=month,
      year=year,
      items=items,
      summary=summary,
      monthly_expenses=monthly_expenses
    )
