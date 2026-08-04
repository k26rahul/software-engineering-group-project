# Seed data for member purchase requests.
# member_email is resolved at seed time to the member's DB ID.

PURCHASE_REQUESTS = [
  {
    "member_email": "arjun.sharma@example.com",
    "title": "Designing Data-Intensive Applications",
    "author": "Martin Kleppmann",
    "description": "Essential reading for backend engineers working with distributed systems.",
    "upvote_count": 5,
    "status": "PENDING",
  },
  {
    "member_email": "priya.nair@example.com",
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt, David Thomas",
    "description": "A classic on developer mindset and career growth.",
    "upvote_count": 3,
    "status": "PENDING",
  },
  {
    "member_email": "sneha.reddy@example.com",
    "title": "Refactoring: Improving the Design of Existing Code",
    "author": "Martin Fowler",
    "description": "Practical guide to restructuring existing code without breaking functionality.",
    "upvote_count": 7,
    "status": "PURCHASED",
  },
  {
    "member_email": "member@example.com",
    "title": "Structure and Interpretation of Computer Programs",
    "author": "Harold Abelson, Gerald Jay Sussman",
    "description": "A foundational text in computer science education.",
    "upvote_count": 2,
    "status": "PENDING",
  },
]
