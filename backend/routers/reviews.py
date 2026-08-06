from fastapi import APIRouter, Depends
from sqlmodel import Session

import services.reviews as review_service
from core.database import get_session
from core.dependencies import CurrentUserDep, LibrarianDep
from models.enums import ReviewStatus
from schemas.review import ReviewResponse, SubmitReviewRequest

reviews_router = APIRouter(tags=["Reviews"])


@reviews_router.post("/books/{id}/reviews", response_model=ReviewResponse)
def submit_review(
  id: int,
  request: SubmitReviewRequest,
  current_user: CurrentUserDep,
  session: Session = Depends(get_session),
):
  """Submits a new review for a book from a member."""
  return review_service.submit_review(session, current_user, id, request)


@reviews_router.get("/books/{id}/reviews", response_model=list[ReviewResponse])
def get_book_reviews(
  id: int,
  session: Session = Depends(get_session),
):
  """Retrieves all approved reviews for a specific book."""
  return review_service.get_book_reviews(session, id)


@reviews_router.delete("/books/reviews/{review_id}", status_code=204)
def delete_review(
  review_id: int,
  current_user: CurrentUserDep,
  session: Session = Depends(get_session),
):
  """Delete a review (Moderation/Self)."""
  review_service.delete_review(session, current_user, review_id)


@reviews_router.patch("/reviews/{id}/moderate", response_model=ReviewResponse)
def moderate_review(
  id: int,
  status: ReviewStatus,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Librarian-only. Approves or rejects a pending book review."""
  return review_service.moderate_review(session, id, status)
