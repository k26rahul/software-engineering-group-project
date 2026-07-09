from fastapi import APIRouter

from core.dependencies import CurrentUser, SessionDep
from models.auth import (
    ChangePasswordRequest,
    LoginRequest,
    LogoutRequest,
    RegisterRequest,
    TokenResponse,
)
from models.user import UserProfileResponse
from services import auth as auth_service

auth_router = APIRouter(tags=["Authentication"])


@auth_router.post("/auth/login", response_model=TokenResponse)
def login(body: LoginRequest, session: SessionDep) -> TokenResponse:
    return auth_service.login(body, session)


@auth_router.post("/auth/register", response_model=UserProfileResponse, status_code=201)
def register(body: RegisterRequest, session: SessionDep) -> UserProfileResponse:
    return auth_service.register(body, session)


@auth_router.post("/auth/logout", status_code=204)
def logout(body: LogoutRequest) -> None:
    auth_service.logout(body)


@auth_router.post("/auth/change-password", status_code=204)
def change_password(
    body: ChangePasswordRequest,
    current_user: CurrentUser,
    session: SessionDep,
) -> None:
    auth_service.change_password(body, current_user, session)


@auth_router.get("/auth/me", response_model=UserProfileResponse)
def get_current_user(current_user: CurrentUser) -> UserProfileResponse:
    return auth_service.get_current_user(current_user)

