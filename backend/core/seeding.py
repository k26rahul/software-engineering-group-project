from datetime import date

from sqlmodel import Session, select

from core.auth import hash_password
from core.seed_data.books import BOOKS
from core.seed_data.budget import BUDGET_ENTRIES
from core.seed_data.members import MEMBERS
from core.seed_data.purchase_requests import PURCHASE_REQUESTS
from core.seed_data.reading_lists import READING_LISTS
from core.seed_data.reservations import RESERVATIONS
from core.seed_data.reviews import REVIEWS
from core.seed_data.subscriptions import SUBSCRIPTIONS
from core.seed_data.transactions import TRANSACTIONS
from models.book import Book, BookCopy
from models.reading_list import ReadingList, ReadingListBook
from models.budget import BudgetEntry
from models.enums import (
  CopyStatus,
  MemberApprovalStatus,
  MembershipType,
  RequestStatus,
  ReservationStatus,
  ReturnCondition,
  ReviewStatus,
  SubscriptionFrequency,
  SubscriptionType,
  UserRole,
)
from models.purchase_request import PurchaseRequest
from models.reservation import Reservation
from models.review import Review
from models.subscription import Newspaper, Subscription
from models.transaction import Transaction
from models.user import User
from models.notification import Notification
from models.enums import NotificationType


def seed_default_users(session: Session) -> None:
  """Seeds default development users if the database is empty."""
  # If any user exists, skip seeding to avoid duplicate entries.
  if session.exec(select(User)).first() is not None:
    return

  users_to_seed = [
    User(
      email="librarian@example.com",
      name="Chitra",
      password_hash=hash_password("password123"),
      role=UserRole.LIBRARIAN,
      is_active=True,
      approval_status=MemberApprovalStatus.APPROVED,
      max_issue_limit=10,
    ),
    User(
      email="member@example.com",
      name="Vaishnavi",
      password_hash=hash_password("password123"),
      role=UserRole.MEMBER,
      is_active=True,
      approval_status=MemberApprovalStatus.APPROVED,
      max_issue_limit=3,
      membership_type=MembershipType.ON_CAMPUS,
    ),
    User(
      email="management@example.com",
      name="Vishnu",
      password_hash=hash_password("password123"),
      role=UserRole.CAMPUS_MANAGEMENT,
      is_active=True,
      approval_status=MemberApprovalStatus.APPROVED,
      max_issue_limit=0,
    ),
  ]

  for user in users_to_seed:
    session.add(user)

  session.commit()


def seed_members(session: Session) -> None:
  """Seeds additional member accounts."""
  if session.exec(select(User).where(User.email == MEMBERS[0]["email"])).first() is not None:
    return

  for data in MEMBERS:
    user = User(
      name=data["name"],
      email=data["email"],
      phone=data["phone"],
      password_hash=hash_password("password123"),
      role=UserRole.MEMBER,
      membership_type=MembershipType(data["membership_type"]),
      approval_status=MemberApprovalStatus(data["approval_status"]),
      is_active=data["is_active"],
      max_issue_limit=data["max_issue_limit"],
      membership_start_date=date(2025, 9, 1) if data["is_active"] else None,
    )
    session.add(user)

  session.commit()


def seed_books(session: Session) -> None:
  """Seeds books and their physical copies."""
  if session.exec(select(Book)).first() is not None:
    return

  for data in BOOKS:
    book = Book(
      title=data["title"],
      author=data["author"],
      isbn=data["isbn"],
      category=data["category"],
      price=data["price"],
      description=data["description"],
    )
    session.add(book)
    session.flush()  # assigns book.id before creating copies

    for i, copy_status in enumerate(data["copies"], start=1):
      copy = BookCopy(
        book_id=book.id,
        copy_number=i,
        status=CopyStatus(copy_status),
      )
      session.add(copy)

  session.commit()


def seed_transactions(session: Session) -> None:
  """Seeds borrowing transactions for existing members and book copies."""
  if session.exec(select(Transaction)).first() is not None:
    return

  for data in TRANSACTIONS:
    member = session.exec(select(User).where(User.email == data["member_email"])).first()
    book = session.exec(select(Book).where(Book.isbn == data["book_isbn"])).first()
    if member is None or book is None:
      continue

    copy = session.exec(
      select(BookCopy).where(
        BookCopy.book_id == book.id,
        BookCopy.copy_number == data["copy_number"],
      )
    ).first()
    if copy is None:
      continue

    transaction = Transaction(
      member_id=member.id,
      book_copy_id=copy.id,
      issue_date=data["issue_date"],
      due_date=data["due_date"],
      return_date=data["return_date"],
      return_condition=ReturnCondition(data["return_condition"])
      if data["return_condition"]
      else None,
    )
    session.add(transaction)

  session.commit()


