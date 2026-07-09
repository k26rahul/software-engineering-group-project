from fastapi import APIRouter

from core.dependencies import CurrentUserDep, SessionDep, TokenDep
from models.auth import (
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
)
from models.user import UserProfileResponse
from services import auth as auth_service

auth_router = APIRouter(tags=["Authentication"])


@auth_router.post("/auth/login", response_model=TokenResponse)
def login(body: LoginRequest, session: SessionDep) -> TokenResponse:
  """Authenticates a user and returns an access token."""
  return auth_service.login(body, session)


@auth_router.post("/auth/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, session: SessionDep) -> TokenResponse:
  """Registers a new member account with pending approval and logs them in."""
  return auth_service.register(body, session)


@auth_router.post("/auth/logout", status_code=204)
def logout(token: TokenDep) -> None:
  """Logs out the user by invalidating the active token."""
  auth_service.logout(token)


@auth_router.post("/auth/change-password", status_code=204)
def change_password(
  body: ChangePasswordRequest,
  current_user: CurrentUserDep,
  session: SessionDep,
) -> None:
  """Changes the password of the currently authenticated user."""
  auth_service.change_password(body, current_user, session)


@auth_router.get("/auth/me", response_model=UserProfileResponse)
def get_current_user(current_user: CurrentUserDep) -> UserProfileResponse:
  """Retrieves the profile of the currently logged-in user."""
  return auth_service.get_current_user(current_user)
