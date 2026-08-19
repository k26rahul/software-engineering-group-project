"""Service layer for Budget API."""

from datetime import date

from sqlmodel import Session, func, select

from models.budget import BudgetEntry
from schemas.budget import BudgetEntryResponse, BudgetSummaryResponse, RecordBudgetEntryRequest


class BudgetService:
  """Service for managing budget and expenses."""

  @staticmethod
  def get_summary(session: Session) -> BudgetSummaryResponse:
    """Retrieve budget utilization for current month and year."""
    today = date.today()
    month = today.month
    year = today.year

    statement = select(BudgetEntry).where(
      func.extract("month", BudgetEntry.date) == month,
      func.extract("year", BudgetEntry.date) == year,
    ).order_by(BudgetEntry.date.desc())
    
    entries = session.exec(statement).all()

    total_expenses = sum(entry.amount for entry in entries if entry.type == "EXPENSE")
    total_income = sum(entry.amount for entry in entries if entry.type == "INCOME")
    budget_limit = 10000.0
    budget_spent = total_expenses

    entry_responses = [
      BudgetEntryResponse(
        id=entry.id,
        description=entry.description,
        category=entry.category,
        amount=entry.amount,
        type=entry.type,
        date=entry.date,
      )
      for entry in entries
    ]

    return BudgetSummaryResponse(
      budget_limit=budget_limit,
      budget_spent=budget_spent,
      total_expenses=total_expenses,
      total_income=total_income,
      entries=entry_responses,
    )

  @staticmethod
  def record_expense(session: Session, request: RecordBudgetEntryRequest) -> BudgetEntryResponse:
    """Record a generic budget entry."""
    entry = BudgetEntry(
      description=request.description,
      category=request.category,
      amount=request.amount,
      type=request.type,
      date=date.today(),
    )
    session.add(entry)
    session.commit()
    session.refresh(entry)

    return BudgetEntryResponse(
      id=entry.id,
      description=entry.description,
      category=entry.category,
      amount=entry.amount,
      type=entry.type,
      date=entry.date,
    )
