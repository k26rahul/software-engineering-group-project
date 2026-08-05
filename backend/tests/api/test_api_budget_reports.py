"""Tests for Budget and Reports API endpoints."""

from datetime import date

from fastapi.testclient import TestClient
from sqlmodel import Session

from models.book import Book, BookCopy
from models.budget import BookPurchaseEntry
from models.transaction import Transaction
from models.user import User


def test_get_budget_summary(client: TestClient, db_session: Session, librarian_user_token: str):
  """Verify retrieving budget summary."""
  entry = BookPurchaseEntry(
    title="Test Book",
    copies=5,
    price_per_copy=20.0,
    category="Fiction",
    purchase_date=date.today(),
  )
  db_session.add(entry)
  db_session.commit()

  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  response = client.get("/budget", headers=headers)

  assert response.status_code == 200
  data = response.json()
  assert data["total_spent"] >= 100.0
  assert data["purchase_count"] >= 1


def test_record_expense(client: TestClient, librarian_user_token: str):
  """Verify manually recording an expense as a librarian."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  payload = {
    "title": "New Python Book",
    "copies": 2,
    "price_per_copy": 50.0,
    "category": "Technology",
    "purchase_date": date.today().isoformat(),
  }

  response = client.post("/budget/expenses", json=payload, headers=headers)
  assert response.status_code == 200
  data = response.json()
  assert data["title"] == "New Python Book"
  assert data["total_cost"] == 100.0


def test_record_expense_unauthorized(client: TestClient, normal_user_token: str):
  """Verify that a normal member cannot record an expense."""
  headers = {"Authorization": f"Bearer {normal_user_token}"}
  payload = {
    "title": "New Python Book",
    "copies": 2,
    "price_per_copy": 50.0,
    "category": "Technology",
    "purchase_date": date.today().isoformat(),
  }

  response = client.post("/budget/expenses", json=payload, headers=headers)
  assert response.status_code == 403


def test_get_usage_report(
  client: TestClient, db_session: Session, librarian_user_token: str, normal_user: User
):
  """Verify retrieving aggregated usage report data."""
  book = Book(title="Report Test", author="Author", category="Science", price=10.0)
  db_session.add(book)
  db_session.commit()

  copy = BookCopy(book_id=book.id, copy_number=1)
  db_session.add(copy)
  db_session.commit()

  tx = Transaction(
    member_id=normal_user.id,
    book_copy_id=copy.id,
    issue_date=date(2026, 1, 1),
    due_date=date(2026, 1, 15),
  )
  db_session.add(tx)
  db_session.commit()

  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  response = client.get("/reports/usage", headers=headers)

  assert response.status_code == 200
  data = response.json()
  assert data["active_members"] >= 1
  assert data["books_issued"] >= 1
  assert "Science" in data["popular_categories"]


def test_get_expense_report(client: TestClient, db_session: Session, librarian_user_token: str):
  """Verify retrieving aggregated expense report data."""
  entry = BookPurchaseEntry(
    title="Expense Report Book",
    copies=1,
    price_per_copy=15.0,
    category="History",
    purchase_date=date.today(),
  )
  db_session.add(entry)
  db_session.commit()

  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  response = client.get("/reports/expense", headers=headers)

  assert response.status_code == 200
  data = response.json()
  assert data["month"] == date.today().month
  assert data["year"] == date.today().year
  assert any(item["title"] == "Expense Report Book" for item in data["items"])


def test_download_report(client: TestClient, librarian_user_token: str):
  """Verify dummy download endpoint."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  response = client.get("/reports/download/usage", headers=headers)

  assert response.status_code == 200
  data = response.json()
  assert data["status"] == "success"
  assert data["download_url"] == "/exports/report_usage.csv"
