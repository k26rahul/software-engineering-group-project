"""Schemas for Dashboard & Analytics domain."""

from datetime import date
from sqlmodel import SQLModel
from pydantic import BaseModel


class PendingApprovalItem(BaseModel):
  id: int
  name: str
  email: str
  created_at: date


class OverdueBookItem(BaseModel):
  transaction_id: int
  title: str
  borrower_name: str
  due_date: date
  days_overdue: int


class LibrarianDashboardResponse(SQLModel):
  total_books: int
  active_issues: int
  overdue_issues: int
  pending_approvals: int
  pending_approvals_list: list[PendingApprovalItem] = []
  recent_overdue_books: list[OverdueBookItem] = []
  recent_alerts: list[str]
  budget_limit: float = 10000.0
  budget_spent: float = 0.0


class MonthlyStatItem(BaseModel):
  name: str
  issues: int
  spent: float


class CategoryStatItem(BaseModel):
  name: str
  value: int


class ManagementDashboardResponse(SQLModel):
  total_members: int
  active_members: int
  active_issues: int
  total_books: int
  budget_spent: float
  budget_limit: float
  monthly_stats: list[MonthlyStatItem] = []
  category_stats: list[CategoryStatItem] = []
