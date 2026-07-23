# Milestone 2 Backlogs

---

## Purpose

This document lists the backlog for Milestone 2. The work has to be started from version 0, meaning after the initial scaffolding of the project repository is done and initial critical common stuff is written out.

**Important:** The goal is not to implement these features end-to-end. The features have to be implemented only at the layer of the UI. There are no back end database calls, services, or routers involved at this stage. For now, it's only about the UI that the user is going to interact with. For back end logic, we are using MSW (Mock Service Worker) to mock the back end endpoint requests.

The backlog is ordered by priority. Work top-to-bottom.

## Definition of Done

- Feature front end is fully implemented and interacts with MSW mocked endpoints.
- Validation, error handling, and loading/empty states are in place on the front end.
- Manually verified UI workflows.
- No breaking of previously completed backlogs.

---

## Sprint One (July 10 to 12)

---

### 1. Authentication & Authorization

**Description**
Users (member, librarian, campus management) can log in securely and are routed to the correct dashboard based on role. Protects all routes that require login and handles session persistence and logout. This is the entry point for every other feature.

**User Stories**

- **As a Librarian**, I want to securely log in to the administrative dashboard, so that I can manage library operations without unauthorized access.
- **As a Member**, I want to securely log in to my portal, so that I can manage my personal reading activity.

**Deliverables**

- Login page and API
- Role-based redirection
- Protected/guarded routes
- Session/token persistence across refresh
- Logout
- Invalid credential and unauthorized access handling

---

### 2. Catalog Management

**Description**
Librarians can add, edit, and manage the book catalog, including categories and per-copy inventory (available, issued, damaged, lost). Optionally auto-fill book metadata using an ISBN lookup to speed up data entry.

**User Stories**

- **As a Librarian**, I want to add new books to the digital catalog (with title, author, category, price, and total copies), so that members can search and discover them.
- **As a Librarian**, I want to scan a book's ISBN barcode when adding it to the catalog and have the system auto-fill the title, author, and genre, so that I don't have to type all the details manually for every book.
- **As a Librarian**, I want to edit existing book records, so that I can correct typos or reclassify a book's category.
- **As a Librarian**, I want to mark specific copies of a book as "lost" or "damaged", so that the real-time availability status remains accurate for members searching the catalog.

**Deliverables**

- Add / edit / view / archive book workflow
- Category management
- Copy-level tracking (multiple copies per book, individual status)
- ISBN lookup integration with auto-fill and manual override
- Catalog CRUD APIs and validation

---

### 3. Member Dashboard & Profile

**Description**
A member's personal home screen showing borrowed books, due dates, fines, reservations, and membership status, plus a profile page to view/edit personal details, see full borrowing history, and change password.

**User Stories**

- **As a Member**, I want to view a dashboard of my currently issued books and magazines along with their exact due dates, so that I can keep track of each item's deadline and return them on time.
- **As a Librarian**, I want to view a member's complete borrowing history and current issue limit on their digital profile, so that we completely eliminate the need for 20-entry physical passbooks.

**Deliverables**

- Member dashboard (summary cards, quick actions, empty states for new users)
- Profile view/edit (protected fields locked)
- Complete borrowing history (current vs past)
- Change password flow

---

### 4. Librarian & Campus Management Dashboards

**Description**
Operational home screens: librarians get a single view of overdue books, pending approvals, reservations, budget status, and alerts; campus management gets a high-level summary with links into reports.

**User Stories**

- *(No specific user stories, as this is an aggregation of widgets from other features like overdue lists, alerts, and budget summaries.)*

**Deliverables**

- Librarian dashboard (widgets + quick actions + alerts)
- Campus management dashboard (summary cards + report links)
- Alert dismissal/resolution handling

---

## Sprint Two (July 13 to 18)

---

### 5. Book Search, Filtering & Details

**Description**
Members can search and filter the catalog by title, author, category, availability, and rating, and view a detailed page for each book with metadata and current availability.

**User Stories**

- **As a Member**, I want to search the digital catalog using filters (title, author, category), so that I can find books immediately without manually browsing racks.
- **As a Member**, I want to see the real-time availability of a book (e.g., "Available" vs. "All copies issued"), so that I don't waste time looking for a book that isn't on the shelf.

**Deliverables**

- Search page with filters and sorting
- Availability indicators
- Empty/no-result states
- Book details page (metadata, availability, copies, related actions)
- Search/filter API

---

### 6. Member Registration & Approval

**Description**
New members can register for a library account. Accounts stay in a "Pending" state until a librarian reviews and approves or rejects them. Replaces the manual paper registration process.

**User Stories**

- **As a Member**, I want to self-register for a library account, so that I can access digital services without needing a physical card.
- **As a Librarian**, I want to review and approve new digital member registrations, so that I can verify their identity before granting them borrowing privileges.

**Deliverables**

- Registration page and API with validation and duplicate detection
- Pending members list for librarian
- Approve / reject actions
- Status updates reflected immediately for the member
- Approved-only access to borrowing features

