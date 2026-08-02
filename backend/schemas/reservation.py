from datetime import datetime

from sqlmodel import SQLModel

from models.enums import ReservationStatus


class CreateReservationRequest(SQLModel):
  book_id: int


class ReservationResponse(SQLModel):
  id: int
  book_id: int
  status: ReservationStatus
  created_at: datetime
  notified_at: datetime | None
