from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlmodel import Session

from core.auth import decode_token, token_blocklist
from core.database import get_session
from models.enums import UserRole
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/swagger-login")

SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(
  token: TokenDep,
  session: SessionDep,
) -> User:
  """Resolves a valid JWT to its User, enforcing blocklist and active status."""
  if token in token_blocklist:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Token has been invalidated.",
    )
  try:
    user_id = decode_token(token)
  except JWTError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid or expired token.",
    )
  user = session.get(User, user_id)
  if user is None:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="User not found.",
    )
  return user


# Resolves the JWT and injects the full User object.
CurrentUserDep = Annotated[User, Depends(get_current_user)]


def _require_role(*roles: UserRole):
  """Returns a dependency that raises 403 if the user's role is not in `roles` or is inactive."""

  def _check(current_user: CurrentUserDep) -> User:
    if current_user.role not in roles:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to perform this action.",
      )
    if not current_user.is_active:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Your account is deactivated and pending approval.",
      )
    return current_user

  return Depends(_check)


# Resolves the JWT and additionally enforces a specific role.
LibrarianDep = Annotated[User, _require_role(UserRole.LIBRARIAN)]
MemberDep = Annotated[User, _require_role(UserRole.MEMBER)]
ManagementDep = Annotated[User, _require_role(UserRole.CAMPUS_MANAGEMENT)]
StaffDep = Annotated[User, _require_role(UserRole.LIBRARIAN, UserRole.CAMPUS_MANAGEMENT)]
