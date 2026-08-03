from fastapi import APIRouter

from core.dependencies import CurrentUserDep, SessionDep, TokenDep
from schemas.auth import (
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
)
from schemas.user import UserProfileResponse
from services import auth as auth_service

auth_router = APIRouter(tags=["Authentication"])

# Shared response sets for common error patterns.
_AUTH_ERRORS = {401: {"description": "Invalid, expired, or revoked token."}}
_AUTH_INPUT_ERRORS = {400: {"description": "Invalid input in request body."}}


@auth_router.post(
  "/auth/login",
  response_model=TokenResponse,
  responses={401: {"description": "Invalid email or password."}},
)
def login(body: LoginRequest, session: SessionDep) -> TokenResponse:
  """Authenticates a user and returns an access token."""
  return auth_service.login(body, session)


@auth_router.post(
  "/auth/register",
  response_model=TokenResponse,
  status_code=201,
  responses={409: {"description": "Email is already registered."}},
)
def register(body: RegisterRequest, session: SessionDep) -> TokenResponse:
  """Registers a new member account with pending approval and logs them in."""
  return auth_service.register(body, session)


@auth_router.post(
  "/auth/logout",
  status_code=204,
  responses={**_AUTH_ERRORS},
)
def logout(token: TokenDep) -> None:
  """Logs out the user by invalidating the active token."""
  auth_service.logout(token)


@auth_router.post(
  "/auth/change-password",
  status_code=204,
  responses={
    **_AUTH_ERRORS,
    400: {"description": "Current password is incorrect."},
  },
)
def change_password(
  body: ChangePasswordRequest,
  current_user: CurrentUserDep,
  session: SessionDep,
) -> None:
  """Changes the password of the currently authenticated user."""
  auth_service.change_password(body, current_user, session)


@auth_router.get(
  "/auth/me",
  response_model=UserProfileResponse,
  responses={**_AUTH_ERRORS},
)
def get_current_user(current_user: CurrentUserDep) -> UserProfileResponse:
  """Retrieves the profile of the currently logged-in user."""
  return auth_service.get_current_user(current_user)
