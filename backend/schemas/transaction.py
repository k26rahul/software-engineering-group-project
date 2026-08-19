from datetime import date

from sqlmodel import SQLModel

from models.enums import ReturnCondition


class IssueBookRequest(SQLModel):
  member_id: int
  book_id: int
  copy_id: int | None = None
  due_date: date | None = None


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


class ActiveTransactionResponse(SQLModel):
  transaction_id: int
  member_name: str
  member_email: str
  book_title: str
  issue_date: date
  due_date: date
  is_overdue: bool
  days_overdue: int = 0


class MemberCurrentIssueResponse(SQLModel):
  transaction_id: int
  book_title: str
  issue_date: date
  due_date: date
  is_overdue: bool


class TransactionHistoryItemResponse(SQLModel):
  transaction_id: int
  book_title: str
  issue_date: date
  due_date: date
  return_date: date | None = None
  is_overdue: bool
