from datetime import date

from sqlmodel import Field, Session, select

from models.base import CreatedAtMixin, IDMixin, UpdatedAtMixin
from models.enums import CopyStatus, ReviewStatus


class Book(IDMixin, CreatedAtMixin, UpdatedAtMixin, table=True):
  """
  Represents a unique book title in the catalog. Includes metadata and
  methods to calculate availability and ratings.
  """

  title: str = Field(description="Title of the book.")
  author: str = Field(description="Author of the book.")
  isbn: str | None = Field(
    default=None, unique=True, description="International Standard Book Number."
  )
  category: str = Field(description="Category or genre of the book.")
  price: float = Field(description="Price of the book.")
  description: str | None = Field(default=None, description="Summary or description of the book.")

  def available_copies(self, session: Session) -> int:
    """Count of copies with status AVAILABLE."""
    statement = select(BookCopy).where(
      BookCopy.book_id == self.id, BookCopy.status == CopyStatus.AVAILABLE
    )
    return len(session.exec(statement).all())

  def average_rating(self, session: Session) -> float:
    """Mean rating from approved reviews."""
    from models.community import Review

    statement = select(Review).where(
      Review.book_id == self.id, Review.status == ReviewStatus.APPROVED
    )
    reviews = session.exec(statement).all()
    if not reviews:
      return 0.0
    return sum(r.rating for r in reviews) / len(reviews)


class BookCopy(IDMixin, table=True):
  """
  Represents a physical copy of a book.
  """

  book_id: int = Field(foreign_key="book.id", description="ID of the associated book.")
  copy_number: int = Field(description="Sequential copy number for the book.")
  status: CopyStatus = Field(
    default=CopyStatus.AVAILABLE, description="Current status of the book copy."
  )


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
