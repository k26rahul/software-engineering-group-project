import pytest
from fastapi import HTTPException
from sqlmodel import Session

from core.auth import create_access_token, token_blocklist
from core.dependencies import _require_role, get_current_user
from models.enums import UserRole
from models.user import User


def test_get_current_user_success(db_session: Session, normal_user: User):
  token = create_access_token(subject=normal_user.id)
  user = get_current_user(token=token, session=db_session)
  assert user.id == normal_user.id
  assert user.email == normal_user.email


def test_get_current_user_blocklisted(db_session: Session, normal_user: User):
  token = create_access_token(subject=normal_user.id)
  # Manually add to blocklist
  token_blocklist.add(token)

  with pytest.raises(HTTPException) as exc_info:
    get_current_user(token=token, session=db_session)

  assert exc_info.value.status_code == 401
  assert "invalidated" in exc_info.value.detail

  # Cleanup blocklist so it doesn't leak into other tests
  token_blocklist.remove(token)


def test_get_current_user_invalid_token(db_session: Session):
  with pytest.raises(HTTPException) as exc_info:
    get_current_user(token="invalid.token.string", session=db_session)

  assert exc_info.value.status_code == 401
  assert "Invalid or expired token" in exc_info.value.detail


def test_get_current_user_not_found(db_session: Session):
  # Subject 99999 does not exist in the DB
  token = create_access_token(subject=99999)
  with pytest.raises(HTTPException) as exc_info:
    get_current_user(token=token, session=db_session)

  assert exc_info.value.status_code == 401
  assert "User not found or inactive" in exc_info.value.detail


def test_get_current_user_inactive(db_session: Session, inactive_user: User):
  token = create_access_token(subject=inactive_user.id)
  with pytest.raises(HTTPException) as exc_info:
    get_current_user(token=token, session=db_session)

  assert exc_info.value.status_code == 401
  assert "User not found or inactive" in exc_info.value.detail


def test_require_role_success(librarian_user: User):
  # Extract the actual dependency function
  dependency_func = _require_role(UserRole.LIBRARIAN)

  # Check that it returns the user if the role matches
  returned_user = dependency_func.dependency(current_user=librarian_user)
  assert returned_user.id == librarian_user.id


def test_require_role_forbidden(normal_user: User):
  # Require LIBRARIAN, but provide a MEMBER user
  dependency_func = _require_role(UserRole.LIBRARIAN)

  with pytest.raises(HTTPException) as exc_info:
    dependency_func.dependency(current_user=normal_user)

  assert exc_info.value.status_code == 403
  assert "permission to perform this action" in exc_info.value.detail
