# System Design - Library Management System

## What Is This Document?

This document covers the complete system design for the Library Management System. It serves as the planning and specification for all three Milestone 2 design deliverables:

| # | Deliverable | Covered in | What remains |
|---|---|---|---|
| 1 | **Design of Components** | Parts 2-7 | Done |
| 2 | **Class Diagram** | Parts 4, 5 (classes, attributes, methods) + Part 8 (relationships) | Generate Mermaid `classDiagram` |
| 3 | **Database Design (ER Diagram)** | Part 5 (all data models with attributes, types, constraints) | Generate Mermaid `erDiagram` |

---

## Part 1: Concepts and Deliverable Structure

### Modules vs. Components

The [requirements-analysis.md](../milestone-1/deliverables/5_requirements-analysis.md) identifies 9 **functional modules** - these are groups of related *business capabilities* (e.g., "Circulation Module" handles issue/return/fines). They describe *what* the system does.

**Components** describe *how* the system is built. A component is a self-contained piece of software with a defined interface. The Design of Components breaks down the system into the actual software pieces that will be coded, deployed, and connected.

| Concept | What it answers | Example |
|---|---|---|
| Module | "What business capability?" | Circulation Module |
| Component | "What software piece implements it?" | `CirculationService` (backend), `IssuePage` (frontend), `Transaction` model (database) |

The 9 modules decompose into many components across three layers: **Frontend**, **Backend**, and **Database**.

### UML Diagram Types (Reference)

| UML Diagram Type | What it shows | When to use |
|---|---|---|
| **Class Diagram** | Classes with attributes, methods, relationships | Data models, ORM entities, backend services |
| **Component Diagram** | High-level software components and their dependencies | System architecture overview |
| **Sequence Diagram** | Step-by-step message flow between actors/components | Specific workflows like "issue a book" |
| **ER Diagram** | Database tables, columns, relationships | Database design |

---

## Part 2: The System Architecture

Our Library Management System follows a **three-tier architecture**:

```
┌─────────────────────────────────────┐
│           FRONTEND (React)          │  ← What the user sees and interacts with
├─────────────────────────────────────┤
│          BACKEND (FastAPI)          │  ← Business logic, API endpoints, services
├─────────────────────────────────────┤
│       DATABASE (SQLite/PostgreSQL)  │  ← Persistent data storage
└─────────────────────────────────────┘
```

Each tier is decomposed into components. Below is the complete breakdown.

---

## Part 3: Frontend Components

The frontend is a React application. Its components are organized as **Pages** (full screens a user navigates to) and **Shared UI Components** (reusable pieces used across pages).

### 3.1 Pages (Organized by User Role)

#### Common / Unauthenticated Pages

| Page Component | Purpose | Maps to Module |
|---|---|---|
| `LoginPage` | Secure login form for all user roles | Authentication & Identity |
| `RegistrationPage` | Self-registration form for new student members | Authentication & Identity |

#### Librarian Dashboard Pages

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

#### Member Dashboard Pages

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

#### Campus Management Dashboard Pages

| Page Component | Purpose | Maps to Module |
|---|---|---|
| `ManagementDashboard` | Landing page - summary of library metrics | Reporting |
| `UsageReportsPage` | View and download library usage reports (active members, books issued, popular categories) | Reporting |
| `ExpenseReportPage` | View and download month-end itemized expense breakdown; approve reimbursement | Budget & Subscription, Reporting |

### 3.2 Shared UI Components

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

---

## Part 4: Backend Components

The backend is a FastAPI application. Its components are organized as **API Routers** (groups of related endpoints), **Services** (business logic), and **Cross-Cutting Concerns** (auth, notifications, etc.).

### 4.1 API Routers

Each router is a FastAPI router that exposes a group of REST endpoints.

