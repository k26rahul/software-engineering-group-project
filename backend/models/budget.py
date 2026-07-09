from datetime import date
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

if TYPE_CHECKING:
  from models.catalog import Magazine, Newspaper

from models.base import CreatedAtMixin, IDMixin
from models.enums import SubscriptionFrequency, SubscriptionType


class Vendor(IDMixin, table=True):
  """
  Represents a vendor from whom books or subscriptions are purchased.
  """

  name: str = Field(description="The vendor's business name.")
  contact_email: str | None = Field(default=None, description="Email for the vendor.")
  contact_phone: str | None = Field(default=None, description="Phone number for the vendor.")
  address: str | None = Field(default=None, description="Physical or billing address.")
  is_active: bool = Field(
    default=True, description="Whether the library currently purchases from this vendor."
  )

  book_purchases: list["BookPurchaseEntry"] = Relationship(back_populates="vendor")
  subscriptions: list["Subscription"] = Relationship(back_populates="vendor")


class Subscription(IDMixin, CreatedAtMixin, table=True):
  """
  Represents a recurring subscription for newspapers or magazines.
  """

  type: SubscriptionType = Field(description="Type of the subscription (Newspaper/Magazine).")
  copies: int = Field(description="Number of copies received per issue.")
  price_per_copy: float = Field(description="Cost of a single copy.")
  frequency: SubscriptionFrequency = Field(description="Delivery frequency of the subscription.")
  is_active: bool = Field(default=True, description="Whether the subscription is currently active.")

  vendor_id: int | None = Field(
    default=None, foreign_key="vendor.id", description="ID of the vendor."
  )

  magazine: "Magazine" = Relationship(
    sa_relationship_kwargs={"uselist": False}, back_populates="subscription"
  )
  newspaper: "Newspaper" = Relationship(
    sa_relationship_kwargs={"uselist": False}, back_populates="subscription"
  )
  vendor: "Vendor" = Relationship(back_populates="subscriptions")

  def monthly_cost(self) -> float:
    """Calculates the estimated monthly cost based on frequency."""
    multipliers = {
      SubscriptionFrequency.DAILY: 30,
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
  vendor_id: int | None = Field(
    default=None, foreign_key="vendor.id", description="ID of the vendor."
  )
  category: str | None = Field(default=None, description="Category of the purchased books.")
  purchase_date: date = Field(description="Date the purchase was made.")

  vendor: "Vendor" = Relationship(back_populates="book_purchases")

  def total_cost(self) -> float:
    """Total cost of the purchase entry."""
    return self.copies * self.price_per_copy
