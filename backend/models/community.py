from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

if TYPE_CHECKING:
  from models.user import User
  from models.catalog import Book

from models.base import CreatedAtMixin, IDMixin, UpdatedAtMixin
from models.enums import ReviewStatus


class Review(IDMixin, CreatedAtMixin, UpdatedAtMixin, table=True):
  """
  Represents a book review submitted by a member. Requires approval before public display.
  """

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


class ReadingListBook(IDMixin, table=True):
  """
  Junction table for the many-to-many relationship between reading lists and books.
  """

  reading_list_id: int = Field(foreign_key="readinglist.id", description="ID of the reading list.")
  book_id: int = Field(foreign_key="book.id", description="ID of the book in the reading list.")


class ReadingList(IDMixin, CreatedAtMixin, table=True):
  """
  Represents a themed collection of books curated by the library or members.
  """

  title: str = Field(description="Title of the reading list.")
  description: str | None = Field(default=None, description="Description of the reading list.")

  books: list["Book"] = Relationship(back_populates="reading_lists", link_model=ReadingListBook)