| Router | Key Endpoints | Maps to Module |
|---|---|---|
| `auth_router` | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me` | Authentication & Identity |
| `members_router` | `GET /members`, `GET /members/{id}`, `PATCH /members/{id}/approve`, `PATCH /members/{id}/reject`, `GET /members/{id}/history` | Membership Management |
| `catalog_router` | `GET /books`, `POST /books`, `PATCH /books/{id}`, `GET /books/{id}`, `POST /books/isbn-lookup`, `PATCH /books/{id}/copies/{copy_id}` | Catalog & Inventory |
| `circulation_router` | `POST /transactions/issue`, `POST /transactions/return`, `GET /transactions/overdue`, `GET /members/{id}/current-issues` | Circulation |
| `reservations_router` | `POST /reservations`, `DELETE /reservations/{id}`, `GET /reservations/alerts`, `GET /members/{id}/reservations` | Reservation & Request |
| `requests_router` | `GET /purchase-requests`, `POST /purchase-requests`, `POST /purchase-requests/{id}/upvote`, `PATCH /purchase-requests/{id}/purchased` | Reservation & Request |
| `reviews_router` | `POST /books/{id}/reviews`, `GET /books/{id}/reviews`, `PATCH /reviews/{id}/moderate` | Community & Curation |
| `reading_lists_router` | `GET /reading-lists`, `POST /reading-lists`, `PATCH /reading-lists/{id}`, `DELETE /reading-lists/{id}` | Community & Curation |
| `subscriptions_router` | `GET /subscriptions`, `POST /subscriptions`, `PATCH /subscriptions/{id}`, `DELETE /subscriptions/{id}` | Budget & Subscription |
| `budget_router` | `POST /budget/purchases`, `GET /budget/summary`, `GET /budget/expense-report` | Budget & Subscription |
| `recommendations_router` | `GET /members/{id}/recommendations` | Recommendations |
| `reports_router` | `GET /reports/usage`, `GET /reports/expense`, `GET /reports/download/{type}` | Reporting |
| `payments_router` | `POST /payments`, `GET /members/{id}/payments` | Membership Management |

### 4.2 Services (Business Logic Layer)

Services encapsulate business rules. Routers call services; services call the database. This separation keeps the API layer thin and the logic testable. Service classes contain no persistent state - they receive dependencies (database session, other services) and operate on data model classes.

#### `AuthService`

Login validation, session creation, password hashing, role resolution. Session cookie-based auth; role-based access control (Librarian, Member, Campus Management).

| Method | Parameters | Return Type |
|---|---|---|
| `login()` | `email: str, password: str` | `User` |
| `register()` | `name: str, email: str, password: str, membership_type: MembershipType` | `User` |
| `logout()` | `session_id: str` | `None` |
| `get_current_user()` | `session_id: str` | `User` |
| `hash_password()` | `password: str` | `str` |
| `verify_password()` | `password: str, hash: str` | `bool` |

#### `MemberService`

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

#### `CatalogService`

Book CRUD, ISBN lookup integration, copy-level tracking, availability calculation. Availability = total copies minus (issued + lost + damaged copies); ISBN auto-fill from external API.

| Method | Parameters | Return Type |
|---|---|---|
| `add_book()` | `book_data: dict` | `Book` |
| `update_book()` | `book_id: int, data: dict` | `Book` |
| `get_book()` | `book_id: int` | `Book` |
| `search_books()` | `query: str, filters: dict` | `list[Book]` |
| `lookup_isbn()` | `isbn: str` | `dict` |
| `get_availability()` | `book_id: int` | `int` |
| `update_copy_status()` | `copy_id: int, status: CopyStatus` | `BookCopy` |
| `add_copies()` | `book_id: int, count: int` | `list[BookCopy]` |

#### `CirculationService`

Issue/return transaction processing, deadline enforcement, overdue detection. Deadline options: 5/10/20/30 days set by librarian; fine = 0.5x price (damaged), 1.5x price (lost).

| Method | Parameters | Return Type |
|---|---|---|
| `issue_book()` | `member_id: int, book_copy_id: int, deadline_days: int` | `Transaction` |
| `return_book()` | `transaction_id: int, condition: ReturnCondition` | `Transaction` |
| `get_overdue_items()` | — | `list[Transaction]` |
| `get_member_current_issues()` | `member_id: int` | `list[Transaction]` |
| `calculate_fine()` | `book_price: float, condition: ReturnCondition` | `float` |

#### `ReservationService`

Waitlist queue management, reservation-return matching, notification triggering. FIFO queue; when a reserved book is returned, system alerts librarian and notifies queued member.

| Method | Parameters | Return Type |
|---|---|---|
| `place_reservation()` | `member_id: int, book_id: int` | `Reservation` |
| `cancel_reservation()` | `reservation_id: int` | `None` |
| `check_reservations_on_return()` | `book_id: int` | `Reservation` (nullable) |
| `get_member_reservations()` | `member_id: int` | `list[Reservation]` |
| `get_reservation_alerts()` | — | `list[Reservation]` |

#### `PurchaseRequestService`

Request submission, upvote counting, purchase fulfillment tracking. Ranked by upvote count; marked as "Purchased" by librarian.

| Method | Parameters | Return Type |
|---|---|---|
| `submit_request()` | `member_id: int, title: str, author: str, description: str` | `PurchaseRequest` |
| `upvote_request()` | `request_id: int, member_id: int` | `PurchaseRequest` |
| `get_ranked_requests()` | — | `list[PurchaseRequest]` |
| `mark_as_purchased()` | `request_id: int` | `PurchaseRequest` |

#### `ReviewService`

Review submission, moderation workflow, rating aggregation. Librarian approves before public display.

| Method | Parameters | Return Type |
|---|---|---|
| `submit_review()` | `member_id: int, book_id: int, rating: int, text: str` | `Review` |
| `get_book_reviews()` | `book_id: int` | `list[Review]` |
| `moderate_review()` | `review_id: int, approved: bool` | `Review` |
| `get_pending_reviews()` | — | `list[Review]` |

#### `ReadingListService`

CRUD for themed collections, book-list associations. Displayed on member dashboards.

| Method | Parameters | Return Type |
|---|---|---|
| `create_list()` | `title: str, description: str` | `ReadingList` |
| `update_list()` | `list_id: int, data: dict` | `ReadingList` |
| `delete_list()` | `list_id: int` | `None` |
| `add_book_to_list()` | `list_id: int, book_id: int` | `ReadingListBook` |
| `remove_book_from_list()` | `list_id: int, book_id: int` | `None` |
| `get_all_lists()` | — | `list[ReadingList]` |

#### `SubscriptionService`

Subscription CRUD, monthly cost calculation. Cost = copies × price × frequency multiplier (weekly=~4, bi-weekly=~2, monthly=1).

| Method | Parameters | Return Type |
|---|---|---|
| `add_subscription()` | `data: dict` | `Subscription` |
| `update_subscription()` | `sub_id: int, data: dict` | `Subscription` |
| `cancel_subscription()` | `sub_id: int` | `None` |
| `get_all_subscriptions()` | — | `list[Subscription]` |
| `calculate_monthly_total()` | — | `float` |

#### `BudgetService`

Purchase entry, running total calculation, expense report generation. Monthly cap of ₹10,000; itemized breakdown by category and vendor.

| Method | Parameters | Return Type |
|---|---|---|
| `add_purchase_entry()` | `title: str, copies: int, price: float, vendor: str` | `BookPurchaseEntry` |
| `get_monthly_summary()` | `month: int, year: int` | `dict` |
| `get_budget_utilization()` | `month: int, year: int` | `float` |
| `generate_expense_report()` | `month: int, year: int` | `dict` |

#### `RecommendationService`

Genre/author preference analysis, suggestion generation. Based on borrowing history; excludes already-read books.

| Method | Parameters | Return Type |
|---|---|---|
| `get_recommendations()` | `member_id: int` | `list[Book]` |
| `analyze_reading_preferences()` | `member_id: int` | `dict` |

#### `ReportService`

Usage metrics aggregation, report generation, downloadable exports. Active members, books per month, popular categories.

| Method | Parameters | Return Type |
|---|---|---|
| `get_usage_report()` | — | `dict` |
| `get_expense_report()` | `month: int, year: int` | `dict` |
| `download_report()` | `report_type: str, format: str` | `bytes` |

#### `NotificationService`

Email and web push notification dispatch. Triggered by: overdue items, reservation availability, registration approval/rejection, billing renewal.

| Method | Parameters | Return Type |
|---|---|---|
| `send_overdue_reminders()` | — | `None` |
| `notify_reservation_available()` | `member_id: int, book_id: int` | `Notification` |
| `notify_registration_status()` | `member_id: int, approved: bool` | `Notification` |
| `notify_billing_renewal()` | `member_id: int` | `Notification` |
| `send_email()` | `recipient: str, subject: str, body: str` | `None` |

#### `PaymentService`

Payment processing, fine settlement, payment history. Annual ₹100 fee for off-campus; fine payments.

| Method | Parameters | Return Type |
|---|---|---|
| `process_payment()` | `member_id: int, amount: float, type: PaymentType, fine_id: int` | `Payment` |
| `get_payment_history()` | `member_id: int` | `list[Payment]` |
| `check_outstanding_dues()` | `member_id: int` | `float` |

### 4.3 Cross-Cutting Components

| Component | Responsibility |
|---|---|
| `SessionMiddleware` | Manages session cookies; validates authentication on every request |
| `RBACMiddleware` | Checks user role against endpoint permissions; blocks unauthorized access |
| `ExternalISBNClient` | HTTP client to query an external ISBN database for book metadata auto-fill |
| `EmailClient` | Sends transactional emails (overdue reminders, approval notifications, reservation alerts) |
| `DatabaseConnection` | SQLModel/SQLAlchemy engine and session management |

---

## Part 5: Database Components (Data Models & Enumerations)

The database layer stores all persistent data. Each data model maps to a database table via SQLModel. This section defines all enumerations and data model classes with their complete attributes, types, and constraints - serving as the specification for both the class diagram and the ER diagram.

### 5.1 Enumerations

These are `enum` types used as attribute types across data model classes.

#### `UserRole`
| Value | Description |
|---|---|
| `LIBRARIAN` | Library administrator |
| `MEMBER` | Student (on-campus or off-campus) |
| `CAMPUS_MANAGEMENT` | Campus management staff |

#### `MembershipType`
| Value | Description |
|---|---|
| `ON_CAMPUS` | RVK campus student (no annual fee) |
| `OFF_CAMPUS` | External community member (₹100 annual fee) |

#### `CopyStatus`
| Value | Description |
|---|---|
| `AVAILABLE` | On the shelf, ready to be issued |
| `ISSUED` | Currently issued to a member |
| `LOST` | Declared lost |
| `DAMAGED` | Marked as damaged |

#### `ReturnCondition`
| Value | Description |
|---|---|
| `GOOD` | Returned in acceptable condition |
| `DAMAGED` | Returned in damaged condition (0.5x price fine) |
| `LOST` | Declared lost by the member (1.5x price fine) |

#### `ReservationStatus`
| Value | Description |
|---|---|
| `WAITING` | In queue, waiting for the book to become available |
| `NOTIFIED` | Book is available, member has been notified to collect |
| `FULFILLED` | Member collected the reserved book |
| `CANCELLED` | Member cancelled their reservation |

#### `RequestStatus`
| Value | Description |
|---|---|
| `PENDING` | Request is open, accumulating upvotes |
| `PURCHASED` | Librarian has purchased the book |

#### `SubscriptionFrequency`
| Value | Description |
|---|---|
| `DAILY` | Delivered every day (newspapers) |
| `WEEKLY` | Delivered once a week |
| `BIWEEKLY` | Delivered every two weeks |
| `MONTHLY` | Delivered once a month |

#### `PaymentType`
| Value | Description |
|---|---|
| `MEMBERSHIP_FEE` | Annual ₹100 off-campus membership renewal |
| `FINE_PAYMENT` | Settlement of a fine for damaged/lost book |

#### `NotificationType`
| Value | Description |
|---|---|
| `OVERDUE_REMINDER` | Reminder for overdue book |
| `RESERVATION_AVAILABLE` | Reserved book is now available for collection |
| `REGISTRATION_APPROVED` | Member registration approved by librarian |
| `REGISTRATION_REJECTED` | Member registration rejected by librarian |
| `BILLING_RENEWAL` | Off-campus membership renewal is due |

### 5.2 Data Models

Each data model class maps to a database table via SQLModel. Attributes are listed with their types. Methods on data models are limited to computed properties and simple helpers - all real business logic lives in service classes (Part 4.2).

#### `User`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Authentication, Membership |
| `email` | `str` (unique) | |
| `password_hash` | `str` | |
| `name` | `str` | |
| `role` | `UserRole` | |
| `membership_type` | `MembershipType` (nullable, only for members) | |
| `is_approved` | `bool` | |
| `is_active` | `bool` | |
| `membership_start_date` | `date` (nullable) | |
| `created_at` | `datetime` | |
| `updated_at` | `datetime` | |

| Method | Return Type | Description |
|---|---|---|
| `is_membership_due()` | `bool` | Checks if off-campus member's 1-year billing cycle has expired |

---

#### `Book`

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

#### `BookCopy`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Catalog & Inventory |
| `book_id` | `int` (FK → Book) | |
| `copy_number` | `int` | |
| `status` | `CopyStatus` | |

---

#### `Transaction`

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

#### `Fine`

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

#### `Reservation`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Reservation & Request |
| `member_id` | `int` (FK → User) | |
| `book_id` | `int` (FK → Book) | |
| `queue_position` | `int` | |
| `status` | `ReservationStatus` | |
| `created_at` | `datetime` | |

---

#### `PurchaseRequest`

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

---

#### `PurchaseRequestVote`

Unique constraint on (`request_id`, `member_id`) to prevent double-voting.

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Reservation & Request |
| `request_id` | `int` (FK → PurchaseRequest) | |
| `member_id` | `int` (FK → User) | |
| `created_at` | `datetime` | |

---

#### `Review`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Community & Curation |
| `member_id` | `int` (FK → User) | |
| `book_id` | `int` (FK → Book) | |
| `rating` | `int` (1-5) | |
| `text` | `str` | |
| `is_approved` | `bool` | |
| `created_at` | `datetime` | |

---

#### `ReadingList`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Community & Curation |
| `title` | `str` | |
| `description` | `str` (nullable) | |
| `created_at` | `datetime` | |

---

#### `ReadingListBook`

Junction table for the many-to-many relationship between `ReadingList` and `Book`.

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Community & Curation |
| `reading_list_id` | `int` (FK → ReadingList) | |
| `book_id` | `int` (FK → Book) | |

---

#### `Subscription`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Budget & Subscription |
| `title` | `str` | |
| `type` | `str` (newspaper or magazine) | |
| `copies` | `int` | |
| `price_per_copy` | `float` | |
| `frequency` | `SubscriptionFrequency` | |
| `is_active` | `bool` | |
| `created_at` | `datetime` | |

| Method | Return Type | Description |
|---|---|---|
| `monthly_cost()` | `float` | `copies × price_per_copy × frequency_multiplier` (daily≈26, weekly≈4, biweekly≈2, monthly=1) |

---

#### `BookPurchaseEntry`

Tracks actual book purchases made by the librarian (for budget tracking, not to be confused with `PurchaseRequest` which is a member's wish).

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Budget & Subscription |
| `title` | `str` | |
| `copies` | `int` | |
| `price_per_copy` | `float` | |
| `vendor` | `str` | |
| `purchase_date` | `date` | |

| Method | Return Type | Description |
|---|---|---|
| `total_cost()` | `float` | `copies × price_per_copy` |

---

#### `Payment`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Membership |
| `member_id` | `int` (FK → User) | |
| `amount` | `float` | |
| `type` | `PaymentType` | |
| `fine_id` | `int` (FK → Fine, nullable) | |
| `created_at` | `datetime` | |

---

#### `Notification`

| Attribute | Type | Maps to Module |
|---|---|---|
| `id` | `int` (PK) | Cross-module |
| `recipient_id` | `int` (FK → User) | |
| `type` | `NotificationType` | |
| `message` | `str` | |
| `is_read` | `bool` | |
| `created_at` | `datetime` | |

---

## Part 6: How Components Interact (Inter-Component Flow)

Here is how the components connect across the three tiers for key workflows:

### Workflow: Member Issues a Book

```
Member clicks "Issue" on BorrowingDashboardPage
        │
        ▼
