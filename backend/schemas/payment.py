from datetime import datetime

from sqlmodel import SQLModel

from models.enums import PaymentType, ReturnCondition


class ProcessPaymentRequest(SQLModel):
  type: PaymentType
  amount: float
  fine_id: int | None = None


class PaymentResponse(SQLModel):
  id: int
  amount: float
  type: PaymentType
  fine_id: int | None
  created_at: datetime


class FineResponse(SQLModel):
  id: int
  transaction_id: int
  amount: float
  reason: ReturnCondition
  is_paid: bool
