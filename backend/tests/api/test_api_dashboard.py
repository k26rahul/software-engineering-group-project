"""Tests for Dashboard & Analytics API endpoints."""

from fastapi.testclient import TestClient


def test_get_librarian_dashboard(client: TestClient, librarian_user_token: str):
  """Verify librarian can retrieve dashboard metrics and alerts."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  response = client.get("/dashboard/librarian", headers=headers)
  assert response.status_code == 200
  data = response.json()
  assert "total_books" in data
  assert "active_issues" in data
  assert "overdue_issues" in data
  assert "pending_approvals" in data
  assert isinstance(data["recent_alerts"], list)


def test_get_management_dashboard(client: TestClient, management_user_token: str):
  """Verify campus management can retrieve dashboard metrics and budget stats."""
  headers = {"Authorization": f"Bearer {management_user_token}"}
  response = client.get("/dashboard/management", headers=headers)
  assert response.status_code == 200
  data = response.json()
  assert "total_members" in data
  assert "active_members" in data
  assert "active_issues" in data
  assert "total_books" in data
  assert "budget_spent" in data
  assert "budget_limit" in data
