from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from models.book import Book
from models.reading_list import ReadingList, ReadingListBook
from schemas.reading_list import CreateReadingListRequest, UpdateReadingListRequest


def get_reading_lists(session: Session) -> list[ReadingList]:
    statement = select(ReadingList).options(selectinload(ReadingList.books))
    return session.exec(statement).all()


def get_reading_list(session: Session, list_id: int) -> ReadingList:
    statement = select(ReadingList).where(ReadingList.id == list_id).options(selectinload(ReadingList.books))
    reading_list = session.exec(statement).first()
    if not reading_list:
        raise HTTPException(status_code=404, detail="Reading list not found")
    return reading_list


def create_reading_list(session: Session, request: CreateReadingListRequest) -> ReadingList:
    reading_list = ReadingList(title=request.title, description=request.description)
    session.add(reading_list)
    session.commit()
    session.refresh(reading_list)
    
    if request.book_ids:
        for book_id in request.book_ids:
            # check if book exists
            book = session.get(Book, book_id)
            if not book:
                continue # or raise error, but skipping is safer for list creation
            rl_book = ReadingListBook(reading_list_id=reading_list.id, book_id=book_id)
            session.add(rl_book)
        session.commit()
        
    return get_reading_list(session, reading_list.id)


def update_reading_list(session: Session, list_id: int, request: UpdateReadingListRequest) -> ReadingList:
    reading_list = get_reading_list(session, list_id)
    
    if request.title is not None:
        reading_list.title = request.title
    if request.description is not None:
        reading_list.description = request.description
        
    session.add(reading_list)
    
    if request.add_book_ids:
        for book_id in request.add_book_ids:
            # check if already exists
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


def add_book_to_reading_list(session: Session, list_id: int, book_id: int) -> ReadingList:
    # issue asks for POST /reading-lists/{id}/books
    return update_reading_list(session, list_id, UpdateReadingListRequest(add_book_ids=[book_id]))


def remove_book_from_reading_list(session: Session, list_id: int, book_id: int):
    # issue asks for DELETE /reading-lists/{id}/books/{book_id}
    statement = select(ReadingListBook).where(
        ReadingListBook.reading_list_id == list_id, ReadingListBook.book_id == book_id
    )
    existing = session.exec(statement).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Book not found in reading list")
    session.delete(existing)
    session.commit()


def delete_reading_list(session: Session, list_id: int):
    reading_list = get_reading_list(session, list_id)
    # delete associations first if needed, sqlmodel might handle it depending on config but safe to do manually
    statement = select(ReadingListBook).where(ReadingListBook.reading_list_id == list_id)
    associations = session.exec(statement).all()
    for assoc in associations:
        session.delete(assoc)
        
    session.delete(reading_list)
    session.commit()
