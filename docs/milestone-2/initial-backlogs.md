# Initial Backlogs

## Milestone 2 — Library Management System

---

## Purpose

This document lists the backlog for Milestone 2. Each backlog is a complete, demonstrable feature (frontend + backend + database + validation + testing), not a technical task. Frontend pages, APIs, DB schema, components, and tests are all part of finishing a backlog — they are not tracked separately.

The backlog is ordered by priority. Work top-to-bottom. With a team of 5, multiple backlogs can be picked up in parallel each day (1–2 days per backlog).

## Definition of Done

- Feature works end-to-end (UI → API → DB).
- Validation, error handling, and loading/empty states are in place.
- Manually verified; basic tests added where practical.
- No breaking of previously completed backlogs.

---

## Backlog List (in priority order)

---

### 1. Authentication & Authorization

**Description**
Users (member, librarian, campus management) can log in securely and are routed to the correct dashboard based on role. Protects all routes that require login and handles session persistence and logout. This is the entry point for every other feature.

**Deliverables**

- Login page and API
- Role-based redirection
- Protected/guarded routes
- Session/token persistence across refresh
- Logout
- Invalid credential and unauthorized access handling

---

### 2. Member Registration & Approval

**Description**
New members can register for a library account. Accounts stay in a "Pending" state until a librarian reviews and approves or rejects them. Replaces the manual paper registration process.

**Deliverables**

- Registration page and API with validation and duplicate detection
- Pending members list for librarian
- Approve / reject actions
- Status updates reflected immediately for the member
- Approved-only access to borrowing features

---

### 3. Catalog Management

**Description**
Librarians can add, edit, and manage the book catalog, including categories and per-copy inventory (available, issued, damaged, lost). Optionally auto-fill book metadata using an ISBN lookup to speed up data entry.

**Deliverables**

- Add / edit / view / archive book workflow
- Category management
- Copy-level tracking (multiple copies per book, individual status)
- ISBN lookup integration with auto-fill and manual override
- Catalog CRUD APIs and validation

---

### 4. Book Search, Filtering & Details

**Description**
Members can search and filter the catalog by title, author, category, availability, and rating, and view a detailed page for each book with metadata and current availability.

**Deliverables**

- Search page with filters and sorting
- Availability indicators
- Empty/no-result states
- Book details page (metadata, availability, copies, related actions)
- Search/filter API

---

### 5. Issue Book Workflow

**Description**
Librarians can issue a book to an eligible member. The system checks borrowing limits, assigns a due date, updates inventory, and records the transaction so it reflects immediately in the member's account.

**Deliverables**

- Issue book interface (member + book lookup)
- Eligibility and issue-limit checks
- Due date assignment
- Transaction record creation
- Copy/inventory status update

---

### 6. Return Book & Fine Calculation

**Description**
Librarians can process book returns, close the transaction, and automatically calculate fines for late, damaged, or lost books. Completes the core circulation loop started by Issue Book.

**Deliverables**

- Return workflow with condition selection
- Automatic fine calculation (late/damaged/lost)
- Fine record generation
- Inventory update on return
- Member borrowing eligibility restored

---

### 7. Member Dashboard & Profile

**Description**
A member's personal home screen showing borrowed books, due dates, fines, reservations, and membership status, plus a profile page to view/edit personal details, see full borrowing history, and change password.

**Deliverables**

- Member dashboard (summary cards, quick actions, empty states for new users)
- Profile view/edit (protected fields locked)
- Complete borrowing history (current vs past)
- Change password flow

---

### 8. Overdue Book Management

**Description**
Librarians can view a centralized, auto-generated list of all overdue transactions with member details and days overdue, to follow up efficiently.

**Deliverables**

- Overdue list page with search/sort
- Automatic overdue detection and day calculation
- List updates automatically after returns

---

### 9. Notification System

**Description**
In-app notifications keep members and librarians informed (approval status, overdue reminders, reservation availability, renewal reminders, admin alerts). Users can mark notifications read and choose which types they want to receive.

**Deliverables**

