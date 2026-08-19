from fastapi import APIRouter

from core.dependencies import SessionDep, StaffDep
from schemas.budget import BudgetEntryResponse, BudgetSummaryResponse, RecordBudgetEntryRequest
from services.budget import BudgetService

budget_router = APIRouter(tags=["Budget"])


@budget_router.get(
  "/budget",
  response_model=BudgetSummaryResponse,
  summary="Get budget summary",
  description="Retrieve current budget utilization vs monthly limit.",
)
def get_budget_summary(
  session: SessionDep,
) -> BudgetSummaryResponse:
  return BudgetService.get_summary(session)


@budget_router.post(
  "/budget/expenses",
  response_model=BudgetEntryResponse,
  summary="Record an entry",
  description="Manually log a new budget entry (Librarian-only).",
)
def record_expense(
  request: RecordBudgetEntryRequest,
  session: SessionDep,
  _: StaffDep,
) -> BudgetEntryResponse:
  return BudgetService.record_expense(session, request)
