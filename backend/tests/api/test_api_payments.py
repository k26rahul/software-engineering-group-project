"""Tests for Payments API endpoints."""

from datetime import date

from fastapi.testclient import TestClient
from sqlmodel import Session

from models.book import Book, BookCopy
from models.enums import PaymentType, ReturnCondition
from models.payment import Fine
from models.transaction import Transaction
from models.user import User


def test_get_pending_fines(
  client: TestClient, db_session: Session, normal_user: User, normal_user_token: str
):
  """Verify retrieving pending fines for a member."""
  # Setup dummy data
  book = Book(title="Test", author="Test", category="Test", price=10.0)
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

  fine = Fine(
    transaction_id=tx.id,
    member_id=normal_user.id,
    amount=15.50,
    reason=ReturnCondition.DAMAGED,
    is_paid=False,
  )
  db_session.add(fine)
  db_session.commit()

  headers = {"Authorization": f"Bearer {normal_user_token}"}
  response = client.get("/payments/fines", headers=headers)

  assert response.status_code == 200
  data = response.json()
  assert len(data) == 1
  assert data[0]["amount"] == 15.50
  assert data[0]["is_paid"] is False


def test_pay_fine(
  client: TestClient, db_session: Session, normal_user: User, normal_user_token: str
):
  """Verify processing a fine payment."""
  book = Book(title="Test", author="Test", category="Test", price=10.0)
  db_session.add(book)
  db_session.commit()

  copy = BookCopy(book_id=book.id, copy_number=2)
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

  fine = Fine(
    transaction_id=tx.id,
    member_id=normal_user.id,
    amount=20.0,
    reason=ReturnCondition.LOST,
    is_paid=False,
  )
  db_session.add(fine)
  db_session.commit()
  db_session.refresh(fine)

  headers = {"Authorization": f"Bearer {normal_user_token}"}
  payload = {"type": PaymentType.FINE_PAYMENT.value, "amount": 20.0, "fine_id": fine.id}

  response = client.post(f"/payments/fines/{fine.id}", json=payload, headers=headers)
  assert response.status_code == 200
  data = response.json()
  assert data["amount"] == 20.0
  assert data["status"] == "COMPLETED"

  # Verify fine is paid
  db_session.refresh(fine)
  assert fine.is_paid is True


def test_pay_membership_renewal(client: TestClient, normal_user_token: str):
  """Verify processing membership renewal payment."""
  headers = {"Authorization": f"Bearer {normal_user_token}"}
  payload = {"type": PaymentType.MEMBERSHIP_FEE.value, "amount": 100.0}

  response = client.post("/payments/membership-renewal", json=payload, headers=headers)
  assert response.status_code == 200
  data = response.json()
  assert data["amount"] == 100.0
  assert data["type"] == PaymentType.MEMBERSHIP_FEE.value


def test_get_payment_history(
  client: TestClient, db_session: Session, normal_user: User, normal_user_token: str
):
  """Verify retrieving payment history."""
  # Create a payment via API
  headers = {"Authorization": f"Bearer {normal_user_token}"}
  payload = {"type": PaymentType.MEMBERSHIP_FEE.value, "amount": 100.0}
  client.post("/payments/membership-renewal", json=payload, headers=headers)

  response = client.get("/payments/history", headers=headers)
  assert response.status_code == 200
  data = response.json()
  assert len(data) >= 1
  assert data[-1]["amount"] == 100.0
