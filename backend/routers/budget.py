from fastapi import APIRouter

from core.dependencies import SessionDep, RequireRole
from models.enums import UserRole
from schemas.budget import BudgetSummaryResponse, ExpenseItemResponse, RecordPurchaseRequest
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
  response_model=ExpenseItemResponse,
  summary="Record an expense",
  description="Manually log a new expense (Librarian-only).",
  dependencies=[RequireRole([UserRole.LIBRARIAN, UserRole.CAMPUS_MANAGEMENT])]
)
def record_expense(
  request: RecordPurchaseRequest,
  session: SessionDep,
) -> ExpenseItemResponse:
  return BudgetService.record_expense(session, request)
