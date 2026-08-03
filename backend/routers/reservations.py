"""Reservations & Waitlist Queue API router for reservation creation, cancellation, and queues."""

from fastapi import APIRouter, Response, status

from core.dependencies import CurrentUserDep, LibrarianDep, MemberDep, SessionDep
from schemas.reservation import CreateReservationRequest, ReservationResponse
from services.reservations import ReservationsService

reservations_router = APIRouter(tags=["Reservations"])

# Shared response sets for common error patterns.
_AUTH_ERRORS = {401: {"description": "Invalid, expired, or revoked token."}}
_LIBRARIAN_ERRORS = {
  **_AUTH_ERRORS,
  403: {"description": "Insufficient permissions. Librarian role required."},
}
_NOT_FOUND = {404: {"description": "Requested resource not found."}}


@reservations_router.post(
  "/reservations",
  response_model=ReservationResponse,
  status_code=status.HTTP_201_CREATED,
  summary="Create reservation",
  description="Places a member in the waitlist queue for an unavailable book.",
  responses={
    **_AUTH_ERRORS,
    403: {"description": "Insufficient permissions. Member role required."},
    404: {"description": "Book not found."},
    400: {"description": "Member already has an active reservation for this book."},
  },
)
def create_reservation(
  request: CreateReservationRequest,
  session: SessionDep,
  current_user: MemberDep,
) -> ReservationResponse:
  return ReservationsService.create_reservation(session, current_user.id, request)


@reservations_router.delete(
  "/reservations/{id}",
  status_code=status.HTTP_204_NO_CONTENT,
  summary="Cancel reservation",
  description="Cancels an active reservation for a member.",
  responses={
    **_AUTH_ERRORS,
    403: {"description": "Cannot cancel another member's reservation."},
    **_NOT_FOUND,
  },
)
def cancel_reservation(
  id: int,
  session: SessionDep,
  current_user: CurrentUserDep,
):
  ReservationsService.cancel_reservation(session, id, member_id=current_user.id)
  return Response(status_code=status.HTTP_204_NO_CONTENT)


@reservations_router.get(
  "/reservations/alerts",
  response_model=list[ReservationResponse],
  summary="Get reservation alerts",
  description="Librarian-only. Retrieves reservations that have become available for fulfillment.",
  responses={**_LIBRARIAN_ERRORS},
)
def get_reservation_alerts(
  session: SessionDep,
  _: LibrarianDep,
) -> list[ReservationResponse]:
  return ReservationsService.get_reservation_alerts(session)


@reservations_router.get(
  "/members/{id}/reservations",
  response_model=list[ReservationResponse],
  summary="Get member reservations",
  description="Retrieves all active reservations for a specific member.",
  responses={**_AUTH_ERRORS},
)
def get_member_reservations(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> list[ReservationResponse]:
  return ReservationsService.get_member_reservations(session, id)
