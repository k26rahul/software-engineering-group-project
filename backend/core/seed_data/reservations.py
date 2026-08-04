# Seed data for book reservations.
# member_email and book_isbn are resolved at seed time to their DB IDs.

from datetime import datetime, timezone

RESERVATIONS = [
  {
    "member_email": "member@example.com",
    "book_isbn": "9780451524935",  # 1984 - 0 available copies
    "status": "WAITING",
    "notified_at": None,
    "fulfilled_at": None,
  },
  {
    "member_email": "arjun.sharma@example.com",
    "book_isbn": "9780060935467",  # To Kill a Mockingbird - 0 available copies (LOST)
    "status": "NOTIFIED",
    "notified_at": datetime(2026, 8, 1, 10, 0, 0, tzinfo=timezone.utc),
    "fulfilled_at": None,
  },
  {
    "member_email": "priya.nair@example.com",
    "book_isbn": "9780132350884",  # Clean Code
    "status": "FULFILLED",
    "notified_at": datetime(2026, 7, 10, 10, 0, 0, tzinfo=timezone.utc),
    "fulfilled_at": datetime(2026, 7, 12, 14, 0, 0, tzinfo=timezone.utc),
  },
]
