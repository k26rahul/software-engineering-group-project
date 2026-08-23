"""Circulation & Transactions API router for issuing, returns, and overdue tracking."""

from fastapi import APIRouter, status

from core.dependencies import CurrentUserDep, LibrarianDep, SessionDep
from schemas.transaction import (
  ActiveTransactionResponse,
  IssueBookRequest,
  MemberCurrentIssueResponse,
  ReturnBookRequest,
  ConditionRequest,
  InitiateReturnResponse,
  TransactionResponse,
)
from schemas.payment import FineResponse
from services.transactions import TransactionsService
from sqlmodel import select
from models.payment import Fine
from fastapi import HTTPException

transactions_router = APIRouter(tags=["Transactions"])

# Shared response sets for common error patterns.
_AUTH_ERRORS = {401: {"description": "Invalid, expired, or revoked token."}}
_LIBRARIAN_ERRORS = {
  **_AUTH_ERRORS,
  403: {"description": "Insufficient permissions. Librarian role required."},
}
_NOT_FOUND = {404: {"description": "Requested resource not found."}}


@transactions_router.post(
  "/transactions/issue",
  response_model=TransactionResponse,
  status_code=status.HTTP_201_CREATED,
  summary="Issue a book",
  description="Librarian-only. Issues an available book copy to an active member with a due date.",
  responses={
    **_LIBRARIAN_ERRORS,
    400: {"description": "Member is inactive/unapproved, or book copy is unavailable."},
    409: {"description": "Member has reached their maximum borrowing limit."},
  },
)
def issue_book(
  request: IssueBookRequest,
  session: SessionDep,
  _: LibrarianDep,
) -> TransactionResponse:
  return TransactionsService.issue_book(session, request)


@transactions_router.post(
  "/transactions/return",
  response_model=TransactionResponse,
  summary="Return a book",
  description="Librarian-only. Processes book return and calculates fines if overdue or damaged.",
  responses={
    **_LIBRARIAN_ERRORS,
    400: {"description": "Transaction has already been returned."},
    **_NOT_FOUND,
  },
)
def return_book(
  request: ReturnBookRequest,
  session: SessionDep,
  _: LibrarianDep,
) -> TransactionResponse:
  return TransactionsService.return_book(session, request)


@transactions_router.post(
  "/transactions/{id}/initiate-return",
  response_model=InitiateReturnResponse,
  summary="Initiate a book return",
  description="Librarian-only. Calculates fines and creates a pending fine if applicable.",
  responses={
    **_LIBRARIAN_ERRORS,
    400: {"description": "Transaction has already been returned."},
    **_NOT_FOUND,
  },
)
def initiate_return(
  id: int,
  request: ConditionRequest,
  session: SessionDep,
  _: LibrarianDep,
) -> InitiateReturnResponse:
  return TransactionsService.initiate_return(session, id, request)


@transactions_router.post(
  "/transactions/{id}/complete-return",
  response_model=TransactionResponse,
  summary="Complete a book return",
  description="Librarian-only. Completes the return if no pending unpaid fines exist.",
  responses={
    **_LIBRARIAN_ERRORS,
    400: {"description": "Transaction has already been returned or has unpaid fines."},
    **_NOT_FOUND,
  },
)
def complete_return(
  id: int,
  session: SessionDep,
  _: LibrarianDep,
) -> TransactionResponse:
  return TransactionsService.complete_return(session, id)


@transactions_router.get(
  "/transactions/{id}/fine",
  response_model=FineResponse,
  summary="Get pending fine for a transaction",
  description="Librarian-only. Gets the pending unpaid fine for a transaction, if any.",
  responses={
    **_LIBRARIAN_ERRORS,
    **_NOT_FOUND,
  },
)
def get_transaction_fine(
  id: int,
  session: SessionDep,
  _: LibrarianDep,
) -> FineResponse:
  fine = session.exec(select(Fine).where(Fine.transaction_id == id, Fine.is_paid == False)).first()
  if not fine:
    raise HTTPException(status_code=404, detail="No pending fine found for this transaction.")
  return FineResponse(
    id=fine.id,
    transaction_id=fine.transaction_id,
    amount=fine.amount,
    reason=fine.reason, # Type is ReturnCondition but schema can handle it or cast it
    is_paid=fine.is_paid,
  )


@transactions_router.get(
  "/transactions/active",
  response_model=list[ActiveTransactionResponse],
  summary="Get active transactions",
  description="Librarian-only. Retrieves a list of all currently active (not returned) transactions.",
  responses={**_LIBRARIAN_ERRORS},
)
def get_active_transactions(
  session: SessionDep,
  _: LibrarianDep,
  search: str | None = None,
) -> list[ActiveTransactionResponse]:
  return TransactionsService.get_active_transactions(session, search)


@transactions_router.get(
  "/transactions/overdue",
  response_model=list[TransactionResponse],
  summary="Get overdue transactions",
  description="Librarian-only. Retrieves a list of all currently overdue transactions.",
  responses={**_LIBRARIAN_ERRORS},
)
def get_overdue_transactions(
  session: SessionDep,
  _: LibrarianDep,
) -> list[TransactionResponse]:
  return TransactionsService.get_overdue_transactions(session)


@transactions_router.get(
  "/transactions/{id}",
  response_model=TransactionResponse,
  summary="Get transaction details",
  description="Retrieves details of a specific borrowing transaction.",
  responses={
    **_AUTH_ERRORS,
    **_NOT_FOUND,
  },
)
def get_transaction(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> TransactionResponse:
  return TransactionsService.get_transaction(session, id)


@transactions_router.get(
  "/members/{id}/current-issues",
  response_model=list[MemberCurrentIssueResponse],
  summary="Get member current issues",
  description="Retrieves a list of all books currently issued to a specific member.",
  responses={**_AUTH_ERRORS},
)
def get_member_current_issues(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> list[MemberCurrentIssueResponse]:
  return TransactionsService.get_member_current_issues(session, id)
