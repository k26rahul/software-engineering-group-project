"""Dashboard & Analytics API router handling librarian and campus management dashboard metrics."""

from fastapi import APIRouter

from core.dependencies import LibrarianDep, ManagementDep, SessionDep
from schemas.dashboard import LibrarianDashboardResponse, ManagementDashboardResponse
from services.dashboard import DashboardService

dashboard_router = APIRouter(tags=["Dashboard"])


@dashboard_router.get(
  "/dashboard/librarian",
  response_model=LibrarianDashboardResponse,
  summary="Get librarian dashboard",
  description="Librarian-only. Retrieves aggregated metrics, pending member approvals, and overdue alerts.",
)
def get_librarian_dashboard(
  session: SessionDep,
  _: LibrarianDep,
) -> LibrarianDashboardResponse:
  return DashboardService.get_librarian_dashboard(session)


@dashboard_router.get(
  "/dashboard/management",
  response_model=ManagementDashboardResponse,
  summary="Get campus management dashboard",
  description="Management-only. Retrieves aggregated campus management analytics, circulation metrics, and budget stats.",
)
def get_management_dashboard(
  session: SessionDep,
  _: ManagementDep,
) -> ManagementDashboardResponse:
  return DashboardService.get_management_dashboard(session)
