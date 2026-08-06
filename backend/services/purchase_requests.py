from datetime import datetime
from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError

from models.enums import RequestStatus
from models.purchase_request import PurchaseRequest, PurchaseRequestVote
from models.user import User
from schemas.purchase_request import CreatePurchaseRequestRequest

def get_purchase_requests(session: Session) -> list[PurchaseRequest]:
    """Returns all purchase requests ranked by upvote count descending."""
    statement = select(PurchaseRequest).order_by(PurchaseRequest.upvote_count.desc())
    return session.exec(statement).all()

def create_purchase_request(
    session: Session, current_user: User, request: CreatePurchaseRequestRequest
) -> PurchaseRequest:
    """Submits a new purchase request on behalf of a member."""
    new_request = PurchaseRequest(
        member_id=current_user.id,
        title=request.title,
        author=request.author,
        description=request.description,
        status=RequestStatus.PENDING,
        upvote_count=0,
    )
    session.add(new_request)
    session.commit()
    session.refresh(new_request)
    return new_request

def upvote_purchase_request(session: Session, current_user: User, request_id: int) -> PurchaseRequest:
    """Adds an upvote from a member to a purchase request, rejecting duplicate votes."""
    purchase_request = session.get(PurchaseRequest, request_id)
    if not purchase_request:
        raise HTTPException(status_code=404, detail="Purchase request not found")
        
    vote = PurchaseRequestVote(request_id=request_id, member_id=current_user.id)
    session.add(vote)
    
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=400, detail="You have already upvoted this request")
        
    purchase_request.upvote_count += 1
    session.add(purchase_request)
    session.commit()
    session.refresh(purchase_request)
    
    return purchase_request

def mark_purchase_request_purchased(session: Session, request_id: int) -> PurchaseRequest:
    """Marks a purchase request as purchased."""
    purchase_request = session.get(PurchaseRequest, request_id)
    if not purchase_request:
        raise HTTPException(status_code=404, detail="Purchase request not found")
        
    if purchase_request.status == RequestStatus.PURCHASED:
        return purchase_request

    purchase_request.status = RequestStatus.PURCHASED
    purchase_request.purchased_at = datetime.utcnow()
    session.add(purchase_request)
    session.commit()
    session.refresh(purchase_request)
    return purchase_request
