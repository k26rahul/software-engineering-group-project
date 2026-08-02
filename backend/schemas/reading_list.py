from datetime import datetime

from sqlmodel import SQLModel


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
