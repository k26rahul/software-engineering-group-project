from datetime import date, datetime

from sqlmodel import SQLModel

from models.enums import MemberApprovalStatus, MembershipType, UserRole


class UpdateProfileRequest(SQLModel):
  name: str | None = None
  phone: str | None = None


class UserProfileResponse(SQLModel):
  id: int
  email: str
  name: str
  phone: str | None
  role: UserRole
  membership_type: MembershipType | None
  approval_status: MemberApprovalStatus
  is_active: bool
  created_at: datetime


class MemberSummaryResponse(SQLModel):
  id: int
  name: str
  email: str
  role: UserRole
  membership_type: MembershipType | None
  approval_status: MemberApprovalStatus
  is_active: bool


class MemberDetailResponse(MemberSummaryResponse):
  created_at: datetime
  membership_start_date: date | None
  max_issue_limit: int


class BorrowingHistoryItemResponse(SQLModel):
  transaction_id: int
  book_title: str
  issue_date: date
  due_date: date
  return_date: date | None
  is_overdue: bool
