from fastapi import APIRouter

from core.dependencies import CurrentUserDep, SessionDep
from schemas.book import BookRecommendationResponse
from services.recommendations import RecommendationsService

recommendations_router = APIRouter(tags=["Recommendations"])


@recommendations_router.get(
  "/members/{id}/recommendations",
  response_model=list[BookRecommendationResponse],
  summary="Get book recommendations",
  description="Generates personalized book recommendations for a member "
  "based on their reading history.",
)
def get_recommendations(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> list[BookRecommendationResponse]:
  return RecommendationsService.get_recommendations(session, id)
