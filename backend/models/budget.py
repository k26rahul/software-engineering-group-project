from datetime import date

from sqlmodel import Field

from models.base import CreatedAtMixin, IDMixin
from models.enums import SubscriptionFrequency, SubscriptionType


class Subscription(IDMixin, CreatedAtMixin, table=True):
  """
  Represents a recurring subscription for newspapers or magazines.
  """

  title: str = Field(description="Title of the subscription.")
  type: SubscriptionType = Field(description="Type of the subscription (Newspaper/Magazine).")
  copies: int = Field(description="Number of copies received per issue.")
  price_per_copy: float = Field(description="Cost of a single copy.")
  frequency: SubscriptionFrequency = Field(description="Delivery frequency of the subscription.")
  is_active: bool = Field(default=True, description="Whether the subscription is currently active.")

  def monthly_cost(self) -> float:
    """Calculates the estimated monthly cost based on frequency."""
    multipliers = {
      SubscriptionFrequency.DAILY: 26,
      SubscriptionFrequency.WEEKLY: 4,
      SubscriptionFrequency.BIWEEKLY: 2,
      SubscriptionFrequency.MONTHLY: 1,
    }
    multiplier = multipliers.get(self.frequency, 1)
    return self.copies * self.price_per_copy * multiplier


class BookPurchaseEntry(IDMixin, table=True):
  """
  Tracks actual book purchases made by the librarian for budget tracking.
  """

  title: str = Field(description="Title of the purchased book.")
  copies: int = Field(description="Number of copies purchased.")
  price_per_copy: float = Field(description="Price per copy.")
  vendor: str = Field(description="Vendor from whom the purchase was made.")
  category: str | None = Field(default=None, description="Category of the purchased books.")
  purchase_date: date = Field(description="Date the purchase was made.")

  def total_cost(self) -> float:
    """Total cost of the purchase entry."""
    return self.copies * self.price_per_copy
