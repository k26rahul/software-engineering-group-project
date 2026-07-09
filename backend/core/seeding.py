from sqlmodel import Session, select

from core.auth import hash_password
from models.enums import MemberApprovalStatus, MembershipType, UserRole
from models.user import User


def seed_default_users(session: Session) -> None:
  """Seeds default development users if the database is empty."""
  # If any user exists, skip seeding to avoid duplicate entries.
  if session.exec(select(User)).first() is not None:
    return

  users_to_seed = [
    User(
      email="librarian@example.com",
      name="Chitra",
      password_hash=hash_password("password123"),
      role=UserRole.LIBRARIAN,
      is_active=True,
      approval_status=MemberApprovalStatus.APPROVED,
      max_issue_limit=10,
    ),
    User(
      email="member@example.com",
      name="Vaishnavi",
      password_hash=hash_password("password123"),
      role=UserRole.MEMBER,
      is_active=True,
      approval_status=MemberApprovalStatus.APPROVED,
      max_issue_limit=3,
      membership_type=MembershipType.ON_CAMPUS,
    ),
    User(
      email="management@example.com",
      name="Vishnu",
      password_hash=hash_password("password123"),
      role=UserRole.CAMPUS_MANAGEMENT,
      is_active=True,
      approval_status=MemberApprovalStatus.APPROVED,
      max_issue_limit=0,
    ),
  ]

  for user in users_to_seed:
    session.add(user)

  session.commit()
