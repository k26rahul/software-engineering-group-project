"""Service layer for Reports API."""

from datetime import date

from sqlmodel import Session, func, select, text

from models.budget import BookPurchaseEntry
from models.enums import MemberApprovalStatus, UserRole
from models.transaction import Transaction
from models.user import User
from schemas.budget import ExpenseItemResponse, ExpenseReportResponse, UsageReportResponse


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
    statement = text("""
      SELECT book.category 
      FROM 'transaction' 
      JOIN bookcopy ON 'transaction'.book_copy_id = bookcopy.id 
      JOIN book ON bookcopy.book_id = book.id 
      GROUP BY book.category 
      ORDER BY COUNT('transaction'.id) DESC 
      LIMIT 3
    """)
    result = session.exec(statement).all()
    popular_categories = [row[0] for row in result if row[0]]

    return UsageReportResponse(
      active_members=active_members,
      books_issued=books_issued,
      popular_categories=popular_categories,
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

    return ExpenseReportResponse(
      month=month,
      year=year,
      items=items,
    )
