from datetime import date
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
  from models.notification import Notification
  from models.payment import Fine, Payment
  from models.purchase_request import PurchaseRequest, PurchaseRequestVote
  from models.reservation import Reservation
  from models.review import Review
  from models.transaction import Transaction

from models.base import CreatedAtMixin, IDMixin, UpdatedAtMixin
from models.enums import MemberApprovalStatus, MembershipType, UserRole

# ── Models ────────────────────────────────────────────────────────────────────


class UserBase(SQLModel):
  name: str = Field(description="Full name of the user.")
  phone: str | None = Field(default=None, description="Contact phone number.")


class User(UserBase, IDMixin, CreatedAtMixin, UpdatedAtMixin, table=True):
  """
  Represents a user in the library management system. Includes both staff and members.
  Members have a billing cycle tracking and can be approved/rejected.
  """

  email: str = Field(unique=True, description="The user's email address, used for login.")
  password_hash: str = Field(description="Hashed password for authentication.")
  role: UserRole = Field(description="Role of the user defining their access level.")
  membership_type: MembershipType | None = Field(
    default=None, description="Type of membership for library members."
  )
  approval_status: MemberApprovalStatus = Field(
    default=MemberApprovalStatus.PENDING,
    description="Approval status of the member registration.",
  )
  is_active: bool = Field(default=False, description="Whether the user account is active.")
  membership_start_date: date | None = Field(
    default=None, description="Start date of the current membership cycle."
  )
  max_issue_limit: int = Field(
    description="Maximum number of books the member can issue simultaneously."
  )

  transactions: list["Transaction"] = Relationship(back_populates="member")
  fines: list["Fine"] = Relationship(back_populates="member")
  reservations: list["Reservation"] = Relationship(back_populates="member")
  reviews: list["Review"] = Relationship(back_populates="member")
  purchase_requests: list["PurchaseRequest"] = Relationship(back_populates="member")
  purchase_request_votes: list["PurchaseRequestVote"] = Relationship(back_populates="member")
  payments: list["Payment"] = Relationship(back_populates="member")
  notifications: list["Notification"] = Relationship(back_populates="recipient")

  def is_membership_due(self) -> bool:
    """Checks if off-campus member's 1-year billing cycle has expired."""
    if self.membership_start_date is None or self.membership_type != MembershipType.OFF_CAMPUS:
      return False
    from datetime import date

    try:
      due_date = self.membership_start_date.replace(year=self.membership_start_date.year + 1)
    except ValueError:
      due_date = self.membership_start_date.replace(
        year=self.membership_start_date.year + 1, month=2, day=28
      )
    return date.today() > due_date
