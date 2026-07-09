from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
  from models.circulation import Fine
  from models.user import User

from models.base import CreatedAtMixin, IDMixin
from models.enums import PaymentType

# ── Models ────────────────────────────────────────────────────────────────────


class Payment(IDMixin, CreatedAtMixin, table=True):
  """Represents a payment made by a member, such as a membership fee or fine."""

  member_id: int = Field(foreign_key="user.id", description="ID of the member making the payment.")
  amount: float = Field(description="Amount paid.")
  type: PaymentType = Field(description="Type of payment (e.g. membership fee, fine).")
  fine_id: int | None = Field(
    default=None,
    foreign_key="fine.id",
    description="ID of the associated fine, if applicable.",
  )

  member: "User" = Relationship(back_populates="payments")
  fine: "Fine" = Relationship(back_populates="payment")


# ── Schemas ───────────────────────────────────────────────────────────────────


class ProcessPaymentRequest(SQLModel):
  type: PaymentType
  amount: float
  fine_id: int | None = None


class PaymentResponse(SQLModel):
  id: int
  amount: float
  type: PaymentType
  fine_id: int | None
  created_at: datetime
