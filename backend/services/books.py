"""Service layer for Books Catalog domain."""

from fastapi import HTTPException, status
from sqlmodel import Session, select

from models.book import Book, BookCopy
from schemas.book import (
  AddBookRequest,
  BookDetailResponse,
  BookSummaryResponse,
  UpdateBookRequest,
  UpdateCopyStatusRequest,
)


class BooksService:
  """Service handling catalog filtering, book creation, metadata updates, and copies."""

  @staticmethod
  def list_books(
    session: Session, query: str | None = None, category: str | None = None
  ) -> list[BookSummaryResponse]:
    """Retrieve catalog books with optional query and category filters."""
    statement = select(Book)
    if category:
      statement = statement.where(Book.category.ilike(f"%{category}%"))
    if query:
      search = f"%{query}%"
      statement = statement.where(
        Book.title.ilike(search) | Book.author.ilike(search) | Book.isbn.ilike(search)
      )

    books = session.exec(statement).all()
    results = []
    for b in books:
      results.append(
        BookSummaryResponse(
          id=b.id,
          title=b.title,
          author=b.author,
          isbn=b.isbn,
          category=b.category,
          price=b.price,
          available_copies=b.available_copies(session),
          is_active=b.is_active,
        )
      )
    return results

  @staticmethod
  def get_book_by_id(session: Session, book_id: int) -> BookDetailResponse:
    """Retrieve detailed information for a specific book."""
    book = session.get(Book, book_id)
    if not book:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Book with ID {book_id} not found.",
      )
    return BookDetailResponse(
      id=book.id,
      title=book.title,
      author=book.author,
      isbn=book.isbn,
      category=book.category,
      price=book.price,
      description=book.description,
      available_copies=book.available_copies(session),
      average_rating=book.average_rating(session),
      created_at=book.created_at,
      is_active=book.is_active,
      copies=[
        {"id": c.id, "copy_number": c.copy_number, "status": c.status}
        for c in book.copies
      ],
    )

  @staticmethod
  def create_book(
    session: Session, request: AddBookRequest, initial_copies: int = 1
  ) -> BookDetailResponse:
    """Add a new book to the catalog and create default copies."""
    if request.isbn:
      existing = session.exec(select(Book).where(Book.isbn == request.isbn)).first()
      if existing:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail=f"Book with ISBN {request.isbn} already exists.",
        )

    book = Book(
      title=request.title,
      author=request.author,
      isbn=request.isbn,
      category=request.category,
      price=request.price,
      description=request.description,
    )
    session.add(book)
    session.commit()
    session.refresh(book)

    for copy_num in range(1, initial_copies + 1):
      copy = BookCopy(book_id=book.id, copy_number=copy_num)
      session.add(copy)
    session.commit()
    session.refresh(book)

    return BooksService.get_book_by_id(session, book.id)

  @staticmethod
  def update_book(session: Session, book_id: int, request: UpdateBookRequest) -> BookDetailResponse:
    """Update metadata for an existing book."""
    book = session.get(Book, book_id)
    if not book:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Book with ID {book_id} not found.",
      )

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
      setattr(book, field, value)

    session.add(book)
    session.commit()
    session.refresh(book)
    return BooksService.get_book_by_id(session, book.id)

  @staticmethod
  def delete_book(session: Session, book_id: int):
    """Archive a book (soft delete)."""
    book = session.get(Book, book_id)
    if not book:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Book with ID {book_id} not found.",
      )
    book.is_active = False
    session.add(book)
    session.commit()
    return {"message": f"Book '{book.title}' archived successfully."}

  @staticmethod
  def restore_book(session: Session, book_id: int):
    """Unarchive a book."""
    book = session.get(Book, book_id)
    if not book:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Book with ID {book_id} not found.",
      )
    book.is_active = True
    session.add(book)
    session.commit()
    return {"message": f"Book '{book.title}' restored successfully."}

  @staticmethod
  def isbn_lookup(session: Session, isbn: str) -> AddBookRequest:
    """Lookup ISBN in external catalog simulation and return auto-fill data."""
    existing = session.exec(select(Book).where(Book.isbn == isbn)).first()
    if existing:
      return AddBookRequest(
        title=existing.title,
        author=existing.author,
        isbn=existing.isbn,
        category=existing.category,
        price=existing.price,
        description=existing.description,
      )

    return AddBookRequest(
      title=f"External Book ({isbn})",
      author="External Author",
      isbn=isbn,
      category="General",
      price=29.99,
      description=f"Auto-filled details for ISBN {isbn}",
    )

  @staticmethod
  def update_copy_status(
    session: Session, book_id: int, copy_id: int, request: UpdateCopyStatusRequest
  ) -> BookDetailResponse:
    """Update physical copy status for a book."""
    copy = session.get(BookCopy, copy_id)
    if not copy or copy.book_id != book_id:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Copy {copy_id} for book {book_id} not found.",
      )

    copy.status = request.status
    session.add(copy)
    session.commit()
    return BooksService.get_book_by_id(session, book_id)

  @staticmethod
  def add_copy(session: Session, book_id: int):
    """Add a new physical copy for a book."""
    book = session.get(Book, book_id)
    if not book:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Book with ID {book_id} not found.",
      )
    
    # Determine the next copy number
    # The highest existing copy number might not be len(copies) if copies were deleted
    # But let's just use max(copy.copy_number) + 1, or 1 if no copies exist
    if book.copies:
      next_number = max(c.copy_number for c in book.copies) + 1
    else:
      next_number = 1
      
    new_copy = BookCopy(book_id=book.id, copy_number=next_number)
    session.add(new_copy)
    session.commit()
    
    # Refresh to return the new copy data. The schema might return the new copy directly or BookDetail.
    # In this case, we return the newly created copy object as dict to match frontend expectation.
    session.refresh(new_copy)
    return {"id": new_copy.id, "copy_number": new_copy.copy_number, "status": new_copy.status}
