"""User Story definitions and API endpoint mapping connecting backend endpoints to SMART user stories from 4_user-stories.md."""  # noqa: E501

USER_STORIES = {
  "US-1.1": "As a Librarian, I want to securely log in to the administrative dashboard, so that I can manage library operations without unauthorized access.",  # noqa: E501
  "US-1.2": "As a Librarian, I want to review and manage digital member registrations, profile details, and borrowing histories.",  # noqa: E501
  "US-1.3": "As a Librarian, I want to manage the book catalog (add/edit books, ISBN lookup, and physical copy statuses).",  # noqa: E501
  "US-1.4": "As a Librarian, I want to digitally issue and return books, track overdue loans, and auto-calculate condition fines.",  # noqa: E501
  "US-1.5": "As a Librarian, I want the system to alert me when a returned book has an active waitlist reservation.",  # noqa: E501
  "US-1.6": "As a Librarian, I want to view a ranked list of new book purchase requests and mark them as purchased.",  # noqa: E501
  "US-1.7": "As a Librarian, I want to manage newspaper or magazine subscriptions.",  # noqa: E501
  "US-1.8": "As a Librarian, I want to enter book purchases and track the monthly budget allowance.",  # noqa: E501
  "US-1.9": "As a Librarian, I want to create reading lists and moderate book reviews.",  # noqa: E501
  "US-2.1": "As a Member, I want to self-register and securely log in to access digital services and manage my account.",  # noqa: E501
  "US-2.2": "As a Member, I want to search the digital catalog using filters and view real-time book copy availability.",  # noqa: E501
  "US-2.3": "As a Member, I want to view my active borrowing dashboard with exact return deadlines and current issues.",  # noqa: E501
  "US-2.4": "As a Member, I want to place and cancel waitlist reservations on out-of-stock books.",  # noqa: E501
  "US-2.5": "As a Member, I want to submit and upvote book purchase requests.",  # noqa: E501
  "US-2.6": "As a Member, I want to submit and read book reviews.",  # noqa: E501
  "US-2.7": "As a Member, I want to pay membership renewal fees or outstanding fines and view payment history.",  # noqa: E501
  "US-2.8": "As a Member, I want to see personalized book recommendations.",  # noqa: E501
  "US-3.1": "As Campus Management, I want to view high-level reports on library usage and circulation analytics.",  # noqa: E501
  "US-3.2": "As Campus Management, I want to view month-end itemized expense reports for budget oversight.",  # noqa: E501
  "INFRA-1.0": "System health and liveness status check for uptime monitoring.",
}

USER_STORY_MAP = {
  "/auth/register": {
    "post": ["US-2.1"],
  },
  "/auth/login": {
    "post": ["US-1.1", "US-2.1"],
  },
  "/auth/logout": {
    "post": ["US-1.1", "US-2.1"],
  },
  "/auth/change-password": {
    "post": ["US-2.1"],
  },
  "/auth/me": {
    "get": ["US-1.1", "US-2.1"],
  },
  "/books": {
    "get": ["US-2.2", "US-1.3"],
    "post": ["US-1.3"],
  },
  "/books/isbn-lookup": {
    "post": ["US-1.3"],
  },
  "/books/{id}": {
    "get": ["US-2.2"],
    "patch": ["US-1.3"],
  },
  "/books/{id}/copies/{copy_id}": {
    "patch": ["US-1.3"],
  },
  "/members": {
    "get": ["US-1.2"],
  },
  "/members/{id}": {
    "get": ["US-1.2"],
  },
  "/members/{id}/approve": {
    "patch": ["US-1.2", "US-2.1"],
  },
  "/members/{id}/reject": {
    "patch": ["US-1.2"],
  },
  "/members/{id}/profile": {
    "patch": ["US-1.2"],
  },
  "/members/{id}/history": {
    "get": ["US-1.2"],
  },
  "/transactions/issue": {
    "post": ["US-1.4", "US-2.3"],
  },
  "/transactions/return": {
    "post": ["US-1.4"],
  },
  "/transactions/overdue": {
    "get": ["US-1.4"],
  },
  "/transactions/{id}": {
    "get": ["US-1.4"],
  },
  "/members/{id}/current-issues": {
    "get": ["US-2.3"],
  },
  "/reservations": {
    "post": ["US-2.4"],
  },
  "/reservations/{id}": {
    "delete": ["US-2.4"],
  },
  "/reservations/alerts": {
    "get": ["US-1.5"],
  },
  "/members/{id}/reservations": {
    "get": ["US-2.4"],
  },
  "/purchase-requests": {
    "get": ["US-1.6", "US-2.5"],
    "post": ["US-2.5"],
  },
  "/purchase-requests/{id}/upvote": {
    "post": ["US-2.5"],
  },
  "/purchase-requests/{id}/status": {
    "patch": ["US-1.6"],
  },
  "/budget": {
    "get": ["US-1.8"],
  },
  "/budget/expenses": {
    "post": ["US-1.8"],
  },
  "/subscriptions": {
    "get": ["US-1.7"],
    "post": ["US-1.7"],
  },
  "/subscriptions/{id}": {
    "patch": ["US-1.7"],
    "delete": ["US-1.7"],
  },
  "/reports/usage": {
    "get": ["US-3.1"],
  },
  "/reports/expense": {
    "get": ["US-3.2"],
  },
  "/reports/download/{type}": {
    "get": ["US-3.1", "US-3.2"],
  },
  "/books/{id}/reviews": {
    "post": ["US-2.6"],
    "get": ["US-2.6"],
  },
  "/books/reviews/{review_id}": {
    "delete": ["US-1.9", "US-2.6"],
  },
  "/reviews/{id}/moderate": {
    "patch": ["US-1.9"],
  },
  "/reading-lists": {
    "get": ["US-1.9"],
    "post": ["US-1.9"],
  },
  "/reading-lists/{id}": {
    "get": ["US-1.9"],
    "patch": ["US-1.9"],
    "delete": ["US-1.9"],
  },
  "/reading-lists/{id}/books": {
    "post": ["US-1.9"],
  },
  "/reading-lists/{id}/books/{book_id}": {
    "delete": ["US-1.9"],
  },
  "/members/{id}/recommendations": {
    "get": ["US-2.8"],
  },
  "/payments/fines": {
    "get": ["US-2.7"],
  },
  "/payments/history": {
    "get": ["US-2.7"],
  },
  "/payments/fines/{fine_id}": {
    "post": ["US-2.7"],
  },
  "/payments/membership-renewal": {
    "post": ["US-2.7"],
  },
  "/dashboard/librarian": {
    "get": ["US-1.1", "US-1.2", "US-1.4"],
  },
  "/dashboard/management": {
    "get": ["US-3.1"],
  },
  "/health": {
    "get": ["INFRA-1.0"],
  },
}
