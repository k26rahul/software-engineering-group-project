from datetime import datetime

from sqlmodel import SQLModel

from models.enums import SubscriptionFrequency, SubscriptionType


class CreateSubscriptionRequest(SQLModel):
  type: SubscriptionType
  copies: int
  price_per_copy: float
  frequency: SubscriptionFrequency
  vendor_id: int | None = None


class UpdateSubscriptionRequest(SQLModel):
  copies: int | None = None
  price_per_copy: float | None = None
  frequency: SubscriptionFrequency | None = None
  vendor_id: int | None = None


class SubscriptionResponse(SQLModel):
  id: int
  type: SubscriptionType
  copies: int
  price_per_copy: float
  frequency: SubscriptionFrequency
  is_active: bool
  created_at: datetime
