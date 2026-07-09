from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
  from models.budget import Vendor
  from models.catalog import Book

from models.base import CreatedAtMixin, IDMixin
from models.enums import SubscriptionFrequency, SubscriptionType

# ── Models ────────────────────────────────────────────────────────────────────


class Subscription(IDMixin, CreatedAtMixin, table=True):
  """Represents a recurring subscription for newspapers or magazines."""

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


class Magazine(IDMixin, table=True):
  """
  Stores magazine-specific metadata for books that represent magazine issues.
  A magazine issue is modeled as a Book for circulation purposes - this
  model adds the additional context.
  """

  book_id: int = Field(
    foreign_key="book.id",
    unique=True,
    description="ID of the associated book representing the magazine issue.",
  )
  subscription_id: int | None = Field(
    default=None,
    foreign_key="subscription.id",
    description="ID of the associated subscription, if any.",
  )
  issue_number: str | None = Field(default=None, description="Issue number of the magazine.")
  issue_date: date | None = Field(default=None, description="Publication date of the issue.")

  book: "Book" = Relationship(back_populates="magazine")
  subscription: "Subscription" = Relationship(back_populates="magazine")


class Newspaper(IDMixin, table=True):
  """
  Represents a newspaper subscription track record.
  It is a lightweight model not linked to a Book.
  """

  title: str = Field(description="Title of the newspaper.")
  language: str = Field(description="Language of the newspaper.")
  publisher: str = Field(description="Publisher of the newspaper.")
  subscription_id: int | None = Field(
    default=None,
    foreign_key="subscription.id",
    description="ID of the associated subscription.",
  )

  subscription: "Subscription" = Relationship(back_populates="newspaper")


# ── Schemas ───────────────────────────────────────────────────────────────────


class CreateSubscriptionRequest(SQLModel):
  type: SubscriptionType
  copies: int
  price_per_copy: float
  frequency: SubscriptionFrequency
  vendor_id: int | None = None


class UpdateSubscriptionRequest(SQLModel):
  copies: int | None = None
  price_per_copy: float | None = None
  frequency: SubscriptionFrequency | None = None
  vendor_id: int | None = None


class SubscriptionResponse(SQLModel):
  id: int
  type: SubscriptionType
  copies: int
  price_per_copy: float
  frequency: SubscriptionFrequency
  is_active: bool
  created_at: datetime
