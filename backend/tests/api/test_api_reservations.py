"""Tests for Reservations & Waitlist Queue API endpoints."""

from fastapi.testclient import TestClient
from sqlmodel import Session

from models.book import Book
from models.user import User


def test_create_and_cancel_reservation(
  client: TestClient,
  db_session: Session,
  normal_user_token: str,
  normal_user: User,
):
  """Verify member creating and canceling a reservation."""
  book = Book(title="Reserved Book", author="Author", category="Sci-Fi", price=25.0)
  db_session.add(book)
  db_session.commit()
  db_session.refresh(book)

  headers = {"Authorization": f"Bearer {normal_user_token}"}
  create_resp = client.post(
    "/reservations",
    json={"book_id": book.id},
    headers=headers,
  )
  assert create_resp.status_code == 201
  res_data = create_resp.json()
  assert res_data["book_id"] == book.id
  assert res_data["status"] == "WAITING"

  member_res_resp = client.get(f"/members/{normal_user.id}/reservations", headers=headers)
  assert member_res_resp.status_code == 200
  assert len(member_res_resp.json()) == 1

  cancel_resp = client.delete(f"/reservations/{res_data['id']}", headers=headers)
  assert cancel_resp.status_code == 204


def test_get_reservation_alerts_as_librarian(client: TestClient, librarian_user_token: str):
  """Verify librarian can fetch reservation alerts."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  response = client.get("/reservations/alerts", headers=headers)
  assert response.status_code == 200
  assert isinstance(response.json(), list)
