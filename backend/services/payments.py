"""Service layer for Payments API."""

from fastapi import HTTPException, status
from sqlmodel import Session, select

from models.enums import PaymentType
from models.payment import Fine, Payment
from models.transaction import Transaction
from models.user import User
from schemas.payment import FineResponse, PaymentResponse, ProcessPaymentRequest


class PaymentsService:
  """Service for managing fines and payments."""

  @staticmethod
  def get_pending_fines(session: Session, member_id: int) -> list[FineResponse]:
    """Retrieve pending fines for a specific member."""
    user = session.get(User, member_id)
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Member with ID {member_id} not found.",
      )

    statement = select(Fine, Transaction).join(Transaction, Fine.transaction_id == Transaction.id).where(Fine.member_id == member_id, Fine.is_paid == False)  # noqa: E712
    results = session.exec(statement).all()

    response = []
    for f, t in results:
      title = "Unknown Book"
      if t.book_copy and t.book_copy.book:
        title = t.book_copy.book.title
      
      status = "OVERDUE" if t.is_overdue() else "ACTIVE"
      
      response.append(
        FineResponse(
          id=f.id,
          transaction_id=f.transaction_id,
          amount=f.amount,
          reason=f.reason,
          is_paid=f.is_paid,
          book_title=title,
          status=status,
        )
      )
    return response

  @staticmethod
  def get_payment_history(session: Session, member_id: int) -> list[PaymentResponse]:
    """Retrieve payment history for a specific member."""
    user = session.get(User, member_id)
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Member with ID {member_id} not found.",
      )

    statement = select(Payment).where(Payment.member_id == member_id)
    payments = session.exec(statement).all()

    return [
      PaymentResponse(
        id=p.id,
        amount=p.amount,
        type=p.type,
        fine_id=p.fine_id,
        status="COMPLETED",  # hardcoded as we assume processed payments are completed
        created_at=p.created_at,
      )
      for p in payments
    ]

  @staticmethod
  def pay_fine(
    session: Session, current_user: User, fine_id: int, request: ProcessPaymentRequest
  ) -> PaymentResponse:
    """Process a payment for a specific fine."""
    fine = session.get(Fine, fine_id)
    if not fine:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Fine with ID {fine_id} not found.",
      )
    if fine.member_id != current_user.id:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You can only pay your own fines.",
      )
    if fine.is_paid:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="This fine is already paid.",
      )
    if request.amount < fine.amount:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Payment amount is less than the fine amount.",
      )

    # Process payment
    payment = Payment(
      member_id=current_user.id,
      amount=request.amount,
      type=PaymentType.FINE_PAYMENT,
      fine_id=fine.id,
    )
    fine.is_paid = True
    session.add(payment)
    session.add(fine)
    session.commit()
    session.refresh(payment)

    return PaymentResponse(
      id=payment.id,
      amount=payment.amount,
      type=payment.type,
      fine_id=payment.fine_id,
      status="COMPLETED",
      created_at=payment.created_at,
    )

  @staticmethod
  def pay_membership_renewal(
    session: Session, current_user: User, request: ProcessPaymentRequest
  ) -> PaymentResponse:
    """Process annual membership renewal fee payment."""
    payment = Payment(
      member_id=current_user.id,
      amount=request.amount,
      type=PaymentType.MEMBERSHIP_FEE,
      fine_id=None,
    )
    session.add(payment)
    session.commit()
    session.refresh(payment)

    return PaymentResponse(
      id=payment.id,
      amount=payment.amount,
      type=payment.type,
      fine_id=payment.fine_id,
      status="COMPLETED",
      created_at=payment.created_at,
    )
