from datetime import date

from sqlmodel import SQLModel

from models.enums import ReturnCondition


class IssueBookRequest(SQLModel):
  member_id: int
  book_copy_id: int
  due_date: date


class ReturnBookRequest(SQLModel):
  transaction_id: int
  condition: ReturnCondition


class TransactionResponse(SQLModel):
  id: int
  member_id: int
  book_copy_id: int
  issue_date: date
  due_date: date
  return_date: date | None
  return_condition: ReturnCondition | None
  is_overdue: bool


class TransactionHistoryItemResponse(SQLModel):
  transaction_id: int
  book_title: str
  issue_date: date
  due_date: date
  return_date: date | None = None
  is_overdue: bool
