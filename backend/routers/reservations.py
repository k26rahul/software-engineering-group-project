from fastapi import APIRouter

reservations_router = APIRouter(tags=["Reservations"])

# Routes to implement:
#
# POST  /reservations
#   Description: Places a member in the waitlist queue for an unavailable book.
#   Request:  CreateReservationRequest
#   Response: ReservationResponse
#
# DELETE  /reservations/{id}
#   Description: Cancels an active reservation for a member.
#
# GET  /reservations/alerts
#   Description: Librarian-only. Retrieves reservations that have just
#   become available for fulfillment.
#   Response: list[ReservationResponse]
#
# GET  /members/{id}/reservations
#   Description: Retrieves all active reservations for a specific member.
#   Response: list[ReservationResponse]
