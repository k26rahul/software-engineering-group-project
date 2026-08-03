"""User Story definitions and API endpoint mapping connecting backend endpoints to SMART user stories from 4_user-stories.md."""

USER_STORIES = {
    "US-1.1": "As a Librarian, I want to securely log in to the administrative dashboard, so that I can manage library operations without unauthorized access.",
    "US-1.2": "As a Librarian, I want to review and manage digital member registrations, profile details, and borrowing histories.",
    "US-1.3": "As a Librarian, I want to manage the book catalog (add/edit books, ISBN lookup, and physical copy statuses).",
    "US-1.4": "As a Librarian, I want to digitally issue and return books, track overdue loans, and auto-calculate condition fines.",
    "US-1.5": "As a Librarian, I want the system to alert me when a returned book has an active waitlist reservation.",
    "US-2.1": "As a Member, I want to self-register and securely log in to access digital services and manage my account.",
    "US-2.2": "As a Member, I want to search the digital catalog using filters and view real-time book copy availability.",
    "US-2.3": "As a Member, I want to view my active borrowing dashboard with exact return deadlines and current issues.",
    "US-2.4": "As a Member, I want to place and cancel waitlist reservations on out-of-stock books.",
    "US-3.1": "As Campus Management, I want to view high-level reports on library usage and circulation analytics.",
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
