# Seed data for subscriptions (newspapers and magazines).

SUBSCRIPTIONS = [
  # Newspaper subscriptions
  {
    "type": "NEWSPAPER",
    "copies": 5,
    "price_per_copy": 8.0,
    "frequency": "DAILY",
    "is_active": True,
    "newspaper": {
      "title": "The Hindu",
      "language": "English",
      "publisher": "Kasturi & Sons",
    },
  },
  {
    "type": "NEWSPAPER",
    "copies": 3,
    "price_per_copy": 6.0,
    "frequency": "DAILY",
    "is_active": True,
    "newspaper": {
      "title": "Dainik Bhaskar",
      "language": "Hindi",
      "publisher": "DB Corp",
    },
  },
  # Magazine subscriptions
  {
    "type": "MAGAZINE",
    "copies": 2,
    "price_per_copy": 150.0,
    "frequency": "MONTHLY",
    "is_active": True,
  },
  {
    "type": "MAGAZINE",
    "copies": 1,
    "price_per_copy": 80.0,
    "frequency": "WEEKLY",
    "is_active": False,
  },
]
