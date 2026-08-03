"""Dashboard & Analytics API router handling librarian and campus management dashboard metrics."""

from fastapi import APIRouter

from core.dependencies import LibrarianDep, ManagementDep, SessionDep
from schemas.dashboard import LibrarianDashboardResponse, ManagementDashboardResponse
from services.dashboard import DashboardService

dashboard_router = APIRouter(tags=["Dashboard"])

# Shared response sets for common error patterns.
_AUTH_ERRORS = {401: {"description": "Invalid, expired, or revoked token."}}


@dashboard_router.get(
  "/dashboard/librarian",
  response_model=LibrarianDashboardResponse,
  summary="Get librarian dashboard",
  description=(
    "Librarian-only. Retrieves aggregated metrics, pending member approvals, and overdue alerts."
  ),
  responses={
    **_AUTH_ERRORS,
    403: {"description": "Insufficient permissions. Librarian role required."},
  },
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
  description=(
    "Management-only. Retrieves campus management analytics, circulation metrics, and budget stats."
  ),
  responses={
    **_AUTH_ERRORS,
    403: {"description": "Insufficient permissions. Campus Management role required."},
  },
)
def get_management_dashboard(
  session: SessionDep,
  _: ManagementDep,
) -> ManagementDashboardResponse:
  return DashboardService.get_management_dashboard(session)
