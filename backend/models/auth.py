from sqlmodel import SQLModel

from models.enums import MembershipType
from models.user import UserProfileResponse

# ── Schemas ───────────────────────────────────────────────────────────────────


class LoginRequest(SQLModel):
  email: str
  password: str


class RegisterRequest(SQLModel):
  email: str
  password: str
  name: str
  phone: str | None = None
  membership_type: MembershipType


class ChangePasswordRequest(SQLModel):
  current_password: str
  new_password: str


class TokenResponse(SQLModel):
  access_token: str
  token_type: str = "bearer"
  token: str
  user: UserProfileResponse