- Notification center (list, read/unread, empty state)
- Automatic notification generation for key events
- Notification preferences (opt in/out per type)
- Admin-facing alerts (pending approvals, overdue, budget threshold, etc.)

---

### 10. Book Reservation System

**Description**
Members can reserve books that have no available copies and join a first-come-first-served queue. Reservations progress automatically as copies become available; members can cancel anytime.

**Deliverables**

- Reserve/cancel actions
- Queue management with position tracking
- Duplicate reservation prevention
- Automatic queue progression when a copy is returned
- Librarian visibility into pending reservations

---

### 11. Purchase Request System

**Description**
Members can request books missing from the catalog and upvote others' requests. Librarians see requests ranked by popularity and can mark them as purchased. A transparent, community-driven way to grow the collection.

**Deliverables**

- Submit request page
- Upvote with duplicate-vote prevention
- Ranked request listing
- Librarian view to manage/mark purchased status

---

### 12. Book Reviews & Ratings

**Description**
Members can rate and review books they've read. Reviews require librarian moderation before becoming public. Book pages show approved reviews and an average rating.

**Deliverables**

- Submit rating/review
- Moderation queue (approve/reject)
- Public display of approved reviews on book page
- Average rating calculation

---

### 13. Payments & Membership Renewal

**Description**
Members can pay outstanding fines and renew their membership online (simulated payment, no real gateway needed). The system tracks membership expiry and automatically flags/reminds members before their membership lapses.

**Deliverables**

- Fine payment workflow
- Membership renewal payment workflow
- Payment history and outstanding balance
- Automatic membership expiry detection and renewal reminders

---

### 14. Subscription & Periodical Management

**Description**
Librarians manage recurring newspaper/magazine subscriptions and record incoming issues, which become searchable/borrowable like regular catalog items.

**Deliverables**

- Subscription CRUD (create/update/cancel) with monthly cost calculation
- Record received issues linked to a subscription
- Catalog/search integration for periodicals

---

### 15. Budget & Expense Tracking

**Description**
Librarians record book purchases (vendor, cost, copies) and see a live budget dashboard combining purchase and subscription costs against monthly allocation, with grouped expense reports.

**Deliverables**

- Purchase entry recording (vendor, price, category, date)
- Budget dashboard (allocated vs spent vs remaining)
- Expense reports grouped by category/vendor/month

---

### 16. Reading Lists

**Description**
Librarians create curated, themed reading lists containing multiple books; members can browse them for discovery.

**Deliverables**

- Create/edit/delete reading list
- Add/remove books (book can belong to multiple lists)
- Member browsing view

---

### 17. Personalized Recommendations

**Description**
Members get book recommendations based on borrowing history, category/author similarity, and ratings — excluding books already borrowed.

**Deliverables**

- Recommendation logic (rule-based)
- Recommendation API and dashboard widget
- Handles members with no borrowing history

---

### 18. Reports & Analytics

**Description**
Campus management can view library usage statistics (active members, circulation trends, popular categories) and download reports for record-keeping.

**Deliverables**

- Usage dashboard with charts/metrics
- Report generation APIs
- Export/download (CSV/PDF as scoped)

---

### 19. Librarian & Campus Management Dashboards

**Description**
Operational home screens: librarians get a single view of overdue books, pending approvals, reservations, budget status, and alerts; campus management gets a high-level summary with links into reports.

**Deliverables**

- Librarian dashboard (widgets + quick actions + alerts)
- Campus management dashboard (summary cards + report links)
- Alert dismissal/resolution handling

---

### 20. Final Polish, Integration & Validation

**Description**
Cross-cutting pass to make the app feel like one coherent product: ensure actions in one module correctly update related modules (e.g., return → reservation → availability → recommendations), add meaningful empty states everywhere, unify navigation/UX, and validate every user story end-to-end before final submission.

**Deliverables**

- Cross-module consistency fixes (returns, payments, reviews, purchases, approvals all sync correctly)
- Empty/first-time-user states across all pages
- Consistent navigation, loading states, and feedback messages
- Full end-to-end walkthrough of all user stories, critical bug fixes
