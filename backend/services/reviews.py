from fastapi import HTTPException
from sqlmodel import Session, select

from models.enums import ReviewStatus, UserRole
from models.review import Review
from models.user import User
from schemas.review import SubmitReviewRequest


def get_book_reviews(session: Session, book_id: int) -> list[Review]:
  statement = select(Review).where(
    Review.book_id == book_id, Review.status == ReviewStatus.APPROVED
  )
  return session.exec(statement).all()


def submit_review(
  session: Session, current_user: User, book_id: int, request: SubmitReviewRequest
) -> Review:
  if not (1 <= request.rating <= 5):
    raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")

  review = Review(
    member_id=current_user.id,
    book_id=book_id,
    rating=request.rating,
    text=request.text,
    status=ReviewStatus.PENDING,
  )
  session.add(review)
  session.commit()
  session.refresh(review)
  return review


def delete_review(session: Session, current_user: User, review_id: int):
  review = session.get(Review, review_id)
  if not review:
    raise HTTPException(status_code=404, detail="Review not found")

  if review.member_id != current_user.id and current_user.role != UserRole.LIBRARIAN:
    raise HTTPException(status_code=403, detail="Not authorized to delete this review")

  session.delete(review)
  session.commit()


def moderate_review(session: Session, review_id: int, status: ReviewStatus) -> Review:
  review = session.get(Review, review_id)
  if not review:
    raise HTTPException(status_code=404, detail="Review not found")

  review.status = status
  session.add(review)
  session.commit()
  session.refresh(review)
  return review