Frontend: IssuePage ──HTTP POST──▶ Backend: circulation_router (/transactions/issue)
                                         │
                                         ▼
                                   CirculationService
                                         │
                              ┌──────────┼──────────┐
                              ▼          ▼          ▼
                        CatalogService  MemberService  ReservationService
                        (check avail)   (check fines)  (check reservation)
                              │          │          │
                              ▼          ▼          ▼
                         BookCopy       User/Fine    Reservation
                         (model)        (models)     (model)
                              │
                              ▼
                        Transaction (model) ← new record created
```

### Workflow: Book is Returned with Active Reservation

```
Librarian processes return on ReturnPage
        │
        ▼
Frontend: ReturnPage ──HTTP POST──▶ Backend: circulation_router (/transactions/return)
                                         │
                                         ▼
                                   CirculationService
                                     │         │
                                     ▼         ▼
                              FineCalculation  ReservationService
                              (if damaged/lost) (check waitlist)
                                     │         │
                                     ▼         ▼
                                   Fine      NotificationService
                                 (model)       │
                                               ▼
                                         EmailClient
                                         (notify queued member)
```

---

## Part 7: Module-to-Component Traceability Matrix

This matrix ensures every feature from the requirements analysis is covered by at least one component.

| Module | Frontend Components | Backend Components | Data Models |
|---|---|---|---|
| 1. Authentication & Identity | `LoginPage`, `RegistrationPage` | `auth_router`, `AuthService`, `SessionMiddleware`, `RBACMiddleware` | `User` |
| 2. Membership Management | `MemberApprovalPage`, `MemberDirectoryPage`, `MemberProfilePage`, `PaymentsPage` | `members_router`, `payments_router`, `MemberService`, `PaymentService` | `User`, `Fine`, `Payment` |
| 3. Catalog & Inventory | `CatalogManagementPage`, `CatalogSearchPage`, `BookDetailPage` | `catalog_router`, `CatalogService`, `ExternalISBNClient` | `Book`, `BookCopy` |
| 4. Circulation | `IssuePage`, `ReturnPage`, `OverdueListPage`, `BorrowingDashboardPage` | `circulation_router`, `CirculationService`, `NotificationService` | `Transaction`, `Fine` |
| 5. Reservation & Request | `ReservationAlertsPage`, `MyReservationsPage`, `BookRequestPage`, `PurchaseRequestsPage` | `reservations_router`, `requests_router`, `ReservationService`, `PurchaseRequestService` | `Reservation`, `PurchaseRequest`, `PurchaseRequestVote` |
| 6. Community & Curation | `ReviewModerationPage`, `MyReviewsPage`, `ReadingListManagementPage` | `reviews_router`, `reading_lists_router`, `ReviewService`, `ReadingListService` | `Review`, `ReadingList`, `ReadingListBook` |
| 7. Recommendations | `MemberDashboard` (recommendations section) | `recommendations_router`, `RecommendationService` | `Transaction` (reads borrowing history), `Book` |
| 8. Budget & Subscription | `SubscriptionManagementPage`, `BookPurchaseEntryPage`, `BudgetTrackerPage` | `subscriptions_router`, `budget_router`, `SubscriptionService`, `BudgetService` | `Subscription`, `BookPurchaseEntry` |
| 9. Reporting | `UsageReportsPage`, `ExpenseReportPage` | `reports_router`, `ReportService` | Aggregates from `Transaction`, `User`, `BookPurchaseEntry`, `Subscription` |

---

## Part 8: Class Diagram - Relationships & Dependencies

The classes, their attributes, and their methods have already been fully defined in Parts 4 (services) and 5 (data models and enumerations). This section specifies the remaining class diagram concern: how these classes relate to each other.

The class diagram uses four types of connections:

| Arrow type | UML term | Meaning | Example |
|---|---|---|---|
| Solid line with filled diamond | **Composition** | "Owns and cannot exist without" | Book ◆── BookCopy (copies don't exist without a book) |
| Solid line | **Association** | "References / links to" | Transaction ── User (a transaction references a member) |
| Dashed line | **Dependency** | "Uses / calls" | CirculationService ╌╌▶ CatalogService |
| Hollow triangle arrow | **Realization** | "Enum used as type" | User ── UserRole |

### 8.1 Model-to-Model Relationships (Associations and Compositions)

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
| `Book` ── `Reservation` | Association | 1 Book → * Reservations | Waitlist entries for a book |
| `BookCopy` ── `Transaction` | Association | 1 BookCopy → * Transactions | Issue history of a specific copy |
| `Transaction` ── `Fine` | Association | 1 Transaction → 0..1 Fine | Fine generated on a damaged/lost return |
| `PurchaseRequest` ◆── `PurchaseRequestVote` | Composition | 1 PurchaseRequest → * Votes | Upvotes on a request |
| `ReadingList` ◆── `ReadingListBook` | Composition | 1 ReadingList → * ReadingListBooks | Books in a reading list |
| `Book` ── `ReadingListBook` | Association | 1 Book → * ReadingListBooks | Reading lists containing a book |
| `Fine` ── `Payment` | Association | 1 Fine → 0..1 Payment | Payment that settles a fine |

### 8.2 Service-to-Service Dependencies

These show which service depends on (calls into) another service.

| Service | Depends on |
|---|---|
| `CirculationService` | `CatalogService`, `MemberService`, `ReservationService`, `NotificationService` |
| `ReservationService` | `NotificationService` |
| `BudgetService` | `SubscriptionService` |
| `CatalogService` | `ExternalISBNClient` |
| `NotificationService` | `EmailClient` |
| `PaymentService` | `MemberService` |

### 8.3 Service-to-Model Dependencies

Each service operates on specific data model classes:

| Service | Operates on |
|---|---|
| `AuthService` | `User` |
| `MemberService` | `User` |
| `CatalogService` | `Book`, `BookCopy` |
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

---

## Part 9: Next Steps

This document covers the complete system design for all three Milestone 2 deliverables:

- **Design of Components** (Parts 2-7) - All frontend, backend, and database components with their responsibilities, methods, attributes, and inter-component workflows.
- **Class Diagram** (Parts 4, 5, 8) - All classes with attributes and methods (defined in Parts 4 and 5), plus all relationships and dependencies (Part 8).
- **Database Design / ER Diagram** (Part 5) - All data models with complete attribute definitions, types, foreign keys, and constraints.

The next step is to generate the actual diagrams from this specification:

1. **Mermaid `classDiagram`** - Translate the service classes (Part 4.2), data models (Part 5.2), enumerations (Part 5.1), and relationships (Part 8) into Mermaid class diagram code.
2. **Mermaid `erDiagram`** - Translate the data models (Part 5.2) and model-to-model relationships (Part 8.1) into Mermaid ER diagram code.
3. **Mermaid `sequenceDiagram`** (optional) - Convert the workflow diagrams from Part 6 into formal Mermaid sequence diagrams.
