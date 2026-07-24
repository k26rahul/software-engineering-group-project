# Milestone 2 Deliverables

## Table of Contents

- [1. Component Design](#1-component-design)
    - [Modules vs. Components](#modules-vs-components)
    - [The System Architecture](#the-system-architecture)
        - [Key Technical Decisions](#key-technical-decisions)
    - [Module-to-Component Traceability Matrix](#module-to-component-traceability-matrix)
    - [1.1 Frontend Components](#11-frontend-components)
        - [Pages (Organized by User Role)](#pages-organized-by-user-role)
        - [Shared UI Components](#shared-ui-components)
    - [1.2 Backend Components](#12-backend-components)
        - [API Routers](#api-routers)
        - [Services (Business Logic Layer)](#services-business-logic-layer)
        - [Cross-Cutting Components](#cross-cutting-components)
        - [Service-to-Service Dependencies](#service-to-service-dependencies)
        - [Service-to-Model Dependencies](#service-to-model-dependencies)
    - [1.3 Database Components](#13-database-components)
        - [Enumerations](#enumerations)
        - [Data Models](#data-models)
        - [Model-to-Model Relationships](#model-to-model-relationships)
    - [1.4 Inter-Component Flow](#14-inter-component-flow)
        - [How Components Interact (Inter-Component Flow)](#how-components-interact-inter-component-flow)
- [2. UML Diagrams](#2-uml-diagrams)
    - [Class Diagram](#class-diagram)
        - [What the Class Diagram Shows](#what-the-class-diagram-shows)
        - [Relationship Types](#relationship-types)
        - [How to Read the Diagram](#how-to-read-the-diagram)
    - [Database Design (ER) Diagram](#database-design-er-diagram)
        - [What the ER Diagram Shows](#what-the-er-diagram-shows)
        - [How to Read the Diagram](#how-to-read-the-diagram)
- [3. Project Schedules](#3-project-schedules)
    - [Project Sprint Schedule](#project-sprint-schedule)
        - [Milestone 2: UI Implementation Phase](#milestone-2-ui-implementation-phase)
        - [Milestone 3 (Sprint 1): Backend API Development & Integration](#milestone-3-sprint-1-backend-api-development-integration)
        - [Milestone 4 (Sprint 2): Advanced Features & Final API Polish](#milestone-4-sprint-2-advanced-features-final-api-polish)
        - [Milestone 5: Final Submission & Handoff](#milestone-5-final-submission-handoff)
    - [Scrum Meetings Schedule and Minutes Summary](#scrum-meetings-schedule-and-minutes-summary)
        - [Past Meetings (Milestone 2)](#past-meetings-milestone-2)
        - [Future Meetings Roadmap (Milestones 3, 4, 5)](#future-meetings-roadmap-milestones-3-4-5)
- [4. Deliverable Screenshots](#4-deliverable-screenshots)
    - [GitHub Project Management](#github-project-management)
    - [Frontend Implementation](#frontend-implementation)
        - [1. Landing Page](#1-landing-page)
        - [2. Authentication](#2-authentication)
        - [3. Member Portal](#3-member-portal)
        - [4. Librarian Dashboard & Management](#4-librarian-dashboard-management)
        - [5. Campus Management](#5-campus-management)


## 1. Component Design



### What Is This Document?

This document introduces the component-level design for the Library Management System. It explains the design approach, defines key concepts, describes the system architecture, and ties everything together with inter-component workflows and a traceability matrix.

The actual component details are in three sub-documents:

| Document | What it covers |
|---|---|
| [1.2_Frontend Components](1.2_frontend-components.md) | Pages and shared UI components |
| [1.3_Backend Components](1.3_backend-components.md) | API routers, services, cross-cutting concerns, and dependency mappings |
| [1.4_Database Components](1.4_database-components.md) | Enumerations, data models, and model-to-model relationships |

---

### Modules vs. Components

The [requirements-analysis.md](../milestone-1/deliverables/5_requirements-analysis.md) identifies 9 **functional modules** - these are groups of related *business capabilities* (e.g., "Circulation Module" handles issue/return/fines). They describe *what* the system does.

**Components** describe *how* the system is built. A component is a self-contained piece of software with a defined interface. The Design of Components breaks down the system into the actual software pieces that will be coded, deployed, and connected.

| Concept | What it answers | Example |
|---|---|---|
| Module | "What business capability?" | Circulation Module |
| Component | "What software piece implements it?" | `CirculationService` (backend), `IssuePage` (frontend), `Transaction` model (database) |

The 9 modules decompose into many components across three layers: **Frontend**, **Backend**, and **Database**.


---

### The System Architecture

Our Library Management System follows a **three-tier architecture**:

```
┌─────────────────────────────────────┐
│      FRONTEND (React, Zustand)      │  ← What the user sees and interacts with
├─────────────────────────────────────┤
│          BACKEND (FastAPI)          │  ← Business logic, API endpoints, services
├─────────────────────────────────────┤
│     DATABASE (SQLite, SQLModel)     │  ← Persistent data storage
└─────────────────────────────────────┘
```

Each tier is decomposed into components in the sub-documents linked above.

#### Key Technical Decisions

**Authentication**: The system uses JWT-based authentication. Tokens are transported via HTTP `Authorization` headers (not cookies). A server-side in-memory blocklist is maintained for token invalidation on logout. No database-backed session model is needed.

**Magazine Handling**: Magazines are treated as books for lending purposes. A `Magazine` model stores magazine-specific metadata (issue number, issue date) and references a `Book` entry. Physical copies of a magazine issue are tracked through `BookCopy`, allowing the same circulation workflow (issue, return, fine) to apply to both books and magazines.

**Report Generation**: `BudgetService` generates raw expense data. `ReportService` calls `BudgetService` internally and formats the data for viewing and downloadable export. This avoids duplication between the two services.

---



---

### Module-to-Component Traceability Matrix

This matrix ensures every feature from the requirements analysis is covered by at least one component.

| Module | Frontend Components | Backend Components | Data Models |
|---|---|---|---|
| 1. Authentication & Identity | `LoginPage`, `RegistrationPage` | `auth_router`, `AuthService`, `AuthMiddleware`, `RBACMiddleware` | `User` |
| 2. Membership Management | `MemberApprovalPage`, `MemberDirectoryPage`, `MemberProfilePage`, `PaymentsPage` | `members_router`, `payments_router`, `MemberService`, `PaymentService` | `User`, `Fine`, `Payment` |
| 3. Catalog & Inventory | `CatalogManagementPage`, `CatalogSearchPage`, `BookDetailPage` | `catalog_router`, `CatalogService`, `ExternalISBNClient` | `Book`, `BookCopy`, `Magazine` |
| 4. Circulation | `IssuePage`, `ReturnPage`, `OverdueListPage`, `BorrowingDashboardPage` | `circulation_router`, `CirculationService`, `NotificationService` | `Transaction`, `Fine` |
| 5. Reservation & Request | `ReservationAlertsPage`, `MyReservationsPage`, `BookRequestPage`, `PurchaseRequestsPage` | `reservations_router`, `requests_router`, `ReservationService`, `PurchaseRequestService` | `Reservation`, `PurchaseRequest`, `PurchaseRequestVote` |
| 6. Community & Curation | `ReviewModerationPage`, `MyReviewsPage`, `ReadingListManagementPage` | `reviews_router`, `reading_lists_router`, `ReviewService`, `ReadingListService` | `Review`, `ReadingList`, `ReadingListBook` |
| 7. Recommendations | `MemberDashboard` (recommendations section) | `recommendations_router`, `RecommendationService` | `Transaction` (reads borrowing history), `Book` |
| 8. Budget & Subscription | `SubscriptionManagementPage`, `BookPurchaseEntryPage`, `BudgetTrackerPage` | `subscriptions_router`, `budget_router`, `SubscriptionService`, `BudgetService` | `Subscription`, `BookPurchaseEntry` |
| 9. Reporting | `UsageReportsPage`, `ExpenseReportPage` | `reports_router`, `ReportService` | Aggregates from `Transaction`, `User`, `BookPurchaseEntry`, `Subscription` |
| Cross-module | `NotificationsPage`, `NotificationBanner` | `notifications_router`, `NotificationService`, `EmailClient` | `Notification` |


### 1.1 Frontend Components



The frontend is a React application. Its components are organized as **Pages** (full screens a user navigates to) and **Shared UI Components** (reusable pieces used across pages).

---

#### Pages (Organized by User Role)

##### Common / Unauthenticated Pages

| Page Component | Purpose | Maps to Module |
|---|---|---|
| `LoginPage` | Secure login form for all user roles | Authentication & Identity |
| `RegistrationPage` | Self-registration form for new student members | Authentication & Identity |

##### Librarian Dashboard Pages

| Page Component | Purpose | Maps to Module |
|---|---|---|
| `LibrarianDashboard` | Landing page after login - shows summary stats (pending approvals, overdue count, budget utilization) | Cross-module |
| `MemberApprovalPage` | Queue of pending member registrations to approve/reject | Membership Management |
| `MemberDirectoryPage` | Searchable list of all members with profile links | Membership Management |
| `MemberProfilePage` | Individual member's full profile - borrowing history, fines, current issues, membership status | Membership Management |
| `CatalogManagementPage` | Add, edit, categorize books; ISBN barcode scanning; mark copies as lost/damaged | Catalog & Inventory |
| `IssuePage` | Issue a book to a member - select member, select book, set return deadline | Circulation |
| `ReturnPage` | Process a return - look up transaction, flag condition (good/damaged/lost), auto-calculate fine | Circulation |
| `OverdueListPage` | List of all currently overdue items across the library | Circulation |
| `ReservationAlertsPage` | Returned books that have active reservations - prompts librarian to hold aside | Reservation & Request |
| `PurchaseRequestsPage` | Ranked list of member book requests sorted by upvotes; mark as "Purchased" | Reservation & Request |
| `SubscriptionManagementPage` | Add, modify, cancel newspaper/magazine subscriptions | Budget & Subscription |
| `BookPurchaseEntryPage` | Enter new book purchases (title, copies, price, vendor) | Budget & Subscription |
| `BudgetTrackerPage` | Real-time view of monthly allowance utilization; month-end expense report generation | Budget & Subscription |
| `ReadingListManagementPage` | Create and manage themed reading lists | Community & Curation |
| `ReviewModerationPage` | Moderate member-submitted book reviews | Community & Curation |

##### Member Dashboard Pages

| Page Component | Purpose | Maps to Module |
|---|---|---|
| `MemberDashboard` | Landing page - currently issued books, due dates, recommendations, reading lists | Cross-module |
| `MemberProfilePage` | Member's own profile - personal details, borrowing history, fines, membership status | Membership Management |
| `CatalogSearchPage` | Search books by title/author/category; view real-time availability | Catalog & Inventory |
| `BookDetailPage` | Single book view - description, availability, reviews, reserve button | Catalog & Inventory, Community, Reservation |
| `BorrowingDashboardPage` | Currently issued items with due dates | Circulation |
| `MyReservationsPage` | Active reservations and their queue position | Reservation & Request |
| `BookRequestPage` | Submit new purchase requests; browse and upvote existing ones | Reservation & Request |
| `MyReviewsPage` | Reviews the member has submitted | Community & Curation |
| `PaymentsPage` | Pay membership fees or outstanding fines; view payment history | Membership Management |
| `NotificationsPage` | View all past notifications - reservation alerts, registration status, overdue reminders, billing renewals | Cross-module |

##### Campus Management Dashboard Pages

| Page Component | Purpose | Maps to Module |
|---|---|---|
| `ManagementDashboard` | Landing page - summary of library metrics | Reporting |
| `UsageReportsPage` | View and download library usage reports (active members, books issued, popular categories) | Reporting |
| `ExpenseReportPage` | View and download month-end itemized expense breakdown; approve reimbursement | Budget & Subscription, Reporting |

---

#### Shared UI Components

These are reusable building blocks used across multiple pages:

| Component | Purpose |
|---|---|
| `AppLayout` | Top-level layout shell - sidebar navigation, header bar, role-based menu items |
| `DataTable` | Configurable table with sorting, filtering, and pagination (used for member lists, overdue lists, catalog, etc.) |
| `SearchBar` | Text input with debounced search + filter dropdowns |
| `BookCard` | Card UI displaying a book's cover, title, author, availability badge |
| `NotificationBanner` | In-app notification display (approval status, overdue alerts, reservation alerts) |
| `ConfirmationModal` | Reusable modal for approve/reject/delete confirmations |
| `FineCalculator` | Displays calculated fine breakdown when flagging a returned book's condition |
| `BarcodeScannerInput` | ISBN barcode scanning widget (camera-based or manual entry fallback) |
| `StarRating` | Interactive star rating input + display |
| `BudgetProgressBar` | Visual progress bar showing budget utilization against ₹10,000 monthly cap |
| `FormField` | Standardized form input with validation and error states |


### 1.2 Backend Components



The backend is a FastAPI application. Its components are organized as **API Routers** (groups of related endpoints), **Services** (business logic), and **Cross-Cutting Concerns** (auth, notifications, etc.).

---

#### API Routers

Each router is a FastAPI router that exposes a group of REST endpoints.

| Router | Key Endpoints | Maps to Module |
|---|---|---|
| `auth_router` | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `POST /auth/change-password`, `GET /auth/me` | Authentication & Identity |
| `members_router` | `GET /members`, `GET /members/{id}`, `PATCH /members/{id}/approve`, `PATCH /members/{id}/reject`, `PATCH /members/{id}/profile`, `GET /members/{id}/history` | Membership Management |
| `catalog_router` | `GET /books`, `POST /books`, `PATCH /books/{id}`, `GET /books/{id}`, `POST /books/isbn-lookup`, `PATCH /books/{id}/copies/{copy_id}` | Catalog & Inventory |
| `circulation_router` | `POST /transactions/issue`, `POST /transactions/return`, `GET /transactions/{id}`, `GET /transactions/overdue`, `GET /members/{id}/current-issues` | Circulation |
| `reservations_router` | `POST /reservations`, `DELETE /reservations/{id}`, `GET /reservations/alerts`, `GET /members/{id}/reservations` | Reservation & Request |
| `requests_router` | `GET /purchase-requests`, `POST /purchase-requests`, `POST /purchase-requests/{id}/upvote`, `PATCH /purchase-requests/{id}/purchased` | Reservation & Request |
| `reviews_router` | `POST /books/{id}/reviews`, `GET /books/{id}/reviews`, `PATCH /reviews/{id}/moderate` | Community & Curation |
| `reading_lists_router` | `GET /reading-lists`, `GET /reading-lists/{id}`, `POST /reading-lists`, `PATCH /reading-lists/{id}`, `DELETE /reading-lists/{id}` | Community & Curation |
| `subscriptions_router` | `GET /subscriptions`, `POST /subscriptions`, `PATCH /subscriptions/{id}`, `DELETE /subscriptions/{id}` | Budget & Subscription |
| `budget_router` | `POST /budget/purchases`, `GET /budget/summary`, `GET /budget/expense-report` | Budget & Subscription |
| `recommendations_router` | `GET /members/{id}/recommendations` | Recommendations |
| `reports_router` | `GET /reports/usage`, `GET /reports/expense`, `GET /reports/download/{type}` | Reporting |
| `payments_router` | `POST /payments`, `GET /members/{id}/payments` | Membership Management |
| `notifications_router` | `GET /notifications`, `PATCH /notifications/{id}/read` | Cross-module |

---

#### Services (Business Logic Layer)

Services encapsulate business rules. Routers call services; services call the database. This separation keeps the API layer thin and the logic testable. Service classes contain no persistent state - they receive dependencies (database session, other services) and operate on data model classes.

##### `AuthService`

Login validation, JWT token generation, password hashing, role resolution. JWT-based auth with HTTP header transport; in-memory token blocklist for logout; role-based access control (Librarian, Member, Campus Management).

| Method | Parameters | Return Type |
|---|---|---|
| `login()` | `email: str, password: str` | `dict` |
| `register()` | `name: str, email: str, password: str, membership_type: MembershipType` | `User` |
| `logout()` | `token: str` | `None` |
| `get_current_user()` | `token: str` | `User` |
| `create_token()` | `user: User` | `str` |
| `hash_password()` | `password: str` | `str` |
| `verify_password()` | `password: str, hash: str` | `bool` |
| `change_password()` | `user_id: int, old_password: str, new_password: str` | `None` |

##### `MemberService`

Registration processing, approval workflow, profile management, billing cycle tracking. Off-campus members have a rolling 1-year billing cycle; librarian must approve before access is granted.

| Method | Parameters | Return Type |
|---|---|---|
| `get_all_members()` | `filters: dict` | `list[User]` |
| `get_member()` | `member_id: int` | `User` |
| `approve_member()` | `member_id: int` | `User` |
| `reject_member()` | `member_id: int` | `User` |
| `get_pending_approvals()` | — | `list[User]` |
| `get_borrowing_history()` | `member_id: int` | `list[Transaction]` |
| `check_billing_cycle()` | `member_id: int` | `bool` |
| `update_member_profile()` | `member_id: int, data: dict` | `User` |
| `deactivate_member()` | `member_id: int` | `User` |

##### `CatalogService`

Book CRUD, ISBN lookup integration, copy-level tracking, availability calculation. Availability = total copies minus (issued + lost + damaged copies); ISBN auto-fill from external API.

| Method | Parameters | Return Type |
|---|---|---|
| `get_all_books()` | `filters: dict` | `list[Book]` |
| `add_book()` | `book_data: dict` | `Book` |
| `update_book()` | `book_id: int, data: dict` | `Book` |
| `get_book()` | `book_id: int` | `Book` |
| `search_books()` | `query: str, filters: dict` | `list[Book]` |
| `lookup_isbn()` | `isbn: str` | `dict` |
| `get_availability()` | `book_id: int` | `int` |
| `update_copy_status()` | `copy_id: int, status: CopyStatus` | `BookCopy` |
| `add_copies()` | `book_id: int, count: int` | `list[BookCopy]` |

##### `CirculationService`

Issue/return transaction processing, deadline enforcement, overdue detection. Deadline options: 5/10/20/30 days set by librarian; fine = 0.5x price (damaged), 1.5x price (lost).

| Method | Parameters | Return Type |
|---|---|---|
| `issue_book()` | `member_id: int, book_copy_id: int, deadline_days: int` | `Transaction` |
| `return_book()` | `transaction_id: int, condition: ReturnCondition` | `Transaction` |
| `get_overdue_items()` | — | `list[Transaction]` |
| `get_member_current_issues()` | `member_id: int` | `list[Transaction]` |
| `calculate_fine()` | `book_price: float, condition: ReturnCondition` | `float` |
| `check_issue_eligibility()` | `member_id: int` | `dict` |

##### `ReservationService`

Waitlist queue management, reservation-return matching, notification triggering. FIFO queue; when a reserved book is returned, system alerts librarian and notifies queued member.

| Method | Parameters | Return Type |
|---|---|---|
| `place_reservation()` | `member_id: int, book_id: int` | `Reservation` |
| `cancel_reservation()` | `reservation_id: int` | `None` |
| `check_reservations_on_return()` | `book_id: int` | `Reservation` (nullable) |
| `get_member_reservations()` | `member_id: int` | `list[Reservation]` |
| `get_reservation_alerts()` | — | `list[Reservation]` |
| `get_queue_position()` | `reservation_id: int` | `int` |

##### `PurchaseRequestService`

Request submission, upvote counting, purchase fulfillment tracking. Ranked by upvote count; marked as "Purchased" by librarian.

| Method | Parameters | Return Type |
|---|---|---|
| `submit_request()` | `member_id: int, title: str, author: str, description: str` | `PurchaseRequest` |
| `upvote_request()` | `request_id: int, member_id: int` | `PurchaseRequest` |
| `get_ranked_requests()` | — | `list[PurchaseRequest]` |
| `mark_as_purchased()` | `request_id: int` | `PurchaseRequest` |

##### `ReviewService`

Review submission, moderation workflow, rating aggregation. Librarian approves before public display.

| Method | Parameters | Return Type |
|---|---|---|
| `submit_review()` | `member_id: int, book_id: int, rating: int, text: str` | `Review` |
| `get_book_reviews()` | `book_id: int` | `list[Review]` |
| `moderate_review()` | `review_id: int, approved: bool` | `Review` |
| `get_pending_reviews()` | — | `list[Review]` |

##### `ReadingListService`

CRUD for themed collections, book-list associations. Displayed on member dashboards.

| Method | Parameters | Return Type |
|---|---|---|
| `create_list()` | `title: str, description: str` | `ReadingList` |
| `update_list()` | `list_id: int, data: dict` | `ReadingList` |
| `delete_list()` | `list_id: int` | `None` |
| `add_book_to_list()` | `list_id: int, book_id: int` | `ReadingListBook` |
| `remove_book_from_list()` | `list_id: int, book_id: int` | `None` |
| `get_all_lists()` | — | `list[ReadingList]` |

##### `SubscriptionService`

Subscription CRUD, monthly cost calculation. Cost = copies × price × frequency multiplier (daily≈26, weekly≈4, bi-weekly≈2, monthly=1).

| Method | Parameters | Return Type |
|---|---|---|
| `add_subscription()` | `data: dict` | `Subscription` |
| `update_subscription()` | `sub_id: int, data: dict` | `Subscription` |
| `cancel_subscription()` | `sub_id: int` | `None` |
| `get_all_subscriptions()` | — | `list[Subscription]` |
| `calculate_monthly_total()` | — | `float` |

##### `BudgetService`

Purchase entry, running total calculation, expense data generation. Monthly cap of ₹10,000; itemized breakdown by category and vendor. Generates the raw expense data that `ReportService` formats for viewing and download.

| Method | Parameters | Return Type |
|---|---|---|
| `add_purchase_entry()` | `title: str, copies: int, price: float, vendor: str` | `BookPurchaseEntry` |
| `get_monthly_summary()` | `month: int, year: int` | `dict` |
| `get_budget_utilization()` | `month: int, year: int` | `float` |
| `generate_expense_report()` | `month: int, year: int` | `dict` |

##### `RecommendationService`

Genre/author preference analysis, suggestion generation. Based on borrowing history; excludes already-read books.

| Method | Parameters | Return Type |
|---|---|---|
| `get_recommendations()` | `member_id: int` | `list[Book]` |
| `analyze_reading_preferences()` | `member_id: int` | `dict` |

##### `ReportService`

Usage metrics aggregation, report formatting, downloadable exports. Active members, books per month, popular categories. Calls `BudgetService` internally for expense report data.

| Method | Parameters | Return Type |
|---|---|---|
| `get_usage_report()` | — | `dict` |
| `get_expense_report()` | `month: int, year: int` | `dict` |
| `download_report()` | `report_type: str, format: str` | `bytes` |

##### `NotificationService`

Email and web push notification dispatch, notification history. Triggered by: overdue items, reservation availability, registration approval/rejection, billing renewal.

| Method | Parameters | Return Type |
|---|---|---|
| `send_overdue_reminders()` | — | `None` |
| `notify_reservation_available()` | `member_id: int, book_id: int` | `Notification` |
| `notify_registration_status()` | `member_id: int, approved: bool` | `Notification` |
| `notify_billing_renewal()` | `member_id: int` | `Notification` |
| `send_email()` | `recipient: str, subject: str, body: str` | `None` |
| `get_member_notifications()` | `member_id: int` | `list[Notification]` |
| `mark_as_read()` | `notification_id: int` | `Notification` |

##### `PaymentService`

Payment processing, fine settlement, membership renewal, payment history. Annual ₹100 fee for off-campus; fine payments.

| Method | Parameters | Return Type |
|---|---|---|
| `process_payment()` | `member_id: int, amount: float, type: PaymentType, fine_id: int` | `Payment` |
| `get_payment_history()` | `member_id: int` | `list[Payment]` |
| `check_outstanding_dues()` | `member_id: int` | `float` |
| `process_membership_renewal()` | `member_id: int` | `Payment` |

---

#### Cross-Cutting Components

| Component | Responsibility |
|---|---|
| `AuthMiddleware` | Validates JWT tokens from HTTP `Authorization` headers; maintains an in-memory blocklist for invalidated tokens |
| `RBACMiddleware` | Checks user role against endpoint permissions; blocks unauthorized access |
| `ExternalISBNClient` | HTTP client to query an external ISBN database for book metadata auto-fill |
| `EmailClient` | Sends transactional emails (overdue reminders, approval notifications, reservation alerts) |
| `DatabaseConnection` | SQLModel/SQLAlchemy engine and session management |

---

#### Service-to-Service Dependencies

These show which service depends on (calls into) another service.

| Service | Depends on |
|---|---|
| `CirculationService` | `CatalogService`, `MemberService`, `ReservationService`, `NotificationService` |
| `ReservationService` | `NotificationService` |
| `BudgetService` | `SubscriptionService` |
| `ReportService` | `BudgetService` |
| `CatalogService` | `ExternalISBNClient` |
| `NotificationService` | `EmailClient` |
| `PaymentService` | `MemberService` |

---

#### Service-to-Model Dependencies

Each service operates on specific data model classes:

| Service | Operates on |
|---|---|
| `AuthService` | `User` |
| `MemberService` | `User` |
| `CatalogService` | `Book`, `BookCopy`, `Magazine` |
| `CirculationService` | `Transaction`, `Fine`, `BookCopy` |
| `ReservationService` | `Reservation` |
| `PurchaseRequestService` | `PurchaseRequest`, `PurchaseRequestVote` |
| `ReviewService` | `Review` |
| `ReadingListService` | `ReadingList`, `ReadingListBook` |
| `SubscriptionService` | `Subscription` |
| `BudgetService` | `BookPurchaseEntry`, `Subscription` |
| `RecommendationService` | `Transaction`, `Book` |
| `ReportService` | `Transaction`, `User`, `BookPurchaseEntry`, `Subscription` |
| `NotificationService` | `Notification` |
| `PaymentService` | `Payment`, `Fine` |


### 1.3 Database Components



The database layer stores all persistent data. Each data model maps to a database table via SQLModel. This document defines all enumerations and data model classes with their complete attributes, types, and constraints - serving as the specification for both the class diagram and the ER diagram.

---

#### Enumerations

These are `enum` types used as attribute types across data model classes.

##### `UserRole`

| Value | Description |
|---|---|
| `LIBRARIAN` | Library administrator |
| `MEMBER` | Student (on-campus or off-campus) |
| `CAMPUS_MANAGEMENT` | Campus management staff |

##### `MembershipType`

| Value | Description |
|---|---|
| `ON_CAMPUS` | RVK campus student (no annual fee) |
| `OFF_CAMPUS` | External community member (₹100 annual fee) |

##### `MemberApprovalStatus`

| Value | Description |
|---|---|
| `PENDING` | Registration submitted, awaiting librarian review |
| `APPROVED` | Librarian has approved the registration |
| `REJECTED` | Librarian has rejected the registration |

##### `CopyStatus`

| Value | Description |
|---|---|
| `AVAILABLE` | On the shelf, ready to be issued |
| `ISSUED` | Currently issued to a member |
| `LOST` | Declared lost |
| `DAMAGED` | Marked as damaged |

##### `ReturnCondition`

| Value | Description |
|---|---|
| `GOOD` | Returned in acceptable condition |
| `DAMAGED` | Returned in damaged condition (0.5x price fine) |
| `LOST` | Declared lost by the member (1.5x price fine) |

##### `ReservationStatus`

| Value | Description |
|---|---|
| `WAITING` | In queue, waiting for the book to become available |
| `NOTIFIED` | Book is available, member has been notified to collect |
| `FULFILLED` | Member collected the reserved book |
| `CANCELLED` | Member cancelled their reservation |

##### `RequestStatus`

| Value | Description |
|---|---|
| `PENDING` | Request is open, accumulating upvotes |
| `PURCHASED` | Librarian has purchased the book |

##### `ReviewStatus`

| Value | Description |
|---|---|
| `PENDING` | Submitted, awaiting librarian moderation |
| `APPROVED` | Librarian has approved for public display |
| `REJECTED` | Librarian has rejected the review |

##### `SubscriptionFrequency`

| Value | Description |
|---|---|
| `DAILY` | Delivered every day (newspapers) |
| `WEEKLY` | Delivered once a week |
| `BIWEEKLY` | Delivered every two weeks |
| `MONTHLY` | Delivered once a month |

##### `SubscriptionType`

| Value | Description |
|---|---|
| `NEWSPAPER` | Newspaper subscription |
| `MAGAZINE` | Magazine subscription |

##### `PaymentType`

| Value | Description |
|---|---|
| `MEMBERSHIP_FEE` | Annual ₹100 off-campus membership renewal |
| `FINE_PAYMENT` | Settlement of a fine for damaged/lost book |

##### `NotificationType`

| Value | Description |
|---|---|
| `OVERDUE_REMINDER` | Reminder for overdue book |
| `RESERVATION_AVAILABLE` | Reserved book is now available for collection |
| `REGISTRATION_APPROVED` | Member registration approved by librarian |
| `REGISTRATION_REJECTED` | Member registration rejected by librarian |
| `BILLING_RENEWAL` | Off-campus membership renewal is due |

---

#### Data Models

Each data model class maps to a database table via SQLModel. Attributes are listed with their types. Methods on data models are limited to computed properties and simple helpers - all real business logic lives in service classes ([1.3_Backend Components](1.3_backend-components.md)).

##### `User`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Authentication, Membership |
| `email` | `str` (unique) | |
| `password_hash` | `str` | |
| `name` | `str` | |
| `phone` | `str` (nullable) | |
| `role` | `UserRole` | |
| `membership_type` | `MembershipType` (nullable, only for members) | |
| `approval_status` | `MemberApprovalStatus` | |
| `is_active` | `bool` | |
| `membership_start_date` | `date` (nullable) | |
| `max_issue_limit` | `int` | |
| `created_at` | `datetime` | |
| `updated_at` | `datetime` | |

| Method | Return Type | Description |
|---|---|---|
| `is_membership_due()` | `bool` | Checks if off-campus member's 1-year billing cycle has expired |

---

##### `Book`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Catalog & Inventory |
| `title` | `str` | |
| `author` | `str` | |
| `isbn` | `str` (nullable, unique) | |
| `category` | `str` | |
| `price` | `float` | |
| `description` | `str` (nullable) | |
| `created_at` | `datetime` | |
| `updated_at` | `datetime` | |

| Method | Return Type | Description |
|---|---|---|
| `available_copies()` | `int` | Count of copies with status `AVAILABLE` |
| `average_rating()` | `float` | Mean rating from approved reviews |

---

##### `BookCopy`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Catalog & Inventory |
| `book_id` | `int` (FK → Book) | |
| `copy_number` | `int` | |
| `status` | `CopyStatus` | |

---

##### `Magazine`

Stores magazine-specific metadata for books that represent magazine issues. A magazine issue is modeled as a `Book` for circulation purposes - this model adds the additional context.

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Catalog & Inventory |
| `book_id` | `int` (FK → Book, unique) | |
| `subscription_id` | `int` (FK → Subscription, nullable) | Budget & Subscription |
| `issue_number` | `str` (nullable) | |
| `issue_date` | `date` (nullable) | |

---

##### `Transaction`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Circulation |
| `member_id` | `int` (FK → User) | |
| `book_copy_id` | `int` (FK → BookCopy) | |
| `issue_date` | `date` | |
| `due_date` | `date` | |
| `return_date` | `date` (nullable) | |
| `return_condition` | `ReturnCondition` (nullable) | |

| Method | Return Type | Description |
|---|---|---|
| `is_overdue()` | `bool` | Checks if current date exceeds `due_date` and book is not returned |
| `days_overdue()` | `int` | Number of days past the due date |

---

##### `Fine`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Circulation, Membership |
| `transaction_id` | `int` (FK → Transaction, unique) | |
| `member_id` | `int` (FK → User) | |
| `amount` | `float` | |
| `reason` | `ReturnCondition` (DAMAGED or LOST) | |
| `is_paid` | `bool` | |
| `created_at` | `datetime` | |

---

##### `Reservation`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Reservation & Request |
| `member_id` | `int` (FK → User) | |
| `book_id` | `int` (FK → Book) | |
| `queue_position` | `int` | |
| `status` | `ReservationStatus` | |
| `created_at` | `datetime` | |
| `notified_at` | `datetime` (nullable) | |
| `fulfilled_at` | `datetime` (nullable) | |

---

##### `PurchaseRequest`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Reservation & Request |
| `member_id` | `int` (FK → User) | |
| `title` | `str` | |
| `author` | `str` (nullable) | |
| `description` | `str` (nullable) | |
| `upvote_count` | `int` | |
| `status` | `RequestStatus` | |
| `created_at` | `datetime` | |
| `purchased_at` | `datetime` (nullable) | |

---

##### `PurchaseRequestVote`

Unique constraint on (`request_id`, `member_id`) to prevent double-voting.

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Reservation & Request |
| `request_id` | `int` (FK → PurchaseRequest) | |
| `member_id` | `int` (FK → User) | |
| `created_at` | `datetime` | |

---

##### `Review`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Community & Curation |
| `member_id` | `int` (FK → User) | |
| `book_id` | `int` (FK → Book) | |
| `rating` | `int` (1-5) | |
| `text` | `str` | |
| `status` | `ReviewStatus` | |
| `created_at` | `datetime` | |
| `updated_at` | `datetime` (nullable) | |

---

##### `ReadingList`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Community & Curation |
| `title` | `str` | |
| `description` | `str` (nullable) | |
| `created_at` | `datetime` | |

---

##### `ReadingListBook`

Junction table for the many-to-many relationship between `ReadingList` and `Book`.

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Community & Curation |
| `reading_list_id` | `int` (FK → ReadingList) | |
| `book_id` | `int` (FK → Book) | |

---

##### `Subscription`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Budget & Subscription |
| `title` | `str` | |
| `type` | `SubscriptionType` | |
| `copies` | `int` | |
| `price_per_copy` | `float` | |
| `frequency` | `SubscriptionFrequency` | |
| `is_active` | `bool` | |
| `created_at` | `datetime` | |

| Method | Return Type | Description |
|---|---|---|
| `monthly_cost()` | `float` | `copies × price_per_copy × frequency_multiplier` (daily≈26, weekly≈4, biweekly≈2, monthly=1) |

---

##### `BookPurchaseEntry`

Tracks actual book purchases made by the librarian (for budget tracking, not to be confused with `PurchaseRequest` which is a member's wish).

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Budget & Subscription |
| `title` | `str` | |
| `copies` | `int` | |
| `price_per_copy` | `float` | |
| `vendor` | `str` | |
| `category` | `str` (nullable) | |
| `purchase_date` | `date` | |

| Method | Return Type | Description |
|---|---|---|
| `total_cost()` | `float` | `copies × price_per_copy` |

---

##### `Payment`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Membership |
| `member_id` | `int` (FK → User) | |
| `amount` | `float` | |
| `type` | `PaymentType` | |
| `fine_id` | `int` (FK → Fine, nullable) | |
| `created_at` | `datetime` | |

---

##### `Notification`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Cross-module |
| `recipient_id` | `int` (FK → User) | |
| `type` | `NotificationType` | |
| `message` | `str` | |
| `is_read` | `bool` | |
| `created_at` | `datetime` | |

---

#### Model-to-Model Relationships

These define how data models relate to each other in the class diagram and ER diagram.

| Relationship | Type | Cardinality | Notes |
|---|---|---|---|
| `User` ◆── `Transaction` | Composition | 1 User → * Transactions | A member's issue/return history |
| `User` ◆── `Fine` | Composition | 1 User → * Fines | A member's accumulated fines |
| `User` ◆── `Reservation` | Composition | 1 User → * Reservations | A member's active reservations |
| `User` ◆── `Review` | Composition | 1 User → * Reviews | A member's submitted reviews |
| `User` ◆── `PurchaseRequest` | Composition | 1 User → * PurchaseRequests | A member's book requests |
| `User` ◆── `PurchaseRequestVote` | Composition | 1 User → * PurchaseRequestVotes | A member's upvotes |
| `User` ◆── `Payment` | Composition | 1 User → * Payments | A member's payment records |
| `User` ◆── `Notification` | Composition | 1 User → * Notifications | A user's notifications |
| `Book` ◆── `BookCopy` | Composition | 1 Book → * BookCopies | Physical copies of a book |
| `Book` ◆── `Review` | Composition | 1 Book → * Reviews | Reviews for a book |
| `Book` ── `Magazine` | Association | 1 Book → 0..1 Magazine | Magazine metadata for a book that represents a magazine issue |
| `Book` ── `Reservation` | Association | 1 Book → * Reservations | Waitlist entries for a book |
| `BookCopy` ── `Transaction` | Association | 1 BookCopy → * Transactions | Issue history of a specific copy |
| `Transaction` ── `Fine` | Association | 1 Transaction → 0..1 Fine | Fine generated on a damaged/lost return |
| `PurchaseRequest` ◆── `PurchaseRequestVote` | Composition | 1 PurchaseRequest → * Votes | Upvotes on a request |
| `ReadingList` ◆── `ReadingListBook` | Composition | 1 ReadingList → * ReadingListBooks | Books in a reading list |
| `Book` ── `ReadingListBook` | Association | 1 Book → * ReadingListBooks | Reading lists containing a book |
| `Fine` ── `Payment` | Association | 1 Fine → 0..1 Payment | Payment that settles a fine |
| `Subscription` ── `Magazine` | Association | 1 Subscription → * Magazines | Magazine issues belonging to a subscription |


### 1.4 Inter-Component Flow



#### How Components Interact (Inter-Component Flow)

This document traces 10 representative workflows across the three tiers (Frontend → Backend → Database) of the Library Management System. Together, these workflows touch all 9 functional modules and the cross-cutting notification concern, demonstrating how the components defined in the sub-documents connect end-to-end.

| #   | Workflow                                             | Module(s) Covered                                               |
| --- | ---------------------------------------------------- | --------------------------------------------------------------- |
| 1   | Member Issues a Book                                 | Circulation                                                     |
| 2   | Book is Returned with Active Reservation             | Circulation, Reservation & Request, Notifications               |
| 3   | Member Self-Registration, Approval & Fee Payment     | Authentication & Identity, Membership Management, Notifications |
| 4   | Member Places a Reservation on an Unavailable Book   | Reservation & Request                                           |
| 5   | Overdue Detection & Automated Reminder Notifications | Circulation, Notifications                                      |
| 6   | Librarian Adds a Book via ISBN Barcode Scan          | Catalog & Inventory                                             |
| 7   | Member Purchase Request, Upvoting & Fulfillment      | Reservation & Request                                           |
| 8   | Subscription Management & Monthly Budget Tracking    | Budget & Subscription                                           |
| 9   | Review Submission, Moderation & Recommendations      | Community & Curation, Recommendations                           |
| 10  | Campus Management Reviews Usage & Expense Reports    | Reporting, Budget & Subscription                                |



## 2. UML Diagrams

### Class Diagram



#### What Is This Document?

This document explains what the class diagram for the Library Management System will contain and how to read it. The actual Mermaid `classDiagram` code will be generated from this specification along with the detailed definitions in [1.3_Backend Components](1.3_backend-components.md) and [1.4_Database Components](1.4_database-components.md).





##### UML Diagram Types (Reference)

| UML Diagram Type | What it shows | When to use |
|---|---|---|
| **Class Diagram** | Classes with attributes, methods, relationships | Data models, ORM entities, backend services |
| **Component Diagram** | High-level software components and their dependencies | System architecture overview |
| **Sequence Diagram** | Step-by-step message flow between actors/components | Specific workflows like "issue a book" |
| **ER Diagram** | Database tables, columns, relationships | Database design |

---

#### What the Class Diagram Shows

A UML class diagram visualizes the system's classes, their internal structure (attributes and methods), and the relationships between them. For our system, the class diagram covers three categories of classes:

##### 1. Data Model Classes

These are the ORM entities that map to database tables. Each class shows its attributes (with types and constraints) and any computed property methods. Defined in full in [1.4_Database Components](1.4_database-components.md).

Examples: `User`, `Book`, `BookCopy`, `Transaction`, `Fine`, `Reservation`, `Review`, `Payment`, `Notification`, `Magazine`.

##### 2. Service Classes

These encapsulate business logic. Each class shows its methods (with parameters and return types). Services contain no persistent state - they receive dependencies and operate on data model classes. Defined in full in [1.3_Backend Components](1.3_backend-components.md).

Examples: `AuthService`, `MemberService`, `CatalogService`, `CirculationService`, `ReservationService`, `PaymentService`, `NotificationService`.

##### 3. Enumerations

These are `enum` types used as attribute types across data models. Each enum lists its possible values. Defined in full in [1.4_Database Components](1.4_database-components.md).

Examples: `UserRole`, `MembershipType`, `CopyStatus`, `ReturnCondition`, `MemberApprovalStatus`, `ReviewStatus`.

---

#### Relationship Types

The class diagram uses four types of connections:

| Arrow Type | UML Term | Meaning | Example |
|---|---|---|---|
| Solid line with filled diamond | **Composition** | "Owns and cannot exist without" | Book ◆── BookCopy (copies don't exist without a book) |
| Solid line | **Association** | "References / links to" | Transaction ── User (a transaction references a member) |
| Dashed line | **Dependency** | "Uses / calls" | CirculationService ╌╌ CatalogService |
| Hollow triangle arrow | **Realization** | "Enum used as type" | User ──▷ UserRole |

##### Where Relationships Are Defined

- **Model-to-model** relationships (compositions and associations with cardinality) are defined in [1.4_Database Components](1.4_database-components.md).
- **Service-to-service** dependencies (which service calls which) are defined in [1.3_Backend Components](1.3_backend-components.md).
- **Service-to-model** dependencies (which service operates on which models) are defined in [1.3_Backend Components](1.3_backend-components.md).
- **Enum realizations** (which model uses which enum as an attribute type) are implicit from the attribute type definitions in [1.4_Database Components](1.4_database-components.md).

---

#### How to Read the Diagram

1. **Data models** appear as class boxes with attributes in the top section and methods in the bottom section. Attributes show their type and constraints (PK, FK, nullable, unique).
2. **Services** appear as class boxes with only methods listed (they have no persistent attributes).
3. **Enumerations** appear as class boxes stereotyped with `<<enumeration>>`, listing their possible values.
4. **Solid lines between models** show data relationships - read the cardinality labels (1, *, 0..1) to understand how many instances relate.
5. **Dashed lines between services** show runtime dependencies - which service calls into another.
6. **Dashed lines from services to models** show which data a service reads and writes.


![Class Diagram](deliverables/LMS%20-%20UML%20Class%20Diagram-2026-07-23-174603.png)

### Database Design (ER) Diagram



#### What Is This Document?

This document explains what the Entity-Relationship diagram for the Library Management System will contain and how to read it. The actual Mermaid `erDiagram` code will be generated from this specification along with the detailed definitions in [1.4_Database Components](1.4_database-components.md).





---

#### What the ER Diagram Shows

An ER diagram visualizes the database schema - the tables, their columns, and how they relate to each other. Unlike the class diagram (which also includes services and enums), the ER diagram focuses exclusively on persistent data storage.

##### Entities

Each data model from [1.4_Database Components](1.4_database-components.md) maps to a database entity (table) in the ER diagram. The entity shows:

- **Table name** (derived from the model class name)
- **Columns** with their data types (int, str, float, date, datetime, bool)
- **Constraints** - primary keys (PK), foreign keys (FK), unique, nullable

The full list of entities: `User`, `Book`, `BookCopy`, `Transaction`, `Fine`, `Reservation`, `PurchaseRequest`, `PurchaseRequestVote`, `Review`, `ReadingList`, `ReadingListBook`, `Subscription`, `BookPurchaseEntry`, `Payment`, `Notification`, `Magazine`.

##### Relationships

Model-to-model relationships from [1.4_Database Components](1.4_database-components.md) translate directly into ER relationships. Each relationship shows:

- **Cardinality** - one-to-one (1:1), one-to-many (1:N), or many-to-many (N:M)
- **Foreign key direction** - which table holds the FK reference

For example:
- `User` 1──* `Transaction` means one user has many transactions, with `Transaction.member_id` as the FK.
- `ReadingList` *──* `Book` is a many-to-many relationship resolved through the `ReadingListBook` junction table.

##### Enumerations in the ER Diagram

Enumerations can be represented either as separate entities or simply as column types within their parent entity. In the generated diagram, they are explicitly shown as separate entities for clarity. For example, the `UserRole` enumeration acts as the type for the `role` column in the `User` table, indicating it is constrained to specific values (`LIBRARIAN`, `MEMBER`, `CAMPUS_MANAGEMENT`). Both representations are perfectly valid.

---

#### How to Read the Diagram

1. **Boxes** represent database tables. Column names, types, and constraints are listed inside.
2. **Lines between boxes** represent foreign key relationships. Follow the line from the FK column to the referenced table's PK.
3. **Cardinality markers** at each end of a line show how many rows participate: `||` (exactly one), `o|` (zero or one), `}|` (one or more), `}o` (zero or more).
4. **Junction tables** (like `ReadingListBook` and `PurchaseRequestVote`) resolve many-to-many relationships - they have FKs pointing to both parent tables.


![ER Diagram](deliverables/LMS%20-%20ER%20Diagram-2026-07-23-174609.png)

## 3. Project Schedules

### Project Sprint Schedule

#### Milestone 2: UI Implementation Phase
**Target Date:** 23rd July 2026
*The goal for this milestone was to implement the majority of the frontend (FE) pages, utilizing Mock Service Worker (MSW) to simulate API interactions without a real backend.*

**Sprint Goal:** Complete the frontend scaffold, routing, and core page layouts.

**Tasks Completed (Exhaustive Frontend Implementation):**

- **Core Application & Setup:**
  - `App.jsx`, `main.jsx`, `index.css`
  - Automated test setup (`test-setup.js`)

- **Layouts:**
  - `AppLayout.jsx`
  - `AuthLayout.jsx`
  - `DashboardLayout.jsx`

- **Global Custom Components:**
  - `Header.jsx`
  - `Sidebar.jsx`
  - `FormSelect.jsx`

- **UI Component Library (shadcn/ui-based):**
  - `alert-dialog.jsx`, `badge.jsx`, `button.jsx`, `card.jsx`, `dialog.jsx`
  - `dropdown-menu.jsx`, `input.jsx`, `label.jsx`, `select.jsx`, `sheet.jsx`
  - `skeleton.jsx`, `sonner.jsx`, `table.jsx`, `tooltip.jsx`

- **Frontend Pages:**
  - **Authentication:** `LoginPage.jsx`, `RegisterPage.jsx`, `PendingApprovalPage.jsx`
  - **Member Portal:** `MemberDashboard.jsx`, `MemberCatalogPage.jsx`, `MemberProfilePage.jsx`
  - **Librarian Dashboard & Operations:** `LibrarianDashboard.jsx`, `IssueBookPage.jsx`, `ProcessReturnPage.jsx`, `BudgetTrackerPage.jsx`
  - **Librarian Catalog Management:** `CatalogPage.jsx`, `AddBookPage.jsx`, `EditBookPage.jsx`, `BookCopiesPage.jsx`
  - **Librarian Member Management:** `MembersPage.jsx`
  - **Campus Management:** `ManagementDashboard.jsx`, `ManagementReportsPage.jsx`
  - **General:** `HomePage.jsx`

- **State Management (Stores):**
  - `authStore.js`, `catalogStore.js`, `dashboardStore.js`, `memberStore.js`, `reportsStore.js`, `transactionStore.js`

- **API Layer & Utilities:**
  - Centralized API caller (`api.js`)
  - Helper functions (`utils.js`)

- **Mocking Strategy (MSW):**
  - Service worker setup (`browser.js`, `server.js`)
  - **Mock Data Sets:** Books, Dashboard Data, Members, Notifications, Reports, Transactions, Users.
  - **Mock Handlers:** Auth, Catalog, Dashboard, Member, Notification, Reports, Transaction endpoints.

- **Automated Testing Suite (Vitest/RTL):**
  - Component and API unit tests (`App.test.jsx`, `api.test.js`)
  - Page level tests for: `HomePage`, `LoginPage`, `RegisterPage`, `LibrarianDashboard`, `AddBookPage`, `BookCopiesPage`, `CatalogPage`, `ManagementDashboard`, `ManagementReportsPage`, `MemberCatalogPage`.

---

#### Milestone 3 (Sprint 1): Backend API Development & Integration
**Target Date:** 2nd August 2026

**Sprint Goal:** Design and develop the foundational REST API endpoints, connect the database, and replace the MSW mocks for the core workflows. Gather primary user feedback.

**Planned Tasks:**
- Setup backend framework (Flask/FastAPI) and database schema (SQLite/PostgreSQL).
- Implement User Authentication & Role-Based Access Control (RBAC) APIs.
- Implement core Catalog Management CRUD APIs (Books, Categories, Inventory).
- Implement Member Profile and basic Dashboard APIs.
- Integrate frontend `LoginPage`, `RegisterPage`, and `MemberCatalogPage` with real endpoints.
- Generate Swagger/OpenAPI documentation for Sprint 1 APIs.
- Write Pytest unit tests for Sprint 1 endpoints.
- Conduct user feedback session on the integrated core workflows.

---

#### Milestone 4 (Sprint 2): Advanced Features & Final API Polish
**Target Date:** 12th August 2026

**Sprint Goal:** Implement the remaining advanced backend features, handle feedback from Milestone 3, and ensure 100% test coverage.

**Planned Tasks:**
- Implement Book Issue, Return, and Fine Calculation APIs.
- Implement advanced Book Search & Filtering APIs.
- Implement Notification, Reservation, and Purchase Request APIs.
- Implement Budget Tracking and Reporting APIs.
- Integrate the remaining frontend pages (`LibrarianDashboard`, `IssueBookPage`, `ProcessReturnPage`, `BudgetTrackerPage`) with real endpoints.
- Address and integrate any UI/UX or logic changes requested from the Sprint 1 user feedback.
- Finalize all Swagger API documentation.
- Complete backend test suite (Pytest).

---

#### Milestone 5: Final Submission & Handoff
**Target Date:** 23rd August 2026

**Sprint Goal:** Comprehensive end-to-end validation, final polish, and project compilation.

**Planned Tasks:**
- Cross-module consistency fixes (ensuring returns, payments, reviews, and reservations all sync correctly).
- Finalize all UI empty states, loading indicators, and error handling.
- Full end-to-end walkthrough of all user stories.
- Record final video presentation / demo.
- Prepare the final slide presentation focusing on user stories and identification.
- Compile the complete source code, updated `README.md`, and the final comprehensive report.


### Scrum Meetings Schedule and Minutes Summary

#### Past Meetings (Milestone 2)

During Milestone 2, the team held regular meetings to plan and execute the design artifacts and frontend implementation. All detailed minutes are located in the `minutes-of-meetings` folder.

| Date | Time | Core Focus / Agenda |
| :--- | :--- | :--- |
| **02 July 2026** | 09:00 PM | Initial Milestone 2 Kickoff & Roles Assignment |
| **03 July 2026** | 09:00 PM | Frontend Architecture & Mocking Strategy |
| **04 July 2026** | 09:00 PM | Component Design & Wireframing |
| **06 July 2026** | 09:00 PM | Database Schema & ER Diagram Discussion |
| **07 July 2026** | 09:00 PM | UML Class Diagram Finalization |
| **08 July 2026** | 09:00 PM | Review of Design Diagrams |
| **09 July 2026** | 09:00 PM | Milestone 2 Report Formatting & Compilation |
| **10 July 2026** | 09:00 PM | Transition to UI Development & Kanban Setup |
| **14 July 2026** | 09:00 PM | UI Progress (Auth, Member Pages) & MSW Integration |
| **17 July 2026** | 09:00 PM | Librarian Features & Scope Refinement |
| **20 July 2026** | 09:00 PM | Final UI Review & Submission Prep |

---

#### Future Meetings Roadmap (Milestones 3, 4, 5)

This is a rough roadmap of future meetings to coordinate the backend API development, integration, and final polishing of the product. 

| Target Date | Phase | Proposed Agenda / Discussion Topics |
| :--- | :--- | :--- |
| **24 July 2026** | Milestone 3 Planning | - Sprint 1 Kickoff<br>- Define API models and database setup<br>- Assign backend routes (Auth, Catalog) |
| **28 July 2026** | Backend Sync | - Review database connectivity<br>- Test initial Swagger endpoints<br>- Plan frontend integration for Auth |
| **01 Aug 2026** | Milestone 3 Review | - Ensure Sprint 1 deliverables are ready<br>- Prepare user feedback session |
| **05 Aug 2026** | Milestone 4 Planning | - Sprint 2 Kickoff<br>- Review user feedback from MS3<br>- Assign advanced APIs (Reservations, Fines, Budget) |
| **09 Aug 2026** | Integration Sync | - Replace MSW with real APIs for advanced features<br>- Address CORS or deployment issues |
| **13 Aug 2026** | Milestone 4 Review | - API finalization and test case review<br>- UI stability check |
| **17 Aug 2026** | Final Polish | - Cross-module consistency checks<br>- Ensure all edge cases and empty states work |
| **21 Aug 2026** | Presentation Prep | - Record video demo<br>- Review final report PDF<br>- Final submission readiness check |


## 4. Deliverable Screenshots

### GitHub Project Management

![Gantt Chart - SE Project Dashboard](github-screenshots/Gantt-Chart-%C2%B7-SE-Project-Dashboard-07-23-2026_10_47_PM.png)
*The Gantt Chart illustrating the timeline and scheduled phases for the Software Engineering Project.*

![Kanban Board - SE Project Dashboard](github-screenshots/Kanban-Board-%C2%B7-SE-Project-Dashboard-07-23-2026_10_48_PM.png)
*The Kanban Board used to track the progress of individual tasks across different sprint columns (To Do, In Progress, Done).*

![Table View - SE Project Dashboard](github-screenshots/Table-View-%C2%B7-SE-Project-Dashboard-07-23-2026_10_48_PM.png)
*The Table View providing a detailed, sortable list of all project issues along with their assignees, statuses, and linked milestones.*

![Issues - MAY2026-Team-052 Repository](github-screenshots/Issues-%C2%B7-k26rahul-MAY2026-Team-052-07-23-2026_10_50_PM.png)
*The GitHub Issues page showing the backlog of all reported bugs, user stories, and tasks for the repository.*

![Pull Requests - MAY2026-Team-052 Repository](github-screenshots/Pull-requests-%C2%B7-k26rahul-MAY2026-Team-052-07-23-2026_10_49_PM.png)
*The Pull Requests page displaying active and merged code contributions from team members undergoing code review.*

### Frontend Implementation

#### 1. Landing Page
![Landing Page (Hero Section)](frontend-screenshots/landing-page.png)

![Landing Page (Features/About)](frontend-screenshots/landing-page-2.png)

![Landing Page (Testimonials/Stats)](frontend-screenshots/landing-page-3.png)

![Landing Page (Footer/Call to Action)](frontend-screenshots/landing-page-4.png)

#### 2. Authentication
![Login Page](frontend-screenshots/login-page.png)

![Registration Page](frontend-screenshots/registration-page.png)

#### 3. Member Portal
![Member Dashboard](frontend-screenshots/http-localhost-5173-member.png)

![Member Profile](frontend-screenshots/http-localhost-5173-member-profile.png)

![Member Catalog Search](frontend-screenshots/http-localhost-5173-member-catalog.png)

![Member Catalog Book Details](frontend-screenshots/http-localhost-5173-member-catalog-2.png)

#### 4. Librarian Dashboard & Management
![Librarian Dashboard Overview](frontend-screenshots/http-localhost-5173-librarian.png)

![Librarian Member Management](frontend-screenshots/http-localhost-5173-librarian-members.png)

![Librarian Member Details](frontend-screenshots/http-localhost-5173-librarian-members-2.png)

![Librarian Catalog View](frontend-screenshots/http-localhost-5173-librarian-catalog.png)

![Librarian Add/Edit Book](frontend-screenshots/http-localhost-5173-librarian-catalog-add.png)

![Librarian Issue Book](frontend-screenshots/http-localhost-5173-librarian-issue.png)

![Librarian Issue Book Details](frontend-screenshots/http-localhost-5173-librarian-issue-2.png)

![Librarian Return Book Processing](frontend-screenshots/http-localhost-5173-librarian-return.png)

![Librarian Budget Tracker](frontend-screenshots/http-localhost-5173-librarian-budget.png)

![Librarian Purchase Entry](frontend-screenshots/http-localhost-5173-librarian-budget-2.png)

#### 5. Campus Management
![Management Dashboard](frontend-screenshots/http-localhost-5173-management.png)

![Management Usage Reports](frontend-screenshots/http-localhost-5173-management-reports.png)

![Management Executive Reports](frontend-screenshots/http-localhost-5173-management-reports-tab-executive.png)
