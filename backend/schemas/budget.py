import datetime

from pydantic import BaseModel
from sqlmodel import SQLModel


class BudgetEntryResponse(SQLModel):
  id: int
  description: str
  category: str
  amount: float
  type: str
  date: datetime.date


class BudgetSummaryResponse(SQLModel):
  budget_limit: float
  budget_spent: float
  total_expenses: float
  total_income: float
  entries: list[BudgetEntryResponse]


class RecordBudgetEntryRequest(SQLModel):
  description: str
  category: str
  amount: float
  type: str


class ExpenseItemResponse(SQLModel):
  title: str
  category: str | None
  copies: int
  price_per_copy: float
  total_cost: float
  purchase_date: datetime.date


class MonthlyTrendItem(BaseModel):
  month: str
  checkouts: int
  returns: int


class CategoryBreakdownItem(BaseModel):
  category: str
  checkouts: int
  percentage: float


class TopBorrowedBookItem(BaseModel):
  id: int
  title: str
  author: str
  category: str
  checkouts: int
  available: int


class UsageReportResponse(SQLModel):
  active_members: int
  books_issued: int
  popular_categories: list[str]
  monthly_trends: list[MonthlyTrendItem] = []
  category_breakdown: list[CategoryBreakdownItem] = []
  top_borrowed_books: list[TopBorrowedBookItem] = []


class ExpenseSummaryItem(BaseModel):
  total_budget: float
  total_spent: float
  fine_income: float
  net_spend: float
  budget_utilization_percent: float


class MonthlyExpenseItem(BaseModel):
  month: str
  budget: float
  spent: float
  income: float


class ExpenseReportResponse(SQLModel):
  month: int
  year: int
  items: list[ExpenseItemResponse]
  summary: ExpenseSummaryItem | None = None
  monthly_expenses: list[MonthlyExpenseItem] = []
