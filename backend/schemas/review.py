from datetime import datetime

from sqlmodel import SQLModel

from models.enums import ReviewStatus


class SubmitReviewRequest(SQLModel):
  rating: int
  text: str


class ReviewResponse(SQLModel):
  id: int
  member_id: int
  rating: int
  text: str
  status: ReviewStatus
  created_at: datetime
