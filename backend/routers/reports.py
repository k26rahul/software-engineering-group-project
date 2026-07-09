from fastapi import APIRouter

reports_router = APIRouter(tags=["Reports"])

# Routes to implement:
#
# GET  /reports/usage
#   Description: Aggregates usage metrics such as active members and popular categories.
#   Response: UsageReportResponse
#
# GET  /reports/expense
#   Description: Retrieves the formatted expense report data for a given month.
#   Response: ExpenseReportResponse
#
# GET  /reports/download/{type}
#   Description: Downloads the specified report in a requested format.
