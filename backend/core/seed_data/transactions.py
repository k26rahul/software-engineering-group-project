# Seed data for borrowing transactions.
# member_email and book_isbn are resolved at seed time to their DB IDs.
# Transactions with a return_date are treated as completed.

from datetime import date

TRANSACTIONS = [
  # Completed (returned) transactions
  {
    "member_email": "arjun.sharma@example.com",
    "book_isbn": "9780132350884",  # Clean Code - copy 1
    "copy_number": 1,
    "issue_date": date(2026, 5, 1),
    "due_date": date(2026, 5, 15),
    "return_date": date(2026, 5, 14),
    "return_condition": "GOOD",
  },
  {
    "member_email": "priya.nair@example.com",
    "book_isbn": "9780132350884",  # Clean Code - copy 2
    "copy_number": 2,
    "issue_date": date(2026, 5, 10),
    "due_date": date(2026, 5, 25),
    "return_date": date(2026, 5, 26),  # returned one day late
    "return_condition": "GOOD",
  },
  {
    "member_email": "sneha.reddy@example.com",
    "book_isbn": "9780553380163",  # A Brief History of Time - copy 1
    "copy_number": 1,
    "issue_date": date(2026, 6, 1),
    "due_date": date(2026, 6, 15),
    "return_date": date(2026, 6, 13),
    "return_condition": "GOOD",
  },
  # Active (currently issued) transactions matching copy statuses set in books.py
  {
    "member_email": "member@example.com",
    "book_isbn": "9780132350884",  # Clean Code - copy 3 (ISSUED)
    "copy_number": 3,
    "issue_date": date(2026, 7, 20),
    "due_date": date(2026, 8, 3),
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "kiran.patel@example.com",
    "book_isbn": "9780451524935",  # 1984 - copy 1 (ISSUED)
    "copy_number": 1,
    "issue_date": date(2026, 7, 15),
    "due_date": date(2026, 7, 29),  # overdue
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "arjun.sharma@example.com",
    "book_isbn": "9780451524935",  # 1984 - copy 2 (ISSUED)
    "copy_number": 2,
    "issue_date": date(2026, 7, 22),
    "due_date": date(2026, 8, 5),
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "priya.nair@example.com",
    "book_isbn": "9781451648539",  # Steve Jobs - copy 2 (ISSUED)
    "copy_number": 2,
    "issue_date": date(2026, 7, 28),
    "due_date": date(2026, 8, 11),
    "return_date": None,
    "return_condition": None,
  },
]