---

---

### 7. Issue Book Workflow

**Description**
Librarians can issue a book to an eligible member. The system checks borrowing limits, assigns a due date, updates inventory, and records the transaction so it reflects immediately in the member's account.

**User Stories**

- **As a Librarian**, I want to digitally issue a book or magazine to a member's account and set the return deadline, so that the system automatically records the transaction and tracks the exact due date.
- **As a Librarian**, I want to view a member's outstanding fines before issuing a book to them, so that I am aware of any unpaid dues on their account.
- **As a Member**, I want to be able to issue a new book even if I haven't returned my previous ones (up to the maximum limit), so that I am not forced to return books just to keep my account active.

**Deliverables**

- Issue book interface (member + book lookup)
- Eligibility and issue-limit checks
- Due date assignment
- Transaction record creation
- Copy/inventory status update

---

### 8. Return Book & Fine Calculation

**Description**
Librarians can process book returns, close the transaction, and automatically calculate fines for late, damaged, or lost books. Completes the core circulation loop started by Issue Book.

**User Stories**

- **As a Librarian**, I want to process a book return digitally, so that the member's account is immediately cleared and they can borrow again.
- **As a Librarian**, I want the system to automatically calculate the exact fine (0.5x price for damaged, 1.5x price for lost) when I flag a returned book's condition, so that I can eliminate manual math errors.

**Deliverables**

- Return workflow with condition selection
- Automatic fine calculation (late/damaged/lost)
- Fine record generation
- Inventory update on return
- Member borrowing eligibility restored

---

### 9. Overdue Book Management

**Description**
Librarians can view a centralized, auto-generated list of all overdue transactions with member details and days overdue, to follow up efficiently.

**User Stories**

- **As a Librarian**, I want to view an automated list of all overdue books across the library, so that I no longer have to manually scan through pages of a physical register.

**Deliverables**

- Overdue list page with search/sort
- Automatic overdue detection and day calculation
- List updates automatically after returns

---

### 10. Notification System

**Description**
In-app notifications keep members and librarians informed (approval status, overdue reminders, reservation availability, renewal reminders, admin alerts). Users can mark notifications read and choose which types they want to receive.

**User Stories**

- **As a Librarian**, I want to send automated email or web push notifications to members who have overdue books, so that I can remind them to return items without contacting each one manually.
- **As a Member**, I want to receive a notification when the librarian approves or rejects my registration, so that I know when I can start using the library's services.
- **As a Member**, I want to receive email or web push notifications when my issued books become overdue, so that I am reminded to return them promptly.
- **As a Member**, I want to receive an automated notification when my reserved book is returned to the library, so that I can collect it promptly.

**Deliverables**

- Notification center (list, read/unread, empty state)
- Automatic notification generation for key events
- Notification preferences (opt in/out per type)
- Admin-facing alerts (pending approvals, overdue, budget threshold, etc.)

---

### 11. Book Reservation System

**Description**
Members can reserve books that have no available copies and join a first-come-first-served queue. Reservations progress automatically as copies become available; members can cancel anytime.

**User Stories**

- **As a Member**, I want to click a "Reserve" button on a book that is currently out of stock, so that I can enter a fair, automated waitlist.
- **As a Member**, I want to cancel a reservation I previously placed, so that I can withdraw from the waitlist if I no longer need the book.
- **As a Librarian**, I want the system to alert me when a returned book has an active reservation, so that I can hold it aside for the queued member rather than returning it to the shelf.

**Deliverables**

- Reserve/cancel actions
- Queue management with position tracking
- Duplicate reservation prevention
- Automatic queue progression when a copy is returned
- Librarian visibility into pending reservations

---

### 12. Purchase Request System

**Description**
Members can request books missing from the catalog and upvote others' requests. Librarians see requests ranked by popularity and can mark them as purchased. A transparent, community-driven way to grow the collection.

**User Stories**

- **As a Member**, I want to submit a formal request for a book the library doesn't currently own, so that the librarian knows what I want to read.
- **As a Member**, I want to upvote existing book requests submitted by other members, so that highly desired books get prioritized for purchase.
- **As a Librarian**, I want to view a ranked list of new book purchase requests sorted by member upvotes, so that I can prioritize how to spend the monthly budget based on actual demand.
- **As a Librarian**, I want to mark a book purchase request as "purchased" once I have bought the book, so that members can see that their request has been acted on.

**Deliverables**

- Submit request page
- Upvote with duplicate-vote prevention
- Ranked request listing
- Librarian view to manage/mark purchased status

---

---

## Sprint Three (July 18 to 22)

---

### 13. Book Reviews & Ratings

**Description**
Members can rate and review books they've read. Reviews require librarian moderation before becoming public. Book pages show approved reviews and an average rating.

**User Stories**

- **As a Member**, I want to submit a digital rating and written review for a book I have read, so that my feedback is permanently saved and helps future readers.
- **As a Member**, I want to read reviews left by others on a book's detail page, so that I can decide if it's worth reading.
- **As a Librarian**, I want to review and moderate book reviews submitted by members, so that I can maintain a high-quality, permanent digital display board.

