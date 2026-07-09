from datetime import date
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
  from models.subscription import Subscription

from models.base import IDMixin

# ── Models ────────────────────────────────────────────────────────────────────


class Vendor(IDMixin, table=True):
  """Represents a vendor from whom books or subscriptions are purchased."""

  name: str = Field(description="The vendor's business name.")
  contact_email: str | None = Field(default=None, description="Email for the vendor.")
  contact_phone: str | None = Field(default=None, description="Phone number for the vendor.")
  address: str | None = Field(default=None, description="Physical or billing address.")
  is_active: bool = Field(
    default=True, description="Whether the library currently purchases from this vendor."
  )

  book_purchases: list["BookPurchaseEntry"] = Relationship(back_populates="vendor")
  subscriptions: list["Subscription"] = Relationship(back_populates="vendor")


class BookPurchaseEntry(IDMixin, table=True):
  """Tracks actual book purchases made by the librarian for budget tracking."""

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


# ── Schemas ───────────────────────────────────────────────────────────────────


class RecordPurchaseRequest(SQLModel):
  title: str
  copies: int
  price_per_copy: float
  vendor_id: int | None = None
  category: str | None = None
  purchase_date: date


class BudgetSummaryResponse(SQLModel):
  month: int
  year: int
  total_spent: float
  purchase_count: int


class ExpenseItemResponse(SQLModel):
  title: str
  category: str | None
  copies: int
  price_per_copy: float
  total_cost: float
  purchase_date: date


class UsageReportResponse(SQLModel):
  active_members: int
  books_issued: int
  popular_categories: list[str]


class ExpenseReportResponse(SQLModel):
  month: int
  year: int
  items: list[ExpenseItemResponse]
