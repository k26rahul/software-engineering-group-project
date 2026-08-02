from fastapi import APIRouter

dashboard_router = APIRouter(tags=["Dashboard"])

# Routes to implement:
#
# GET  /dashboard/librarian
#   Description: Retrieves aggregated dashboard metrics, pending approvals,
#                and overdue alerts for librarians.
#   Response: LibrarianDashboardResponse
#
# GET  /dashboard/management
#   Description: Retrieves aggregated campus management analytics, circulation metrics,
#                budget stats, and trends.
#   Response: ManagementDashboardResponse
