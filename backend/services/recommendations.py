"""Service layer for book recommendations."""

from fastapi import HTTPException, status
from sqlmodel import Session, select, func

from models.book import Book, BookCopy
from models.enums import CopyStatus
from models.transaction import Transaction
from models.user import User
from schemas.book import BookRecommendationResponse


class RecommendationsService:
  """Service for generating book recommendations."""

  @staticmethod
  def get_recommendations(session: Session, member_id: int) -> list[BookRecommendationResponse]:
    """Generates personalized book recommendations for a member based on their reading history."""
    user = session.get(User, member_id)
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Member with ID {member_id} not found.",
      )

    # Fetch member's past transactions to understand reading history
    transactions = session.exec(select(Transaction).where(Transaction.member_id == member_id)).all()
    read_book_ids = {t.book_copy.book_id for t in transactions if t.book_copy}
    
    recommendations = []
    
    if read_book_ids:
      # Extract categories and authors from read books
      read_books = session.exec(select(Book).where(Book.id.in_(read_book_ids))).all()
      categories = {book.category for book in read_books}
      authors = {book.author for book in read_books}
      
      # Query for books in same categories or by same authors that haven't been read
      statement = select(Book).where(
        Book.id.not_in(read_book_ids),
        (Book.category.in_(categories) | Book.author.in_(authors))
      ).limit(5)
      
      recommended_books = session.exec(statement).all()
      
      for book in recommended_books:
        # Determine availability
        available_copies = session.exec(
          select(func.count(BookCopy.id)).where(
            BookCopy.book_id == book.id,
            BookCopy.status == CopyStatus.AVAILABLE
          )
        ).one()
        
        reason = f"Because you read '{book.category}' books" if book.category in categories else f"Because you read books by '{book.author}'"
        
        recommendations.append(
          BookRecommendationResponse(
            id=book.id,
            book_id=book.id,
            title=book.title,
            author=book.author,
            category=book.category,
            availability=available_copies,
            reason=reason
          )
        )
        
    # Fallback logic if no recommendations found or empty history
    if not recommendations:
      statement = select(Book)
      if read_book_ids:
          statement = statement.where(Book.id.not_in(read_book_ids))
      statement = statement.limit(5)
      
      fallback_books = session.exec(statement).all()
      for book in fallback_books:
        available_copies = session.exec(
          select(func.count(BookCopy.id)).where(
            BookCopy.book_id == book.id,
            BookCopy.status == CopyStatus.AVAILABLE
          )
        ).one()
        recommendations.append(
          BookRecommendationResponse(
            id=book.id,
            book_id=book.id,
            title=book.title,
            author=book.author,
            category=book.category,
            availability=available_copies,
            reason="Popular in the library"
          )
        )
        
    return recommendations
