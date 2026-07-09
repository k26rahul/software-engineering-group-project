from datetime import date
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

if TYPE_CHECKING:
  from models.user import User
  from models.catalog import BookCopy
  from models.payment import Payment

from models.base import CreatedAtMixin, IDMixin
from models.enums import ReturnCondition


class Transaction(IDMixin, table=True):
  """
  Represents a borrowing transaction where a member issues a book copy.
  """

  member_id: int = Field(foreign_key="user.id", description="ID of the member who issued the book.")
  book_copy_id: int = Field(
    foreign_key="bookcopy.id", description="ID of the specific book copy issued."
  )
  issue_date: date = Field(description="Date the book was issued.")
  due_date: date = Field(description="Date the book is due for return.")
  return_date: date | None = Field(default=None, description="Date the book was actually returned.")
  return_condition: ReturnCondition | None = Field(
    default=None, description="Condition of the book upon return."
  )

  member: "User" = Relationship(back_populates="transactions")
  book_copy: "BookCopy" = Relationship(back_populates="transactions")
  fine: "Fine" = Relationship(sa_relationship_kwargs={"uselist": False}, back_populates="transaction")

  def is_overdue(self) -> bool:
    """Checks if current date exceeds due_date and book is not returned."""
    if self.return_date is None and date.today() > self.due_date:
      return True
    return False

  def days_overdue(self) -> int:
    """Number of days past the due date."""
    if self.is_overdue():
      return (date.today() - self.due_date).days
    return 0


class Fine(IDMixin, CreatedAtMixin, table=True):
  """
  Represents a fine levied on a transaction for late return, damage, or loss.
  """

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
  payment: "Payment" = Relationship(sa_relationship_kwargs={"uselist": False}, back_populates="fine")
