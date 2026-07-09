from fastapi.testclient import TestClient

from models.enums import MembershipType


def test_register_success(client: TestClient):
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
    assert "id" in data
    assert "password_hash" not in data


def test_register_duplicate_email(client: TestClient, normal_user):
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
    assert "already registered" in response.json()["detail"].lower()


def test_login_success(client: TestClient, normal_user):
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
    response = client.post(
        "/auth/login",
        json={
            "email": normal_user.email,
            "password": "wrongpassword",
        },
    )
    assert response.status_code == 401
    assert "invalid credentials" in response.json()["detail"].lower()


def test_get_current_user_me(client: TestClient, normal_user):
    # 1. Login to get token
    login_response = client.post(
        "/auth/login",
        json={"email": normal_user.email, "password": "password123"},
    )
    token = login_response.json()["access_token"]

    # 2. Get /auth/me
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == normal_user.email
    assert data["name"] == normal_user.name
    assert data["role"] == normal_user.role


def test_change_password_success(client: TestClient, normal_user):
    login_response = client.post(
        "/auth/login",
        json={"email": normal_user.email, "password": "password123"},
    )
    token = login_response.json()["access_token"]

    response = client.post(
        "/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
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


def test_change_password_invalid_old_password(client: TestClient, normal_user):
    login_response = client.post(
        "/auth/login",
        json={"email": normal_user.email, "password": "password123"},
    )
    token = login_response.json()["access_token"]

    response = client.post(
        "/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "wrongcurrentpassword",
            "new_password": "newstrongpassword456",
        },
    )
    assert response.status_code == 400
    assert "current password is incorrect" in response.json()["detail"].lower()


def test_logout_success(client: TestClient, normal_user):
    login_response = client.post(
        "/auth/login",
        json={"email": normal_user.email, "password": "password123"},
    )
    token = login_response.json()["access_token"]

    # Call logout
    response = client.post(
        "/auth/logout",
        json={"token": token},
    )
    assert response.status_code == 204

    # Verify the token is now blocklisted by calling /auth/me
    me_response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_response.status_code == 401
    assert "invalidated" in me_response.json()["detail"].lower()
