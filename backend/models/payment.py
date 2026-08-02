from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
  from models.transaction import Transaction
  from models.user import User

from models.base import CreatedAtMixin, IDMixin
from models.enums import PaymentType, ReturnCondition

# ── Models ────────────────────────────────────────────────────────────────────


class Fine(IDMixin, CreatedAtMixin, table=True):
  """Represents a fine levied on a transaction for late return, damage, or loss."""

  transaction_id: int = Field(
    foreign_key="transaction.id",
    unique=True,
    description="ID of the transaction this fine belongs to.",
  )
  member_id: int = Field(foreign_key="user.id", description="ID of the member who owes the fine.")
  amount: float = Field(description="Fine amount in currency.")
  reason: ReturnCondition = Field(
    description="Reason for the fine. Valid values are only DAMAGED or LOST."
  )
  is_paid: bool = Field(default=False, description="Whether the fine has been paid.")

  transaction: "Transaction" = Relationship(back_populates="fine")
  member: "User" = Relationship(back_populates="fines")
  payment: "Payment" = Relationship(
    sa_relationship_kwargs={"uselist": False}, back_populates="fine"
  )


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


class FineResponse(SQLModel):
  id: int
  transaction_id: int
  amount: float
  reason: ReturnCondition
  is_paid: bool
