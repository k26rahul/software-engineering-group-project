"""Schemas for Dashboard & Analytics domain."""

from sqlmodel import SQLModel


class LibrarianDashboardResponse(SQLModel):
  total_books: int
  active_issues: int
  overdue_issues: int
  pending_approvals: int
  recent_alerts: list[str]


class ManagementDashboardResponse(SQLModel):
  total_members: int
  total_catalog_items: int
  total_circulation_count: int
  active_subscriptions_count: int
  total_budget_allocated: float
  total_budget_spent: float
