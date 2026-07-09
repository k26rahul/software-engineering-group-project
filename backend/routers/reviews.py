from fastapi import APIRouter

reviews_router = APIRouter(tags=["Reviews"])

# Routes to implement:
#
# POST  /books/{id}/reviews
#   Description: Submits a new review for a book from a member.
#   Request:  SubmitReviewRequest
#   Response: ReviewResponse
#
# GET  /books/{id}/reviews
#   Description: Retrieves all approved reviews for a specific book.
#   Response: list[ReviewResponse]
#
# PATCH  /reviews/{id}/moderate
#   Description: Librarian-only. Approves or rejects a pending book review.
#   Response: ReviewResponse
