from sqlmodel import Field

from models.base import CreatedAtMixin, IDMixin
from models.enums import PaymentType


class Payment(IDMixin, CreatedAtMixin, table=True):
  """
  Represents a payment made by a member, such as a membership fee or fine.
  """

  member_id: int = Field(foreign_key="user.id", description="ID of the member making the payment.")
  amount: float = Field(description="Amount paid.")
  type: PaymentType = Field(description="Type of payment (e.g. membership fee, fine).")
  fine_id: int | None = Field(
    default=None, foreign_key="fine.id", description="ID of the associated fine, if applicable."
  )
