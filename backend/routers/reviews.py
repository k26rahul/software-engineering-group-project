"""Router: Reviews.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

reviews_router = APIRouter(tags=["Reviews"])

# Routes to implement:
#
# POST  /books/{id}/reviews
#   Description: Submits a new review for a book from a member.
#
# GET  /books/{id}/reviews
#   Description: Retrieves all approved reviews for a specific book.
#
# PATCH  /reviews/{id}/moderate
#   Description: Librarian-only. Approves or rejects a pending book review.
