"""Service layer for Budget API."""

from datetime import date
from sqlmodel import Session, select, func

from models.budget import BookPurchaseEntry
from schemas.budget import BudgetSummaryResponse, ExpenseItemResponse, RecordPurchaseRequest


class BudgetService:
  """Service for managing budget and expenses."""

  @staticmethod
  def get_summary(session: Session) -> BudgetSummaryResponse:
    """Retrieve budget utilization for current month and year."""
    today = date.today()
    month = today.month
    year = today.year

    statement = select(BookPurchaseEntry).where(
      func.extract("month", BookPurchaseEntry.purchase_date) == month,
      func.extract("year", BookPurchaseEntry.purchase_date) == year
    )
    entries = session.exec(statement).all()

    total_spent = sum(entry.total_cost() for entry in entries)
    purchase_count = len(entries)

    return BudgetSummaryResponse(
      month=month,
      year=year,
      total_spent=total_spent,
      purchase_count=purchase_count,
    )

  @staticmethod
  def record_expense(
    session: Session, request: RecordPurchaseRequest
  ) -> ExpenseItemResponse:
    """Record a manual book purchase expense."""
    entry = BookPurchaseEntry(
      title=request.title,
      copies=request.copies,
      price_per_copy=request.price_per_copy,
      vendor_id=request.vendor_id,
      category=request.category,
      purchase_date=request.purchase_date,
    )
    session.add(entry)
    session.commit()
    session.refresh(entry)

    return ExpenseItemResponse(
      title=entry.title,
      category=entry.category,
      copies=entry.copies,
      price_per_copy=entry.price_per_copy,
      total_cost=entry.total_cost(),
      purchase_date=entry.purchase_date,
    )
