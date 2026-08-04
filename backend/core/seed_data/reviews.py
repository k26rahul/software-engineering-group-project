# Seed data for book reviews.
# member_email and book_isbn are resolved at seed time to their DB IDs.

REVIEWS = [
  {
    "member_email": "arjun.sharma@example.com",
    "book_isbn": "9780132350884",  # Clean Code
    "rating": 5,
    "text": "An absolute must-read for every software developer. Transformed how I think about code quality.",
    "status": "APPROVED",
  },
  {
    "member_email": "priya.nair@example.com",
    "book_isbn": "9780132350884",  # Clean Code
    "rating": 4,
    "text": "Excellent principles, though some examples feel dated. Still highly relevant.",
    "status": "APPROVED",
  },
  {
    "member_email": "sneha.reddy@example.com",
    "book_isbn": "9780553380163",  # A Brief History of Time
    "rating": 5,
    "text": "Hawking has a remarkable gift for making complex cosmology accessible to anyone.",
    "status": "APPROVED",
  },
  {
    "member_email": "member@example.com",
    "book_isbn": "9780743273565",  # The Great Gatsby
    "rating": 4,
    "text": "Beautifully written. The prose is poetic and the story is timeless.",
    "status": "APPROVED",
  },
  {
    "member_email": "kiran.patel@example.com",
    "book_isbn": "9780451524935",  # 1984
    "rating": 5,
    "text": "Terrifying and prophetic. More relevant today than ever.",
    "status": "APPROVED",
  },
  {
    "member_email": "arjun.sharma@example.com",
    "book_isbn": "9780062316097",  # Sapiens
    "rating": 4,
    "text": "A sweeping and thought-provoking account of human history.",
    "status": "PENDING",
  },
  {
    "member_email": "priya.nair@example.com",
    "book_isbn": "9780201633610",  # Design Patterns
    "rating": 4,
    "text": "Dense but invaluable. A reference book every engineer should have on their shelf.",
    "status": "APPROVED",
  },
]
