"""Router: Budget.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

budget_router = APIRouter(tags=["Budget"])

# Routes to implement:
#
# POST  /budget/purchases
#   Description: Records a new book purchase entry for budget tracking.
#
# GET  /budget/summary
#   Description: Retrieves a summary of budget utilization for a specific month and year.
#
# GET  /budget/expense-report
#   Description: Generates the raw expense data itemizing purchases by category and vendor.