def seed_reservations(session: Session) -> None:
  """Seeds waitlist reservations for books."""
  if session.exec(select(Reservation)).first() is not None:
    return

  for data in RESERVATIONS:
    member = session.exec(select(User).where(User.email == data["member_email"])).first()
    book = session.exec(select(Book).where(Book.isbn == data["book_isbn"])).first()
    if member is None or book is None:
      continue

    reservation = Reservation(
      member_id=member.id,
      book_id=book.id,
      status=ReservationStatus(data["status"]),
      notified_at=data["notified_at"],
      fulfilled_at=data["fulfilled_at"],
    )
    session.add(reservation)

  session.commit()


def seed_reviews(session: Session) -> None:
  """Seeds book reviews by members."""
  if session.exec(select(Review)).first() is not None:
    return

  for data in REVIEWS:
    member = session.exec(select(User).where(User.email == data["member_email"])).first()
    book = session.exec(select(Book).where(Book.isbn == data["book_isbn"])).first()
    if member is None or book is None:
      continue

    review = Review(
      member_id=member.id,
      book_id=book.id,
      rating=data["rating"],
      text=data["text"],
      status=ReviewStatus(data["status"]),
    )
    session.add(review)

  session.commit()


def seed_purchase_requests(session: Session) -> None:
  """Seeds member purchase requests for new books."""
  if session.exec(select(PurchaseRequest)).first() is not None:
    return

  for data in PURCHASE_REQUESTS:
    member = session.exec(select(User).where(User.email == data["member_email"])).first()
    if member is None:
      continue

    request = PurchaseRequest(
      member_id=member.id,
      title=data["title"],
      author=data.get("author"),
      description=data.get("description"),
      upvote_count=data["upvote_count"],
      status=RequestStatus(data["status"]),
    )
    session.add(request)

  session.commit()


def seed_subscriptions(session: Session) -> None:
  """Seeds newspaper and magazine subscriptions."""
  if session.exec(select(Subscription)).first() is not None:
    return

  for data in SUBSCRIPTIONS:
    subscription = Subscription(
      type=SubscriptionType(data["type"]),
      copies=data["copies"],
      price_per_copy=data["price_per_copy"],
      frequency=SubscriptionFrequency(data["frequency"]),
      is_active=data["is_active"],
    )
    session.add(subscription)
    session.flush()

    if data["type"] == "NEWSPAPER" and "newspaper" in data:
      newspaper_data = data["newspaper"]
      newspaper = Newspaper(
        title=newspaper_data["title"],
        language=newspaper_data["language"],
        publisher=newspaper_data["publisher"],
        subscription_id=subscription.id,
      )
      session.add(newspaper)

  session.commit()


def seed_notifications(session: Session) -> None:
  """Seeds notifications for the librarian user."""
  if session.exec(select(Notification)).first() is not None:
    return

  librarian = session.exec(select(User).where(User.role == UserRole.LIBRARIAN)).first()
  if librarian is None:
    return

  notifications = [
    Notification(
      recipient_id=librarian.id,
      type=NotificationType.REGISTRATION_APPROVED,
      message="New member registration request from Amit Patel requires your approval.",
      is_read=False,
    ),
    Notification(
      recipient_id=librarian.id,
      type=NotificationType.OVERDUE_REMINDER,
      message="The book 'The Catcher in the Rye' issued to Vaishnavi is overdue by 26 days.",
      is_read=False,
    ),
    Notification(
      recipient_id=librarian.id,
      type=NotificationType.BILLING_RENEWAL,
      message="Monthly billing report is ready for review.",
      is_read=False,
    ),
  ]
  for n in notifications:
    session.add(n)
  session.commit()


def seed_budget_entries(session: Session) -> None:
  """Seeds default budget entries."""
  if session.exec(select(BudgetEntry)).first() is not None:
    return

  for data in BUDGET_ENTRIES:
    entry = BudgetEntry(
      description=data["description"],
      category=data["category"],
      amount=data["amount"],
      type=data["type"],
      date=data["date"],
    )
    session.add(entry)

  session.commit()


def seed_reading_lists(session: Session) -> None:
  """Seeds librarian-curated reading lists with book associations."""
  if session.exec(select(ReadingList)).first() is not None:
    return

  for data in READING_LISTS:
    reading_list = ReadingList(title=data["title"], description=data["description"])
    session.add(reading_list)
    session.flush()  # assigns reading_list.id before linking books

    for isbn in data["book_isbns"]:
      book = session.exec(select(Book).where(Book.isbn == isbn)).first()
      if book is None:
        continue
      rl_book = ReadingListBook(reading_list_id=reading_list.id, book_id=book.id)
      session.add(rl_book)

  session.commit()
