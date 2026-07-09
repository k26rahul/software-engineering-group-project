"""Router: Reservations.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

reservations_router = APIRouter(tags=["Reservations"])

# Routes to implement:
#
# POST  /reservations
#   Description: Places a member in the waitlist queue for an unavailable book.
#
# DELETE  /reservations/{id}
#   Description: Cancels an active reservation for a member.
#
# GET  /reservations/alerts
#   Description: Librarian-only. Retrieves reservations that have just
#   become available for fulfillment.
#
# GET  /members/{id}/reservations
#   Description: Retrieves all active reservations for a specific member.
