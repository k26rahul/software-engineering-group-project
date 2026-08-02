from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

if TYPE_CHECKING:
  from models.book import Book
  from models.user import User

from models.base import CreatedAtMixin, IDMixin, UpdatedAtMixin
from models.enums import ReviewStatus

# ── Models ────────────────────────────────────────────────────────────────────


class Review(IDMixin, CreatedAtMixin, UpdatedAtMixin, table=True):
  """Represents a book review submitted by a member. Requires approval before public display."""

  member_id: int = Field(
    foreign_key="user.id", description="ID of the member who wrote the review."
  )
  book_id: int = Field(foreign_key="book.id", description="ID of the book being reviewed.")
  rating: int = Field(description="Rating from 1 to 5.")
  text: str = Field(description="Text content of the review.")
  status: ReviewStatus = Field(
    default=ReviewStatus.PENDING, description="Moderation status of the review."
  )

  member: "User" = Relationship(back_populates="reviews")
  book: "Book" = Relationship(back_populates="reviews")
