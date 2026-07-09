from fastapi.testclient import TestClient

from models.enums import MembershipType, UserRole


def test_register_success(client: TestClient):
  """Verifies that a member is successfully registered and inactive by default."""
  response = client.post(
    "/auth/register",
    json={
      "email": "newuser@test.com",
      "password": "strongpassword123",
      "name": "New User",
      "membership_type": MembershipType.ON_CAMPUS,
    },
  )
  assert response.status_code == 201
  data = response.json()
  assert data["email"] == "newuser@test.com"
  assert data["name"] == "New User"
  assert data["membership_type"] == MembershipType.ON_CAMPUS
  assert data["role"] == UserRole.MEMBER
  assert data["is_active"] is False
  assert "id" in data
  assert "password_hash" not in data


def test_register_duplicate_email(client: TestClient, normal_user):
  """Verifies that registering with an existing email returns a 409 Conflict."""
  # Try to register with an existing user's email
  response = client.post(
    "/auth/register",
    json={
      "email": normal_user.email,
      "password": "anotherpassword",
      "name": "Duplicate User",
      "membership_type": MembershipType.OFF_CAMPUS,
    },
  )
  assert response.status_code == 409
  assert response.json()["detail"] == "Email already registered."


def test_login_success(client: TestClient, normal_user):
  """Verifies that an active user can log in successfully with valid credentials."""
  # conftest creates normal_user with password 'password123'
  response = client.post(
    "/auth/login",
    json={
      "email": normal_user.email,
      "password": "password123",
    },
  )
  assert response.status_code == 200
  data = response.json()
  assert "access_token" in data
  assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client: TestClient, normal_user):
  """Verifies that login fails and returns 401 with invalid credentials."""
  response = client.post(
    "/auth/login",
    json={
      "email": normal_user.email,
      "password": "wrongpassword",
    },
  )
  assert response.status_code == 401
  assert response.json()["detail"] == "Invalid credentials."


def test_login_inactive_user(client: TestClient, inactive_user):
  """Verifies that an inactive user cannot log in and gets a 403 Forbidden."""
  response = client.post(
    "/auth/login",
    json={
      "email": inactive_user.email,
      "password": "password123",
    },
  )
  assert response.status_code == 403
  assert response.json()["detail"] == "Account is inactive."


def test_get_current_user_me(client: TestClient, normal_user, normal_user_token):
  """Verifies that the /auth/me endpoint returns the correct profile info."""
  # Get /auth/me
  response = client.get(
    "/auth/me",
    headers={"Authorization": f"Bearer {normal_user_token}"},
  )
  assert response.status_code == 200
  data = response.json()
  assert data["email"] == normal_user.email
  assert data["name"] == normal_user.name
  assert data["role"] == normal_user.role


def test_change_password_success(client: TestClient, normal_user, normal_user_token):
  """Verifies that a user can change their password successfully."""
  response = client.post(
    "/auth/change-password",
    headers={"Authorization": f"Bearer {normal_user_token}"},
    json={
      "current_password": "password123",
      "new_password": "newstrongpassword456",
    },
  )
  assert response.status_code == 204

  # Verify we can login with the new password
  new_login_response = client.post(
    "/auth/login",
    json={"email": normal_user.email, "password": "newstrongpassword456"},
  )
  assert new_login_response.status_code == 200


def test_change_password_invalid_old_password(client: TestClient, normal_user_token):
  """Verifies that changing password fails if the current password is incorrect."""
  response = client.post(
    "/auth/change-password",
    headers={"Authorization": f"Bearer {normal_user_token}"},
    json={
      "current_password": "wrongcurrentpassword",
      "new_password": "newstrongpassword456",
    },
  )
  assert response.status_code == 400
  assert response.json()["detail"] == "Current password is incorrect."


def test_logout_success(client: TestClient, normal_user_token):
  """Verifies that logging out invalidates the user's access token."""
  # Call logout
  response = client.post(
    "/auth/logout",
    headers={"Authorization": f"Bearer {normal_user_token}"},
  )
  assert response.status_code == 204

  # Verify the token is now blocklisted by calling /auth/me
  me_response = client.get(
    "/auth/me",
    headers={"Authorization": f"Bearer {normal_user_token}"},
  )
  assert me_response.status_code == 401
  assert me_response.json()["detail"] == "Token has been invalidated."
