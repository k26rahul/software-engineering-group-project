from fastapi import APIRouter

from core.dependencies import CurrentUserDep, SessionDep
from schemas.payment import FineResponse, PaymentResponse, ProcessPaymentRequest
from services.payments import PaymentsService

payments_router = APIRouter(tags=["Payments"])


@payments_router.get(
  "/members/{id}/fines",
  response_model=list[FineResponse],
  summary="Get pending fines",
  description="Retrieve pending (unpaid) fines for a member.",
)
def get_pending_fines(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> list[FineResponse]:
  return PaymentsService.get_pending_fines(session, id)


@payments_router.get(
  "/members/{id}/payments",
  response_model=list[PaymentResponse],
  summary="Get payment history",
  description="Retrieves the complete payment history for a specific member.",
)
def get_payment_history(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> list[PaymentResponse]:
  return PaymentsService.get_payment_history(session, id)


@payments_router.post(
  "/payments/fines/{fine_id}",
  response_model=PaymentResponse,
  summary="Process fine payment",
  description="Processes payment for a specific fine.",
)
def pay_fine(
  fine_id: int,
  request: ProcessPaymentRequest,
  session: SessionDep,
  current_user: CurrentUserDep,
) -> PaymentResponse:
  return PaymentsService.pay_fine(session, current_user, fine_id, request)


@payments_router.post(
  "/payments/membership-renewal",
  response_model=PaymentResponse,
  summary="Process membership renewal payment",
  description="Processes annual membership renewal fee payment.",
)
def pay_membership_renewal(
  request: ProcessPaymentRequest,
  session: SessionDep,
  current_user: CurrentUserDep,
) -> PaymentResponse:
  return PaymentsService.pay_membership_renewal(session, current_user, request)
