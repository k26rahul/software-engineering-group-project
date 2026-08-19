from fastapi import APIRouter, Depends
from sqlmodel import Session

import services.reading_lists as reading_list_service
from core.database import get_session
from core.dependencies import LibrarianDep
from schemas.reading_list import (
  CreateReadingListRequest,
  ReadingListDetailResponse,
  ReadingListResponse,
  UpdateReadingListRequest,
)

reading_lists_router = APIRouter(tags=["Reading Lists"])


@reading_lists_router.get("/reading-lists", response_model=list[ReadingListResponse])
def get_reading_lists(session: Session = Depends(get_session)):
  """Retrieves a list of all reading lists."""
  return reading_list_service.get_reading_lists(session)


@reading_lists_router.get("/reading-lists/{id}", response_model=ReadingListResponse)
def get_reading_list(id: int, session: Session = Depends(get_session)):
  """Retrieves the details and associated books for a specific reading list."""
  return reading_list_service.get_reading_list(session, id)


@reading_lists_router.get("/reading-lists/{id}/detail", response_model=ReadingListDetailResponse)
def get_reading_list_detail(id: int, session: Session = Depends(get_session)):
  """Retrieves a reading list with full embedded book details for the member UI."""
  return reading_list_service.get_reading_list_detail(session, id)


@reading_lists_router.post("/reading-lists", response_model=ReadingListResponse)
def create_reading_list(
  request: CreateReadingListRequest,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Creates a new reading list (Librarian-only)."""
  return reading_list_service.create_reading_list(session, request)


@reading_lists_router.patch("/reading-lists/{id}", response_model=ReadingListResponse)
def update_reading_list(
  id: int,
  request: UpdateReadingListRequest,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Updates an existing reading list or adds/removes books from it."""
  return reading_list_service.update_reading_list(session, id, request)


@reading_lists_router.delete("/reading-lists/{id}", status_code=204)
def delete_reading_list(
  id: int,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Deletes a specific reading list."""
  reading_list_service.delete_reading_list(session, id)


@reading_lists_router.post("/reading-lists/{id}/books", response_model=ReadingListResponse)
def add_book_to_reading_list(
  id: int,
  book_id: int,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Add a book to a reading list."""
  return reading_list_service.add_book_to_reading_list(session, id, book_id)


@reading_lists_router.delete("/reading-lists/{id}/books/{book_id}", status_code=204)
def remove_book_from_reading_list(
  id: int,
  book_id: int,
  current_user: LibrarianDep,
  session: Session = Depends(get_session),
):
  """Remove a book from a reading list."""
  reading_list_service.remove_book_from_reading_list(session, id, book_id)
