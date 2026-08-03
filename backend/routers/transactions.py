"""Circulation & Transactions API router for issuing, returns, and overdue tracking."""

from fastapi import APIRouter, status

from core.dependencies import CurrentUserDep, LibrarianDep, SessionDep
from schemas.transaction import IssueBookRequest, ReturnBookRequest, TransactionResponse
from services.transactions import TransactionsService

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
  response_model=list[TransactionResponse],
  summary="Get member current issues",
  description="Retrieves a list of all books currently issued to a specific member.",
  responses={**_AUTH_ERRORS},
)
def get_member_current_issues(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> list[TransactionResponse]:
  return TransactionsService.get_member_current_issues(session, id)
