"""Service layer for Members Management domain."""

from datetime import date

from fastapi import HTTPException, status
from sqlmodel import Session, select

from models.enums import MemberApprovalStatus, UserRole
from models.transaction import Transaction
from models.user import User
from schemas.transaction import TransactionHistoryItemResponse
from schemas.user import MemberDetailResponse, MemberSummaryResponse, UpdateProfileRequest


class MembersService:
  """Service handling member directory, approvals, profile updates, and history."""

  @staticmethod
  def list_members(
    session: Session,
    approval_status: MemberApprovalStatus | None = None,
    role: UserRole | None = None,
  ) -> list[MemberSummaryResponse]:
    """Retrieve list of members filtered by approval status or user role."""
    statement = select(User)
    if approval_status:
      statement = statement.where(User.approval_status == approval_status)
    if role:
      statement = statement.where(User.role == role)

    users = session.exec(statement).all()
    return [
      MemberSummaryResponse(
        id=u.id,
        name=u.name,
        email=u.email,
        role=u.role,
        membership_type=u.membership_type,
        approval_status=u.approval_status,
        is_active=u.is_active,
      )
      for u in users
    ]

  @staticmethod
  def get_member(session: Session, member_id: int) -> MemberDetailResponse:
    """Retrieve details for a specific member."""
    user = session.get(User, member_id)
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Member with ID {member_id} not found.",
      )
    return MemberDetailResponse(
      id=user.id,
      name=user.name,
      email=user.email,
      role=user.role,
      membership_type=user.membership_type,
      approval_status=user.approval_status,
      is_active=user.is_active,
      created_at=user.created_at,
      membership_start_date=user.membership_start_date,
      max_issue_limit=user.max_issue_limit,
    )

  @staticmethod
  def approve_member(session: Session, member_id: int) -> None:
    """Librarian-only: Approve a pending member registration."""
    user = session.get(User, member_id)
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Member with ID {member_id} not found.",
      )
    user.approval_status = MemberApprovalStatus.APPROVED
    user.is_active = True
    session.add(user)
    session.commit()

  @staticmethod
  def reject_member(session: Session, member_id: int) -> None:
    """Librarian-only: Reject a pending member registration."""
    user = session.get(User, member_id)
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Member with ID {member_id} not found.",
      )
    user.approval_status = MemberApprovalStatus.REJECTED
    user.is_active = False
    session.add(user)
    session.commit()

  @staticmethod
  def update_profile(
    session: Session, member_id: int, request: UpdateProfileRequest
  ) -> MemberDetailResponse:
    """Update profile information for a member."""
    user = session.get(User, member_id)
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Member with ID {member_id} not found.",
      )

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
      setattr(user, field, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    return MembersService.get_member(session, member_id)

  @staticmethod
  def get_member_history(
    session: Session, member_id: int
  ) -> list[TransactionHistoryItemResponse]:
    """Retrieve borrowing history for a specific member."""
    user = session.get(User, member_id)
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Member with ID {member_id} not found.",
      )

    transactions = session.exec(
      select(Transaction).where(Transaction.member_id == member_id)
    ).all()

    history = []
    for t in transactions:
      title = t.book_copy.book.title if t.book_copy and t.book_copy.book else "Unknown Book"
      is_overdue = t.return_date is None and date.today() > t.due_date
      history.append(
        TransactionHistoryItemResponse(
          transaction_id=t.id,
          book_title=title,
          issue_date=t.issue_date,
          due_date=t.due_date,
          return_date=t.return_date,
          is_overdue=is_overdue,
        )
      )
    return history
