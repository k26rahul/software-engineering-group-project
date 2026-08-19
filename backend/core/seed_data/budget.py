import datetime

BUDGET_ENTRIES = [
  {
    "description": "Purchased 'Clean Code' by Robert C. Martin",
    "category": "Book Purchase",
    "amount": 1500.0,
    "type": "EXPENSE",
    "date": datetime.date.today() - datetime.timedelta(days=2),
  },
  {
    "description": "Late return fine from Vaishnavi",
    "category": "Fines",
    "amount": 50.0,
    "type": "INCOME",
    "date": datetime.date.today() - datetime.timedelta(days=1),
  },
  {
    "description": "Library software subscription renewal",
    "category": "Software",
    "amount": 3000.0,
    "type": "EXPENSE",
    "date": datetime.date.today(),
  },
  {
    "description": "Donation from Alumni",
    "category": "Donations",
    "amount": 5000.0,
    "type": "INCOME",
    "date": datetime.date.today() - datetime.timedelta(days=5),
  },
  {
    "description": "Maintenance and cleaning supplies",
    "category": "Maintenance",
    "amount": 800.0,
    "type": "EXPENSE",
    "date": datetime.date.today() - datetime.timedelta(days=10),
  }
]
