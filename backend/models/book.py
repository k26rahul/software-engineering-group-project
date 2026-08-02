from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, Session, SQLModel, select

if TYPE_CHECKING:
  from models.reading_list import ReadingList
  from models.reservation import Reservation
  from models.review import Review
  from models.subscription import Magazine
  from models.transaction import Transaction

from models.base import CreatedAtMixin, IDMixin, UpdatedAtMixin
from models.enums import CopyStatus, ReviewStatus
from models.reading_list import ReadingListBook

# ── Models ────────────────────────────────────────────────────────────────────


class BookBase(SQLModel):
  title: str = Field(description="Title of the book.")
  author: str = Field(description="Author of the book.")
  isbn: str | None = Field(
    default=None, unique=True, description="International Standard Book Number."
  )
  category: str = Field(description="Category or genre of the book.")
  price: float = Field(description="Price of the book.")
  description: str | None = Field(default=None, description="Summary or description of the book.")


class Book(BookBase, IDMixin, CreatedAtMixin, UpdatedAtMixin, table=True):
  """
  Represents a unique book title in the catalog. Includes metadata and
  methods to calculate availability and ratings.
  """

  copies: list["BookCopy"] = Relationship(back_populates="book")
  reviews: list["Review"] = Relationship(back_populates="book")
  magazine: "Magazine" = Relationship(
    sa_relationship_kwargs={"uselist": False}, back_populates="book"
  )
  reservations: list["Reservation"] = Relationship(back_populates="book")
  reading_lists: list["ReadingList"] = Relationship(
    back_populates="books", link_model=ReadingListBook
  )

  def available_copies(self, session: Session) -> int:
    """Count of copies with status AVAILABLE."""
    statement = select(BookCopy).where(
      BookCopy.book_id == self.id, BookCopy.status == CopyStatus.AVAILABLE
    )
    return len(session.exec(statement).all())

  def average_rating(self, session: Session) -> float:
    """Mean rating from approved reviews."""
    from models.review import Review

    statement = select(Review).where(
      Review.book_id == self.id, Review.status == ReviewStatus.APPROVED
    )
    reviews = session.exec(statement).all()
    if not reviews:
      return 0.0
    return sum(r.rating for r in reviews) / len(reviews)


class BookCopy(IDMixin, table=True):
  """Represents a physical copy of a book."""

  book_id: int = Field(foreign_key="book.id", description="ID of the associated book.")
  copy_number: int = Field(description="Sequential copy number for the book.")
  status: CopyStatus = Field(
    default=CopyStatus.AVAILABLE, description="Current status of the book copy."
  )

  book: "Book" = Relationship(back_populates="copies")
  transactions: list["Transaction"] = Relationship(back_populates="book_copy")
