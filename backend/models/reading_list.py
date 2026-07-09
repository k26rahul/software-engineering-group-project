from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
  from models.catalog import Book

from models.base import CreatedAtMixin, IDMixin

# ── Models ────────────────────────────────────────────────────────────────────


class ReadingListBook(IDMixin, table=True):
  """Junction table for the many-to-many relationship between reading lists and books."""

  reading_list_id: int = Field(foreign_key="readinglist.id", description="ID of the reading list.")
  book_id: int = Field(foreign_key="book.id", description="ID of the book in the reading list.")


class ReadingList(IDMixin, CreatedAtMixin, table=True):
  """Represents a themed collection of books curated by the librarian."""

  title: str = Field(description="Title of the reading list.")
  description: str | None = Field(default=None, description="Description of the reading list.")

  books: list["Book"] = Relationship(back_populates="reading_lists", link_model=ReadingListBook)


# ── Schemas ───────────────────────────────────────────────────────────────────


class CreateReadingListRequest(SQLModel):
  title: str
  description: str | None = None
  book_ids: list[int] = []


class UpdateReadingListRequest(SQLModel):
  title: str | None = None
  description: str | None = None
  add_book_ids: list[int] = []
  remove_book_ids: list[int] = []


class ReadingListResponse(SQLModel):
  id: int
  title: str
  description: str | None
  book_ids: list[int]
  created_at: datetime
