from fastapi import HTTPException
from sqlmodel import Session, select

from models.subscription import Subscription
from schemas.subscription import CreateSubscriptionRequest, UpdateSubscriptionRequest


def get_subscriptions(session: Session) -> list[Subscription]:
  statement = select(Subscription)
  return session.exec(statement).all()


def create_subscription(session: Session, request: CreateSubscriptionRequest) -> Subscription:
  subscription = Subscription(
    type=request.type,
    copies=request.copies,
    price_per_copy=request.price_per_copy,
    frequency=request.frequency,
    vendor_id=request.vendor_id,
    is_active=True,
  )
  session.add(subscription)
  session.commit()
  session.refresh(subscription)
  return subscription


def update_subscription(
  session: Session, subscription_id: int, request: UpdateSubscriptionRequest
) -> Subscription:
  subscription = session.get(Subscription, subscription_id)
  if not subscription:
    raise HTTPException(status_code=404, detail="Subscription not found")

  if request.copies is not None:
    subscription.copies = request.copies
  if request.price_per_copy is not None:
    subscription.price_per_copy = request.price_per_copy
  if request.frequency is not None:
    subscription.frequency = request.frequency
  if request.vendor_id is not None:
    subscription.vendor_id = request.vendor_id

  session.add(subscription)
  session.commit()
  session.refresh(subscription)
  return subscription


def delete_subscription(session: Session, subscription_id: int) -> None:
  subscription = session.get(Subscription, subscription_id)
  if not subscription:
    raise HTTPException(status_code=404, detail="Subscription not found")

  subscription.is_active = False
  session.add(subscription)
  session.commit()
