from fastapi import HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from models.book import Book
from models.reading_list import ReadingList, ReadingListBook
from schemas.reading_list import (
  CreateReadingListRequest,
  ReadingListBookItem,
  ReadingListDetailResponse,
  ReadingListResponse,
  UpdateReadingListRequest,
)


def _to_response(reading_list: ReadingList) -> ReadingListResponse:
  book_ids = [book.id for book in reading_list.books] if reading_list.books else []
  return ReadingListResponse(
    id=reading_list.id,
    title=reading_list.title,
    description=reading_list.description,
    book_ids=book_ids,
    created_at=reading_list.created_at,
  )


def get_reading_lists(session: Session) -> list[ReadingListResponse]:
  statement = select(ReadingList).options(selectinload(ReadingList.books))
  lists = session.exec(statement).all()
  return [_to_response(rl) for rl in lists]


def get_reading_list(session: Session, list_id: int) -> ReadingListResponse:
  statement = (
    select(ReadingList).where(ReadingList.id == list_id).options(selectinload(ReadingList.books))
  )
  reading_list = session.exec(statement).first()
  if not reading_list:
    raise HTTPException(status_code=404, detail="Reading list not found")
  return _to_response(reading_list)


def get_reading_list_detail(session: Session, list_id: int) -> ReadingListDetailResponse:
  """Returns a reading list with full book details for the member reading list page."""
  statement = (
    select(ReadingList).where(ReadingList.id == list_id).options(selectinload(ReadingList.books))
  )
  reading_list = session.exec(statement).first()
  if not reading_list:
    raise HTTPException(status_code=404, detail="Reading list not found")

  books = [
    ReadingListBookItem(
      id=book.id,
      title=book.title,
      author=book.author,
      category=book.category,
      available_copies=book.available_copies(session),
    )
    for book in (reading_list.books or [])
  ]
  return ReadingListDetailResponse(
    id=reading_list.id,
    title=reading_list.title,
    description=reading_list.description,
    created_at=reading_list.created_at,
    books=books,
  )


def create_reading_list(session: Session, request: CreateReadingListRequest) -> ReadingListResponse:
  reading_list = ReadingList(title=request.title, description=request.description)
  session.add(reading_list)
  session.commit()
  session.refresh(reading_list)

  if request.book_ids:
    for book_id in request.book_ids:
      book = session.get(Book, book_id)
      if not book:
        continue
      rl_book = ReadingListBook(reading_list_id=reading_list.id, book_id=book_id)
      session.add(rl_book)
    session.commit()

  return get_reading_list(session, reading_list.id)


def update_reading_list(
  session: Session, list_id: int, request: UpdateReadingListRequest
) -> ReadingListResponse:
  statement = (
    select(ReadingList).where(ReadingList.id == list_id).options(selectinload(ReadingList.books))
  )
  reading_list = session.exec(statement).first()
  if not reading_list:
    raise HTTPException(status_code=404, detail="Reading list not found")

  if request.title is not None:
    reading_list.title = request.title
  if request.description is not None:
    reading_list.description = request.description

  session.add(reading_list)

  if request.add_book_ids:
    for book_id in request.add_book_ids:
      statement = select(ReadingListBook).where(
        ReadingListBook.reading_list_id == list_id, ReadingListBook.book_id == book_id
      )
      existing = session.exec(statement).first()
      if not existing:
        rl_book = ReadingListBook(reading_list_id=list_id, book_id=book_id)
        session.add(rl_book)

  if request.remove_book_ids:
    for book_id in request.remove_book_ids:
      statement = select(ReadingListBook).where(
        ReadingListBook.reading_list_id == list_id, ReadingListBook.book_id == book_id
      )
      existing = session.exec(statement).first()
      if existing:
        session.delete(existing)

  session.commit()
  return get_reading_list(session, list_id)


def add_book_to_reading_list(session: Session, list_id: int, book_id: int) -> ReadingListResponse:
  return update_reading_list(session, list_id, UpdateReadingListRequest(add_book_ids=[book_id]))


def remove_book_from_reading_list(session: Session, list_id: int, book_id: int):
  statement = select(ReadingListBook).where(
    ReadingListBook.reading_list_id == list_id, ReadingListBook.book_id == book_id
  )
  existing = session.exec(statement).first()
  if not existing:
    raise HTTPException(status_code=404, detail="Book not found in reading list")
  session.delete(existing)
  session.commit()


def delete_reading_list(session: Session, list_id: int):
  statement = select(ReadingList).where(ReadingList.id == list_id)
  reading_list = session.exec(statement).first()
  if not reading_list:
    raise HTTPException(status_code=404, detail="Reading list not found")

  statement = select(ReadingListBook).where(ReadingListBook.reading_list_id == list_id)
  associations = session.exec(statement).all()
  for assoc in associations:
    session.delete(assoc)

  session.delete(reading_list)
  session.commit()
