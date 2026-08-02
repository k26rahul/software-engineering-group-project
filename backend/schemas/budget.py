from datetime import date

from sqlmodel import SQLModel


class RecordPurchaseRequest(SQLModel):
  title: str
  copies: int
  price_per_copy: float
  vendor_id: int | None = None
  category: str | None = None
  purchase_date: date


class BudgetSummaryResponse(SQLModel):
  month: int
  year: int
  total_spent: float
  purchase_count: int


class ExpenseItemResponse(SQLModel):
  title: str
  category: str | None
  copies: int
  price_per_copy: float
  total_cost: float
  purchase_date: date


class UsageReportResponse(SQLModel):
  active_members: int
  books_issued: int
  popular_categories: list[str]


class ExpenseReportResponse(SQLModel):
  month: int
  year: int
  items: list[ExpenseItemResponse]
