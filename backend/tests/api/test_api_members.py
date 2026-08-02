"""Tests for Members Management API endpoints."""

from fastapi.testclient import TestClient
from models.user import User


def test_list_members_as_librarian(
  client: TestClient, librarian_user_token: str, normal_user: User
):
  """Verify librarian can list members."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  response = client.get("/members", headers=headers)
  assert response.status_code == 200
  data = response.json()
  assert any(u["email"] == normal_user.email for u in data)


def test_list_members_as_member_forbidden(client: TestClient, normal_user_token: str):
  """Verify non-librarian member cannot list member directory."""
  headers = {"Authorization": f"Bearer {normal_user_token}"}
  response = client.get("/members", headers=headers)
  assert response.status_code == 403


def test_get_member_detail(client: TestClient, normal_user_token: str, normal_user: User):
  """Verify retrieving profile details for a member."""
  headers = {"Authorization": f"Bearer {normal_user_token}"}
  response = client.get(f"/members/{normal_user.id}", headers=headers)
  assert response.status_code == 200
  data = response.json()
  assert data["email"] == normal_user.email
  assert data["id"] == normal_user.id


def test_approve_and_reject_member(
  client: TestClient, librarian_user_token: str, inactive_user: User
):
  """Verify librarian can approve and reject a member account."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}

  approve_resp = client.patch(f"/members/{inactive_user.id}/approve", headers=headers)
  assert approve_resp.status_code == 204

  member_resp = client.get(f"/members/{inactive_user.id}", headers=headers)
  assert member_resp.json()["approval_status"] == "APPROVED"
  assert member_resp.json()["is_active"] is True

  reject_resp = client.patch(f"/members/{inactive_user.id}/reject", headers=headers)
  assert reject_resp.status_code == 204

  member_resp2 = client.get(f"/members/{inactive_user.id}", headers=headers)
  assert member_resp2.json()["approval_status"] == "REJECTED"
  assert member_resp2.json()["is_active"] is False


def test_update_member_profile(client: TestClient, normal_user_token: str, normal_user: User):
  """Verify updating a member's profile."""
  headers = {"Authorization": f"Bearer {normal_user_token}"}
  update_resp = client.patch(
    f"/members/{normal_user.id}/profile",
    json={"name": "Updated Member Name", "phone": "555-0199"},
    headers=headers,
  )
  assert update_resp.status_code == 200
  assert update_resp.json()["name"] == "Updated Member Name"
