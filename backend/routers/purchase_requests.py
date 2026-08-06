from fastapi import APIRouter, Depends
from sqlmodel import Session

from core.database import get_session
from models.user import User
from schemas.purchase_request import CreatePurchaseRequestRequest, PurchaseRequestResponse
from core.security import get_current_user, require_role
from models.enums import UserRole
import services.purchase_requests as purchase_request_service

purchase_requests_router = APIRouter(tags=["Purchase Requests"])

@purchase_requests_router.get("/purchase-requests", response_model=list[PurchaseRequestResponse])
def get_purchase_requests(session: Session = Depends(get_session)):
    """Returns all purchase requests ranked by upvote count descending."""
    return purchase_request_service.get_purchase_requests(session)

@purchase_requests_router.post("/purchase-requests", response_model=PurchaseRequestResponse)
def create_purchase_request(
    request: CreatePurchaseRequestRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Submits a new purchase request on behalf of a member."""
    return purchase_request_service.create_purchase_request(session, current_user, request)

@purchase_requests_router.post("/purchase-requests/{id}/upvote", response_model=PurchaseRequestResponse)
def upvote_purchase_request(
    id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Adds an upvote from a member to a purchase request, rejecting duplicate votes."""
    return purchase_request_service.upvote_purchase_request(session, current_user, id)

@purchase_requests_router.patch("/purchase-requests/{id}/status", response_model=PurchaseRequestResponse)
def mark_purchase_request_purchased(
    id: int,
    current_user: User = Depends(require_role([UserRole.LIBRARIAN])),
    session: Session = Depends(get_session),
):
    """Librarian-only. Marks a purchase request as purchased."""
    return purchase_request_service.mark_purchase_request_purchased(session, id)
