from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

if TYPE_CHECKING:
  from models.book import Book
  from models.user import User

from models.base import CreatedAtMixin, IDMixin
from models.enums import ReservationStatus

# ── Models ────────────────────────────────────────────────────────────────────


class Reservation(IDMixin, CreatedAtMixin, table=True):
  """Represents a waitlist reservation for a book that is currently unavailable."""

  member_id: int = Field(
    foreign_key="user.id", description="ID of the member who made the reservation."
  )
  book_id: int = Field(foreign_key="book.id", description="ID of the reserved book.")
  status: ReservationStatus = Field(
    default=ReservationStatus.WAITING, description="Current status of the reservation."
  )
  notified_at: datetime | None = Field(
    default=None, description="When the member was notified of availability."
  )
  fulfilled_at: datetime | None = Field(
    default=None, description="When the reservation was fulfilled."
  )

  member: "User" = Relationship(back_populates="reservations")
  book: "Book" = Relationship(back_populates="reservations")
