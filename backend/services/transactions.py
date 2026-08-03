"""Service layer for Circulation & Transactions domain."""

from datetime import date

from fastapi import HTTPException, status
from sqlmodel import Session, select

from models.book import BookCopy
from models.enums import CopyStatus, MemberApprovalStatus, ReturnCondition
from models.payment import Fine
from models.transaction import Transaction
from models.user import User
from schemas.transaction import IssueBookRequest, ReturnBookRequest, TransactionResponse


class TransactionsService:
  """Service handling book issuing, returns, overdue calculations, and current issues."""

  @staticmethod
  def issue_book(session: Session, request: IssueBookRequest) -> TransactionResponse:
    """Issue a physical book copy to an active member."""
    member = session.get(User, request.member_id)
    if (
      not member or not member.is_active or member.approval_status != MemberApprovalStatus.APPROVED
    ):
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Member must be active and approved to issue books.",
      )

    copy = session.get(BookCopy, request.book_copy_id)
    if not copy or copy.status != CopyStatus.AVAILABLE:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Book copy is not available for issuing.",
      )

    active_issues = session.exec(
      select(Transaction).where(
        Transaction.member_id == member.id, Transaction.return_date.is_(None)
      )
    ).all()

    if len(active_issues) >= member.max_issue_limit:
      raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=f"Member has reached maximum borrowing limit of {member.max_issue_limit} books.",
      )

    copy.status = CopyStatus.ISSUED
    session.add(copy)

    transaction = Transaction(
      member_id=request.member_id,
      book_copy_id=request.book_copy_id,
      issue_date=date.today(),
      due_date=request.due_date,
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return TransactionResponse(
      id=transaction.id,
      member_id=transaction.member_id,
      book_copy_id=transaction.book_copy_id,
      issue_date=transaction.issue_date,
      due_date=transaction.due_date,
      return_date=transaction.return_date,
      return_condition=transaction.return_condition,
      is_overdue=transaction.is_overdue(),
    )

  @staticmethod
  def return_book(session: Session, request: ReturnBookRequest) -> TransactionResponse:
    """Process the return of an issued book copy and calculate fines if overdue or damaged."""
    transaction = session.get(Transaction, request.transaction_id)
    if not transaction:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Transaction with ID {request.transaction_id} not found.",
      )

    if transaction.return_date is not None:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Transaction has already been returned.",
      )

    today = date.today()
    transaction.return_date = today
    transaction.return_condition = request.condition

    copy = session.get(BookCopy, transaction.book_copy_id)
    if copy:
      if request.condition == ReturnCondition.GOOD:
        copy.status = CopyStatus.AVAILABLE
      elif request.condition == ReturnCondition.DAMAGED:
        copy.status = CopyStatus.DAMAGED
      elif request.condition == ReturnCondition.LOST:
        copy.status = CopyStatus.LOST
      session.add(copy)

    fine_amount = 0.0
    if today > transaction.due_date:
      days_overdue = (today - transaction.due_date).days
      fine_amount += days_overdue * 2.0  # $2/day fine rate

    if request.condition == ReturnCondition.DAMAGED:
      fine_amount += 15.0  # $15 damage fee
    elif request.condition == ReturnCondition.LOST:
      fine_amount += 50.0  # $50 lost book replacement fee

    if fine_amount > 0:
      overdue_days = max(0, (today - transaction.due_date).days)
      fine = Fine(
        transaction_id=transaction.id,
        member_id=transaction.member_id,
        amount=fine_amount,
        reason=f"Return condition: {request.condition.value}, overdue days: {overdue_days}",
      )
      session.add(fine)

    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return TransactionResponse(
      id=transaction.id,
      member_id=transaction.member_id,
      book_copy_id=transaction.book_copy_id,
      issue_date=transaction.issue_date,
      due_date=transaction.due_date,
      return_date=transaction.return_date,
      return_condition=transaction.return_condition,
      is_overdue=False,
    )

  @staticmethod
  def get_transaction(session: Session, transaction_id: int) -> TransactionResponse:
    """Retrieve details for a specific transaction."""
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Transaction with ID {transaction_id} not found.",
      )
    return TransactionResponse(
      id=transaction.id,
      member_id=transaction.member_id,
      book_copy_id=transaction.book_copy_id,
      issue_date=transaction.issue_date,
      due_date=transaction.due_date,
      return_date=transaction.return_date,
      return_condition=transaction.return_condition,
      is_overdue=transaction.is_overdue(),
    )

  @staticmethod
  def get_overdue_transactions(session: Session) -> list[TransactionResponse]:
    """Retrieve all currently overdue borrowing transactions."""
    today = date.today()
    transactions = session.exec(
      select(Transaction).where(Transaction.return_date.is_(None), Transaction.due_date < today)
    ).all()

    return [
      TransactionResponse(
        id=t.id,
        member_id=t.member_id,
        book_copy_id=t.book_copy_id,
        issue_date=t.issue_date,
        due_date=t.due_date,
        return_date=t.return_date,
        return_condition=t.return_condition,
        is_overdue=True,
      )
      for t in transactions
    ]

  @staticmethod
  def get_member_current_issues(session: Session, member_id: int) -> list[TransactionResponse]:
    """Retrieve active issued books for a specific member."""
    transactions = session.exec(
      select(Transaction).where(
        Transaction.member_id == member_id, Transaction.return_date.is_(None)
      )
    ).all()

    return [
      TransactionResponse(
        id=t.id,
        member_id=t.member_id,
        book_copy_id=t.book_copy_id,
        issue_date=t.issue_date,
        due_date=t.due_date,
        return_date=t.return_date,
        return_condition=t.return_condition,
        is_overdue=t.is_overdue(),
      )
      for t in transactions
    ]
