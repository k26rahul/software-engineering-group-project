"""Service layer for Reservations & Waitlist Queue domain."""

from datetime import datetime

from fastapi import HTTPException, status
from sqlmodel import Session, select

from models.book import Book
from models.enums import ReservationStatus
from models.reservation import Reservation
from schemas.reservation import CreateReservationRequest, ReservationResponse


class ReservationsService:
  """Service handling book reservations, waitlist queueing, alerts, and member reservations."""

  @staticmethod
  def create_reservation(
    session: Session, member_id: int, request: CreateReservationRequest
  ) -> ReservationResponse:
    """Place a member in the waitlist queue for an unavailable book."""
    book = session.get(Book, request.book_id)
    if not book:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Book with ID {request.book_id} not found.",
      )

    existing = session.exec(
      select(Reservation).where(
        Reservation.member_id == member_id,
        Reservation.book_id == request.book_id,
        Reservation.status.in_([ReservationStatus.WAITING, ReservationStatus.NOTIFIED]),
      )
    ).first()

    if existing:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="You already have an active reservation for this book.",
      )

    reservation = Reservation(
      member_id=member_id,
      book_id=request.book_id,
      status=ReservationStatus.WAITING,
    )
    session.add(reservation)
    session.commit()
    session.refresh(reservation)

    return ReservationResponse(
      id=reservation.id,
      book_id=reservation.book_id,
      status=reservation.status,
      created_at=reservation.created_at,
      notified_at=reservation.notified_at,
    )

  @staticmethod
  def cancel_reservation(session: Session, reservation_id: int, member_id: int | None = None) -> None:
    """Cancel an active reservation for a member."""
    reservation = session.get(Reservation, reservation_id)
    if not reservation:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Reservation with ID {reservation_id} not found.",
      )

    if member_id and reservation.member_id != member_id:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You can only cancel your own reservations.",
      )

    reservation.status = ReservationStatus.CANCELLED
    session.add(reservation)
    session.commit()

  @staticmethod
  def get_reservation_alerts(session: Session) -> list[ReservationResponse]:
    """Librarian-only: Retrieve active reservations ready for fulfillment notification."""
    reservations = session.exec(
      select(Reservation).where(
        Reservation.status.in_([ReservationStatus.WAITING, ReservationStatus.NOTIFIED])
      )
    ).all()

    return [
      ReservationResponse(
        id=r.id,
        book_id=r.book_id,
        status=r.status,
        created_at=r.created_at,
        notified_at=r.notified_at,
      )
      for r in reservations
    ]

  @staticmethod
  def get_member_reservations(session: Session, member_id: int) -> list[ReservationResponse]:
    """Retrieve all active reservations for a specific member."""
    reservations = session.exec(
      select(Reservation).where(
        Reservation.member_id == member_id,
        Reservation.status.in_([ReservationStatus.WAITING, ReservationStatus.NOTIFIED]),
      )
    ).all()

    return [
      ReservationResponse(
        id=r.id,
        book_id=r.book_id,
        status=r.status,
        created_at=r.created_at,
        notified_at=r.notified_at,
      )
      for r in reservations
    ]
