"""Router: Reports.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

reports_router = APIRouter(tags=["Reports"])

# Routes to implement:
#
# GET  /reports/usage
#   Description: Aggregates usage metrics such as active members and popular categories.
#
# GET  /reports/expense
#   Description: Retrieves the formatted expense report data for a given month.
#
# GET  /reports/download/{type}
#   Description: Downloads the specified report in a requested format.