**Deliverables**

- Submit rating/review
- Moderation queue (approve/reject)
- Public display of approved reviews on book page
- Average rating calculation

---

### 14. Payments & Membership Renewal

**Description**
Members can pay outstanding fines and renew their membership online (simulated payment, no real gateway needed). The system tracks membership expiry and automatically flags/reminds members before their membership lapses.

**User Stories**

- **As a Member**, I want to pay my annual membership renewal fee (₹100 for off-campus members) or outstanding fines through the application, so that my account remains active without visiting the library in person.
- **As a Member**, I want to view my complete fine and payment history, so that I have a clear record of all past dues and settlements.
- **As a Librarian**, I want the system to automatically track an off-campus member's 1-year billing cycle and flag them when renewal is due, so that I can easily notify them or disable their access if they haven't paid their ₹100 fee.

**Deliverables**

- Fine payment workflow
- Membership renewal payment workflow
- Payment history and outstanding balance
- Automatic membership expiry detection and renewal reminders

---

### 15. Subscription & Periodical Management

**Description**
Librarians manage recurring newspaper/magazine subscriptions and record incoming issues, which become searchable/borrowable like regular catalog items.

**User Stories**

- **As a Librarian**, I want to add a new newspaper or magazine subscription to the system (title, copies, price per copy, frequency), so that its monthly cost is automatically included in the budget without manual calculation.
- **As a Librarian**, I want to modify the details of an existing subscription (e.g., change the number of copies or price per copy), so that the budget calculation stays accurate when subscription terms change.
- **As a Librarian**, I want to cancel a subscription that the library no longer wants, so that it stops appearing in future monthly budget calculations.

**Deliverables**

- Subscription CRUD (create/update/cancel) with monthly cost calculation
- Record received issues linked to a subscription
- Catalog/search integration for periodicals

---

### 16. Budget & Expense Tracking

**Description**
Librarians record book purchases (vendor, cost, copies) and see a live budget dashboard combining purchase and subscription costs against monthly allocation, with grouped expense reports.

**User Stories**

- **As a Librarian**, I want to enter the details of a new book purchase (title, copies, price per copy, vendor), so that its cost is immediately added to the month's running budget total.
- **As a Librarian**, I want to see a real-time view of how much of the ₹10,000 monthly allowance has been used so far, so that I know how much is left to spend before the month ends.
- **As Campus Management**, I want to view the month-end itemized expense report (broken down by newspapers, magazines, and books with vendor details), so that I can verify the librarian's spending and approve the reimbursement amount.

**Deliverables**

- Purchase entry recording (vendor, price, category, date)
- Budget dashboard (allocated vs spent vs remaining)
- Expense reports grouped by category/vendor/month

---

### 17. Reading Lists

**Description**
Librarians create curated, themed reading lists containing multiple books; members can browse them for discovery.

**User Stories**

- **As a Librarian**, I want to create and manage custom reading lists (e.g., "Top Sci-Fi", "Required Physics Reading"), so that I can highlight curated collections on member dashboards.

**Deliverables**

- Create/edit/delete reading list
- Add/remove books (book can belong to multiple lists)
- Member browsing view

---

### 18. Personalized Recommendations

**Description**
Members get book recommendations based on borrowing history, category/author similarity, and ratings — excluding books already borrowed.

**User Stories**

- **As a Member**, I want to see book recommendations on my dashboard based on the genres and authors I have previously read, so that I can discover new books that match my interests without searching manually.

**Deliverables**

- Recommendation logic (rule-based)
- Recommendation API and dashboard widget
- Handles members with no borrowing history

---

### 19. Reports & Analytics

**Description**
Campus management can view library usage statistics (active members, circulation trends, popular categories) and download reports for record-keeping.

**User Stories**

- **As Campus Management**, I want to view automated high-level reports on library usage (total active members, books issued per month, most active categories), so that I can measure the library's impact and justify the ongoing ₹10,000 monthly budget allocation.
- **As Campus Management**, I want to download library usage reports, so that I can keep records and share them with other stakeholders as needed.

**Deliverables**

- Usage dashboard with charts/metrics
- Report generation APIs
- Export/download (CSV/PDF as scoped)

---

### 20. Final Polish, Integration & Validation

**Description**
Cross-cutting pass to make the app feel like one coherent product: ensure actions in one module correctly update related modules (e.g., return → reservation → availability → recommendations), add meaningful empty states everywhere, unify navigation/UX, and validate every user story end-to-end before final submission.

**User Stories**

- *(Encompasses end-to-end validation of all user stories from the previous backlogs)*

**Deliverables**

- Cross-module consistency fixes (returns, payments, reviews, purchases, approvals all sync correctly)
- Empty/first-time-user states across all pages
- Consistent navigation, loading states, and feedback messages
- Full end-to-end walkthrough of all user stories, critical bug fixes
