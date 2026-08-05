from fastapi import APIRouter, Path

from core.dependencies import SessionDep
from schemas.budget import ExpenseReportResponse, UsageReportResponse
from services.reports import ReportsService

reports_router = APIRouter(tags=["Reports"])

@reports_router.get(
  "/reports/usage",
  response_model=UsageReportResponse,
  summary="Get usage report",
  description="Aggregates usage metrics such as active members and popular categories.",
)
def get_usage_report(
  session: SessionDep,
) -> UsageReportResponse:
  return ReportsService.get_usage_report(session)

@reports_router.get(
  "/reports/expense",
  response_model=ExpenseReportResponse,
  summary="Get expense report",
  description="Retrieves the formatted expense report data for a given month.",
)
def get_expense_report(
  session: SessionDep,
) -> ExpenseReportResponse:
  return ReportsService.get_expense_report(session)

@reports_router.get(
  "/reports/download/{type}",
  summary="Download report",
  description="Downloads the specified report in a requested format.",
)
def download_report(
  type: str = Path(..., description="Report type, e.g., 'usage' or 'expense'"),
) -> dict:
  return {
    "status": "success",
    "message": f"Report format '{type}' generated successfully.",
    "download_url": f"/exports/report_{type}.csv"
  }
