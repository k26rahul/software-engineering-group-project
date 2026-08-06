from fastapi import APIRouter, Depends
from sqlmodel import Session

import services.subscriptions as subscription_service
from core.database import get_session
from core.dependencies import LibrarianDep
from schemas.subscription import (
  CreateSubscriptionRequest,
  SubscriptionResponse,
  UpdateSubscriptionRequest,
)

subscriptions_router = APIRouter(tags=["Subscriptions"])


@subscriptions_router.get("/subscriptions", response_model=list[SubscriptionResponse])
def get_subscriptions(session: Session = Depends(get_session)):
  """Retrieves all recurring subscriptions."""
  return subscription_service.get_subscriptions(session)


@subscriptions_router.post("/subscriptions", response_model=SubscriptionResponse)
def create_subscription(
  request: CreateSubscriptionRequest,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Adds a new recurring subscription for a newspaper or magazine."""
  return subscription_service.create_subscription(session, request)


@subscriptions_router.patch("/subscriptions/{id}", response_model=SubscriptionResponse)
def update_subscription(
  id: int,
  request: UpdateSubscriptionRequest,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Updates details of an existing subscription."""
  return subscription_service.update_subscription(session, id, request)


@subscriptions_router.delete("/subscriptions/{id}", status_code=204)
def delete_subscription(
  id: int,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Cancels an active subscription."""
  subscription_service.delete_subscription(session, id)
