from datetime import datetime

from sqlmodel import SQLModel

from models.enums import RequestStatus


class CreatePurchaseRequestRequest(SQLModel):
  title: str
  author: str | None = None
  description: str | None = None


class PurchaseRequestResponse(SQLModel):
  id: int
  title: str
  author: str | None
  description: str | None
  upvote_count: int
  status: RequestStatus
  created_at: datetime
