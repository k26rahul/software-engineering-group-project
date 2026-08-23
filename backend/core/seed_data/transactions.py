# Seed data for borrowing transactions.
# member_email and book_isbn are resolved at seed time to their DB IDs.
# Transactions with a return_date are "completed"; without one they are "active".
# Active transactions where due_date < today are flagged as overdue by the backend.
#
# Today reference: 2026-08-22
#   Overdue  → due_date before 2026-08-22, no return_date  (4 transactions)
#   Normal   → due_date after  2026-08-22, no return_date  (4 transactions)
#   Completed → return_date set                             (2 transactions)

from datetime import date

TRANSACTIONS = [
  # ── Completed (returned) ─────────────────────────────────────────────────
  {
    "member_email": "arjun.sharma@example.com",
    "book_isbn": "9780132350884",   # Clean Code – copy 1 (AVAILABLE after return)
    "copy_number": 1,
    "issue_date": date(2026, 5, 1),
    "due_date": date(2026, 5, 15),
    "return_date": date(2026, 5, 14),
    "return_condition": "GOOD",
  },
  {
    "member_email": "priya.nair@example.com",
    "book_isbn": "9780132350884",   # Clean Code – copy 2 (AVAILABLE after return)
    "copy_number": 2,
    "issue_date": date(2026, 5, 10),
    "due_date": date(2026, 5, 25),
    "return_date": date(2026, 5, 26),  # returned one day late
    "return_condition": "GOOD",
  },

  # ── Overdue (active, due date in the past) ────────────────────────────────
  {
    "member_email": "kiran.patel@example.com",
    "book_isbn": "9780451524935",   # 1984 – copy 1 (ISSUED)
    "copy_number": 1,
    "issue_date": date(2026, 7, 15),
    "due_date": date(2026, 7, 29),  # 24 days overdue
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "member@example.com",
    "book_isbn": "9780132350884",   # Clean Code – copy 3 (ISSUED)
    "copy_number": 3,
    "issue_date": date(2026, 7, 20),
    "due_date": date(2026, 8, 3),   # 19 days overdue
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "arjun.sharma@example.com",
    "book_isbn": "9780198788607",   # The Selfish Gene – copy 2 (ISSUED)
    "copy_number": 2,
    "issue_date": date(2026, 7, 22),
    "due_date": date(2026, 8, 5),   # 17 days overdue
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "priya.nair@example.com",
    "book_isbn": "9781451648539",   # Steve Jobs – copy 2 (ISSUED)
    "copy_number": 2,
    "issue_date": date(2026, 7, 28),
    "due_date": date(2026, 8, 11),  # 11 days overdue
    "return_date": None,
    "return_condition": None,
  },

  # ── Normal / Active (due date in the future) ──────────────────────────────
  {
    "member_email": "sneha.reddy@example.com",
    "book_isbn": "9780451524935",   # 1984 – copy 2 (ISSUED)
    "copy_number": 2,
    "issue_date": date(2026, 8, 10),
    "due_date": date(2026, 9, 10),  # 19 days from now
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "kiran.patel@example.com",
    "book_isbn": "9781451648539",   # Steve Jobs – copy 3 (ISSUED)
    "copy_number": 3,
    "issue_date": date(2026, 8, 12),
    "due_date": date(2026, 9, 5),   # 14 days from now
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "member@example.com",
    "book_isbn": "9780062316097",   # Sapiens – copy 4 (ISSUED)
    "copy_number": 4,
    "issue_date": date(2026, 8, 15),
    "due_date": date(2026, 9, 15),  # 24 days from now
    "return_date": None,
    "return_condition": None,
  },
  {
    "member_email": "arjun.sharma@example.com",
    "book_isbn": "9780198788607",   # The Selfish Gene – copy 3 (ISSUED)
    "copy_number": 3,
    "issue_date": date(2026, 8, 18),
    "due_date": date(2026, 9, 18),  # 27 days from now
    "return_date": None,
    "return_condition": None,
  },
]
