from fastapi import HTTPException, status
from sqlmodel import Session, select

from core.auth import (
  create_access_token,
  hash_password,
  token_blocklist,
  verify_password,
)
from models.auth import (
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
)
from models.enums import MemberApprovalStatus, UserRole
from models.user import User, UserProfileResponse


def login(body: LoginRequest, session: Session) -> TokenResponse:
  """Authenticates a user by email and password and returns a JWT."""
  user = session.exec(select(User).where(User.email == body.email)).first()
  if user is None or not verify_password(body.password, user.password_hash):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
  if not user.is_active:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive.")
  token = create_access_token(subject=user.id)
  return TokenResponse(access_token=token)


def register(body: RegisterRequest, session: Session) -> UserProfileResponse:
  """Creates a new member with PENDING approval status."""
  existing = session.exec(select(User).where(User.email == body.email)).first()
  if existing is not None:
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail="Email already registered.",
    )
  user = User(
    email=body.email,
    password_hash=hash_password(body.password),
    name=body.name,
    phone=body.phone,
    role=UserRole.MEMBER,
    membership_type=body.membership_type,
    approval_status=MemberApprovalStatus.PENDING,
    is_active=False,
    max_issue_limit=0,
  )
  session.add(user)
  session.commit()
  session.refresh(user)
  return UserProfileResponse.model_validate(user)


def logout(token: str) -> None:
  """Adds the token to the in-memory blocklist to invalidate it."""
  token_blocklist.add(token)


def change_password(body: ChangePasswordRequest, user: User, session: Session) -> None:
  """Verifies the current password and replaces it with the new one."""
  if not verify_password(body.current_password, user.password_hash):
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Current password is incorrect.",
    )
  user.password_hash = hash_password(body.new_password)
  session.add(user)
  session.commit()


def get_current_user(user: User) -> UserProfileResponse:
  """Returns the profile of the authenticated user."""
  return UserProfileResponse.model_validate(user)
