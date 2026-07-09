from fastapi import APIRouter

budget_router = APIRouter(tags=["Budget"])

# Routes to implement:
#
# POST  /budget/purchases
#   Description: Records a new book purchase entry for budget tracking.
#   Request:  RecordPurchaseRequest
#   Response: ExpenseItemResponse
#
# GET  /budget/summary
#   Description: Retrieves a summary of budget utilization for a specific month and year.
#   Response: BudgetSummaryResponse
#
# GET  /budget/expense-report
#   Description: Generates the raw expense data itemizing purchases by category and vendor.
#   Response: list[ExpenseItemResponse]
