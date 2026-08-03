"""Tests for Circulation & Transactions API endpoints."""

from datetime import date, timedelta

from fastapi.testclient import TestClient
from sqlmodel import Session

from models.book import Book, BookCopy
from models.user import User


def test_issue_and_return_book(
  client: TestClient,
  db_session: Session,
  librarian_user_token: str,
  normal_user: User,
):
  """Verify issuing a book copy to a member and returning it."""
  book = Book(title="Test Book", author="Test Author", category="Fiction", price=19.99)
  db_session.add(book)
  db_session.commit()
  db_session.refresh(book)

  copy = BookCopy(book_id=book.id, copy_number=1)
  db_session.add(copy)
  db_session.commit()
  db_session.refresh(copy)

  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  due_date = (date.today() + timedelta(days=14)).isoformat()

  issue_resp = client.post(
    "/transactions/issue",
    json={"member_id": normal_user.id, "book_copy_id": copy.id, "due_date": due_date},
    headers=headers,
  )
  assert issue_resp.status_code == 201
  tx_data = issue_resp.json()
  assert tx_data["member_id"] == normal_user.id
  assert tx_data["return_date"] is None

  curr_issues_resp = client.get(
    f"/members/{normal_user.id}/current-issues",
    headers=headers,
  )
  assert curr_issues_resp.status_code == 200
  assert len(curr_issues_resp.json()) == 1

  return_resp = client.post(
    "/transactions/return",
    json={"transaction_id": tx_data["id"], "condition": "GOOD"},
    headers=headers,
  )
  assert return_resp.status_code == 200
  assert return_resp.json()["return_date"] is not None


def test_get_overdue_transactions(client: TestClient, librarian_user_token: str):
  """Verify overdue transactions list endpoint returns 200."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  response = client.get("/transactions/overdue", headers=headers)
  assert response.status_code == 200
  assert isinstance(response.json(), list)


def test_issue_limit_exceeded(
  client: TestClient,
  db_session: Session,
  librarian_user_token: str,
  normal_user: User,
):
  """Verify that issuing a book fails if the member exceeds their max issue limit."""
  # Set max issue limit to 0 to simulate the limit being reached
  normal_user.max_issue_limit = 0
  db_session.add(normal_user)
  db_session.commit()

  book = Book(title="Limit Test Book", author="Author", category="Fiction", price=10.0)
  db_session.add(book)
  db_session.commit()
  db_session.refresh(book)

  copy = BookCopy(book_id=book.id, copy_number=1)
  db_session.add(copy)
  db_session.commit()
  db_session.refresh(copy)

  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  due_date = (date.today() + timedelta(days=14)).isoformat()

  # Attempt to issue book should fail due to limit
  issue_resp = client.post(
    "/transactions/issue",
    json={"member_id": normal_user.id, "book_copy_id": copy.id, "due_date": due_date},
    headers=headers,
  )
  assert issue_resp.status_code == 409
  assert "maximum borrowing limit" in issue_resp.json()["detail"]
