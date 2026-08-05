"""Tests for Recommendations API endpoints."""

from fastapi.testclient import TestClient

from models.user import User


def test_get_recommendations_success(client: TestClient, normal_user_token: str, normal_user: User):
  """Verify getting book recommendations for an authenticated user."""
  headers = {"Authorization": f"Bearer {normal_user_token}"}
  response = client.get(f"/members/{normal_user.id}/recommendations", headers=headers)

  assert response.status_code == 200
  data = response.json()
  assert isinstance(data, list)
  # Even with empty history, it should fallback to returning up to 5 books
  assert len(data) <= 5


def test_get_recommendations_unauthorized(client: TestClient, normal_user: User):
  """Verify getting recommendations requires authentication."""
  response = client.get(f"/members/{normal_user.id}/recommendations")
  assert response.status_code == 401
