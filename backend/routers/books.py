"""Books Catalog API router handling book search, details, management, and copies."""

from fastapi import APIRouter, Query, status

from core.dependencies import LibrarianDep, SessionDep
from schemas.book import (
  AddBookRequest,
  BookDetailResponse,
  BookSummaryResponse,
  ISBNLookupRequest,
  UpdateBookRequest,
  UpdateCopyStatusRequest,
)
from services.books import BooksService

books_router = APIRouter(tags=["Books"])

# Shared response sets for common error patterns.
_AUTH_ERRORS = {401: {"description": "Invalid, expired, or revoked token."}}
_LIBRARIAN_ERRORS = {
  **_AUTH_ERRORS,
  403: {"description": "Insufficient permissions. Librarian role required."},
}
_NOT_FOUND = {404: {"description": "Requested resource not found."}}


@books_router.get(
  "/books",
  response_model=list[BookSummaryResponse],
  summary="List catalog books",
  description=(
    "Retrieves a list of all books in the catalog, optionally filtered by search query or category."
  ),
)
def list_books(
  session: SessionDep,
  query: str | None = Query(default=None, description="Search term for title, author, or ISBN"),
  category: str | None = Query(default=None, description="Filter by genre or category"),
) -> list[BookSummaryResponse]:
  return BooksService.list_books(session, query=query, category=category)


@books_router.post(
  "/books",
  response_model=BookDetailResponse,
  status_code=status.HTTP_201_CREATED,
  summary="Add a new book",
  description=(
    "Librarian-only. Adds a new book to the library catalog with initial physical copies."
  ),
  responses={
    **_LIBRARIAN_ERRORS,
    400: {"description": "A book with the provided ISBN already exists."},
  },
)
def create_book(
  request: AddBookRequest,
  session: SessionDep,
  _: LibrarianDep,
  copies: int = Query(default=1, ge=1, description="Number of initial physical copies"),
) -> BookDetailResponse:
  return BooksService.create_book(session, request, initial_copies=copies)


@books_router.post(
  "/books/isbn-lookup",
  response_model=AddBookRequest,
  summary="Lookup book by ISBN",
  description="Fetches book metadata from external ISBN database to auto-fill entry fields.",
)
def isbn_lookup(
  request: ISBNLookupRequest,
  session: SessionDep,
) -> AddBookRequest:
  return BooksService.isbn_lookup(session, request.isbn)


@books_router.get(
  "/books/{id}",
  response_model=BookDetailResponse,
  summary="Get book details",
  description=(
    "Retrieves detailed information about a specific book including copy availability and ratings."
  ),
  responses={**_NOT_FOUND},
)
def get_book(
  id: int,
  session: SessionDep,
) -> BookDetailResponse:
  return BooksService.get_book_by_id(session, id)


@books_router.patch(
  "/books/{id}",
  response_model=BookDetailResponse,
  summary="Update book metadata",
  description="Librarian-only. Updates metadata fields for an existing book.",
  responses={
    **_LIBRARIAN_ERRORS,
    **_NOT_FOUND,
  },
)
def update_book(
  id: int,
  request: UpdateBookRequest,
  session: SessionDep,
  _: LibrarianDep,
) -> BookDetailResponse:
  return BooksService.update_book(session, id, request)


@books_router.patch(
  "/books/{id}/copies/{copy_id}",
  response_model=BookDetailResponse,
  summary="Update book copy status",
  description=(
    "Librarian-only. Updates physical copy status (e.g. AVAILABLE, ISSUED, DAMAGED, LOST)."
  ),
  responses={
    **_LIBRARIAN_ERRORS,
    **_NOT_FOUND,
  },
)
def update_copy_status(
  id: int,
  copy_id: int,
  request: UpdateCopyStatusRequest,
  session: SessionDep,
  _: LibrarianDep,
) -> BookDetailResponse:
  return BooksService.update_copy_status(session, id, copy_id, request)
