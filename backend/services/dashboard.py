"""Service layer for Dashboard & Analytics domain."""

import calendar
from datetime import date

from sqlmodel import Session, select

from models.book import Book
from models.budget import BookPurchaseEntry
from models.enums import MemberApprovalStatus
from models.subscription import Subscription
from models.transaction import Transaction
from models.user import User
from schemas.dashboard import (
  LibrarianDashboardResponse,
  ManagementDashboardResponse,
  PendingApprovalItem,
  OverdueBookItem,
  MonthlyStatItem,
  CategoryStatItem,
)


class DashboardService:
  """Service aggregate metrics for librarian and campus management dashboards."""

  @staticmethod
  def get_librarian_dashboard(session: Session) -> LibrarianDashboardResponse:
    """Retrieve aggregated dashboard metrics and alerts for librarians."""
    today = date.today()

    total_books = len(session.exec(select(Book)).all())

    active_issues_list = session.exec(
      select(Transaction).where(Transaction.return_date.is_(None))
    ).all()
    active_issues = len(active_issues_list)

    overdue_issues_list = [t for t in active_issues_list if t.due_date < today]
    overdue_issues = len(overdue_issues_list)

    pending_approvals_users = session.exec(
      select(User).where(User.approval_status == MemberApprovalStatus.PENDING)
    ).all()
    pending_approvals = len(pending_approvals_users)
    pending_approvals_list = [
      PendingApprovalItem(
        id=u.id,
        name=u.name,
        email=u.email,
        created_at=u.created_at.date() if u.created_at else date.today(),
      )
      for u in pending_approvals_users
    ]

    alerts = []
    if pending_approvals > 0:
      alerts.append(f"{pending_approvals} member registration(s) pending approval.")
    if overdue_issues > 0:
      alerts.append(f"{overdue_issues} book issuance(s) currently overdue.")

    recent_overdue_books = []
    for t in overdue_issues_list:
      book_title = t.book_copy.book.title if t.book_copy and t.book_copy.book else "Unknown Book"
      borrower_name = t.member.name if t.member else "Unknown Member"
      recent_overdue_books.append(OverdueBookItem(
        transaction_id=t.id,
        title=book_title,
        borrower_name=borrower_name,
        due_date=t.due_date,
        days_overdue=t.days_overdue()
      ))

    # Calculate monthly budget spent
    start_of_month = today.replace(day=1)
    purchases_this_month = session.exec(
        select(BookPurchaseEntry).where(BookPurchaseEntry.purchase_date >= start_of_month)
    ).all()
    book_spend = sum(p.total_cost() for p in purchases_this_month)

    active_subscriptions = session.exec(
        select(Subscription).where(Subscription.is_active == True)
    ).all()
    subscription_spend = sum(s.monthly_cost() for s in active_subscriptions)

    budget_spent = book_spend + subscription_spend
    budget_limit = 10000.0

    return LibrarianDashboardResponse(
      total_books=total_books,
      active_issues=active_issues,
      overdue_issues=overdue_issues,
      pending_approvals=pending_approvals,
      pending_approvals_list=pending_approvals_list,
      recent_overdue_books=recent_overdue_books,
      recent_alerts=alerts,
      budget_limit=budget_limit,
      budget_spent=budget_spent,
    )

  @staticmethod
  def get_management_dashboard(session: Session) -> ManagementDashboardResponse:
    """Retrieve aggregated campus management analytics and financial stats."""
    today = date.today()

    total_members = len(session.exec(select(User)).all())
    active_members = len(session.exec(
        select(User).where(User.approval_status == MemberApprovalStatus.APPROVED)
    ).all())
    total_books = len(session.exec(select(Book)).all())
    
    active_issues_list = session.exec(
        select(Transaction).where(Transaction.return_date.is_(None))
    ).all()
    active_issues = len(active_issues_list)

    # Calculate monthly budget spent exactly like librarian dashboard
    start_of_month = today.replace(day=1)
    purchases_this_month = session.exec(
        select(BookPurchaseEntry).where(BookPurchaseEntry.purchase_date >= start_of_month)
    ).all()
    book_spend = sum(p.total_cost() for p in purchases_this_month)

    active_subscriptions = session.exec(
        select(Subscription).where(Subscription.is_active == True)
    ).all()
    subscription_spend = sum(s.monthly_cost() for s in active_subscriptions)

    budget_spent = book_spend + subscription_spend
    budget_limit = 10000.0

    # Calculate category stats
    categories_count: dict[str, int] = {}
    all_books = session.exec(select(Book)).all()
    for book in all_books:
        cat = book.category or "Uncategorized"
        categories_count[cat] = categories_count.get(cat, 0) + 1
    category_stats = [
        CategoryStatItem(name=k, value=v) for k, v in categories_count.items()
    ]

    # Calculate monthly stats (last 6 months including current)
    monthly_stats = []
    for i in range(5, -1, -1):
        y = today.year
        m = today.month - i
        while m <= 0:
            m += 12
            y -= 1
        
        start_date = date(y, m, 1)
        end_date = date(y, m, calendar.monthrange(y, m)[1])
        
        # Count issues for this month
        issues_this_month = session.exec(
            select(Transaction).where(
                Transaction.issue_date >= start_date,
                Transaction.issue_date <= end_date
            )
        ).all()
        
        # Book spend this month
        purchases_this_month = session.exec(
            select(BookPurchaseEntry).where(
                BookPurchaseEntry.purchase_date >= start_date,
                BookPurchaseEntry.purchase_date <= end_date
            )
        ).all()
        month_book_spend = sum(p.total_cost() for p in purchases_this_month)
        
        # We'll use the current active subscriptions as a flat rate for past months for simplicity
        month_spent = month_book_spend + subscription_spend
        
        month_name = start_date.strftime("%b %Y")
        monthly_stats.append(MonthlyStatItem(
            name=month_name,
            issues=len(issues_this_month),
            spent=month_spent
        ))

    return ManagementDashboardResponse(
      total_members=total_members,
      active_members=active_members,
      active_issues=active_issues,
      total_books=total_books,
      budget_limit=budget_limit,
      budget_spent=budget_spent,
      monthly_stats=monthly_stats,
      category_stats=category_stats,
    )
