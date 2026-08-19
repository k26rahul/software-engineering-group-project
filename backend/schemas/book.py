from datetime import datetime

from sqlmodel import Field, SQLModel

from models.enums import CopyStatus


class BookBase(SQLModel):
  title: str = Field(description="Title of the book.")
  author: str = Field(description="Author of the book.")
  isbn: str | None = Field(default=None, description="International Standard Book Number.")
  category: str = Field(description="Category or genre of the book.")
  price: float = Field(description="Price of the book.")
  description: str | None = Field(default=None, description="Summary or description of the book.")


class AddBookRequest(BookBase):
  pass


class UpdateBookRequest(SQLModel):
  title: str | None = None
  author: str | None = None
  isbn: str | None = None
  category: str | None = None
  price: float | None = None
  description: str | None = None


class ISBNLookupRequest(SQLModel):
  isbn: str


class UpdateCopyStatusRequest(SQLModel):
  status: CopyStatus


class CopyResponse(SQLModel):
  id: int
  copy_number: int
  status: CopyStatus


class BookSummaryResponse(SQLModel):
  id: int
  title: str
  author: str
  isbn: str | None
  category: str
  price: float
  available_copies: int
  is_active: bool


class BookDetailResponse(BookSummaryResponse):
  description: str | None
  average_rating: float
  created_at: datetime
  copies: list[CopyResponse]


class BookRecommendationResponse(SQLModel):
  id: int | None = None
  book_id: int | None = None
  title: str
  author: str
  category: str
  availability: int | None = None
  reason: str | None = None
