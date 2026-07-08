# Handoff: Generate Milestone 2 Initial Backlogs

## 1. Goal Description
The objective is to create the initial product backlogs for "Milestone 2" of the Library Management System. 
A subsequent coding agent will read this document and generate a markdown file named `initial-backlogs.md` inside `docs/milestone-2/`. 

## 2. Context & Source Files Provided
The user originally provided the following files for context to understand the system design, requirements, and workflow:
1. `docs/milestone-2/deliverables/1.1_design-of-components.md`
2. `docs/milestone-2/deliverables/1.2_frontend-components.md`
3. `docs/milestone-2/deliverables/1.3_backend-components.md`
4. `docs/milestone-2/deliverables/1.4_database-components.md`
5. `backend/README.md`
6. `frontend/README.md`
7. `docs/milestone-1/deliverables/team-details.md`
8. `docs/milestone-2/git-collaboration-workflow.md`
9. `docs/milestone-1/deliverables/4_user-stories.md`
10. `docs/milestone-1/deliverables/5_requirements-analysis.md`

## 3. Explicit User Instructions & Constraints
The user provided the following explicit instructions for generating the backlogs:
- **File Output**: Create a markdown document named `initial-backlogs.md` in `docs/milestone-2/`.
- **Milestone Timeline**: Target dates start from **July 9** and the milestone deadline is **July 22** (approx. 15 days).
- **Frontend Priority**: For this milestone, the frontend is the primary focus and will be graded. It must work using data mocking (via Mock Service Worker / MSW) without needing the backend. 
- **Backend Flexibility**: Backend work (routers and APIs) should be included but is secondary. It can be skipped if time does not allow.
- **Backlog Details**: Each backlog item must contain a **Title**, a **Description**, and a **Target Date**.
- **No Specific Assignees**: Do not assign individuals to the backlogs; the team will assign them internally based on availability and preference. However, the schedule assumes a 5-person team working in parallel (Rahul, Taniya, Vidhatri, Harikesh, Bharat).
- **Task Sizing**: Each backlog should represent roughly 2-3 days of effort.
- **Critical Path Ordering**: Backlogs must be ordered with the most crucial/critical features first.
- **Exclude Completed Work**: Explore the codebase to find what is already done (Version 0 scaffolding) and **do not include** already completed work in the backlogs.

## 4. Codebase Exploration Results (What is already completed)
Upon exploring the repository, the following items were identified as already implemented in "Version 0" and must **NOT** be included in the backlogs:
- **Backend Models**: All SQLModel database models (`user.py`, `catalog.py`, `circulation.py`, etc.) and database configuration.
- **Frontend Layouts**: Core routing and layouts (`AppLayout.jsx`, `AuthLayout.jsx`, `DashboardLayout.jsx`).
- **Frontend Auth UI**: Core authentication pages (`LoginPage.jsx`, `RegisterPage.jsx`).
- **Frontend UI primitives**: Base shadcn UI components (`button`, `card`, `input`, `label`, `sheet`).
- **Basic MSW Setup**: Initial `authHandlers.js` for handling login mocks.

*(Note: Backend routers exist as empty placeholders and still need implementation. Frontend dashboards like `LibrarianDashboard.jsx` exist as empty placeholders and need implementation).*

---

## 5. Proposed Changes: The Backlog List to Generate
The next coding agent must generate `docs/milestone-2/initial-backlogs.md` containing exactly these 27 backlogs, grouped into chronological batches (assuming 5 parallel tracks taking 2-3 days each).

### Batch 1: Shared Components & Catalog Mocks (Target: July 9 - July 11)
1. **[Frontend] Setup MSW Mocks for Catalog & Circulation**
   - *Description*: Expand the existing `mockData.js` and MSW handlers to include robust mock data for Books, Copies, Transactions, and Fines, unblocking frontend logic.
2. **[Frontend] Build Shared UI: DataTable & SearchBar**
   - *Description*: Create the reusable `DataTable` component with pagination and sorting, and the `SearchBar` with debounced input, crucial for upcoming lists.
3. **[Frontend] Build Shared UI: ConfirmationModal & NotificationBanner**
   - *Description*: Implement a reusable modal for approve/reject actions and a top-level banner for alerts.
4. **[Frontend] Build CatalogManagementPage (List & Add)**
   - *Description*: Implement the grid/table of library books. Add the "Add Book" form. Integrate MSW handlers to mock saving new books.
5. **[Backend] Implement AuthRouter & AuthService**
    - *Description*: Build the FastAPI endpoints for login/register, JWT token generation, password hashing, and role-based access control (RBAC) middleware.

### Batch 2: Catalog UI & Core Circulation (Target: July 11 - July 13)
6. **[Frontend] Build BookCard & BarcodeScannerInput UI**
   - *Description*: Create the reusable `BookCard` for member catalogs and the `BarcodeScannerInput` widget for the librarian catalog page.
7. **[Frontend] Build CatalogSearchPage (Member View)**
   - *Description*: Implement the member-facing catalog search with title/author filters and real-time availability badges via MSW.
8. **[Frontend] Build IssuePage**
    - *Description*: Implement the librarian page to issue books. Requires member lookup, book lookup, and setting a return deadline.
9. **[Frontend] Build ReturnPage & FineCalculator**
    - *Description*: Implement the return workflow. Include the `FineCalculator` component to automatically compute 0.5x/1.5x fines based on book condition.
10. **[Backend] Implement CatalogRouter & CatalogService**
    - *Description*: Build the CRUD endpoints for books, handle copy-level tracking, and implement the availability calculation logic.

### Batch 3: Dashboards & Member Views (Target: July 13 - July 15)
11. **[Frontend] Build BookDetailPage & StarRating**
    - *Description*: Implement the single book view showing description, availability, and reviews. Include the "Reserve" button logic mocked via MSW.
12. **[Frontend] Build LibrarianDashboard & OverdueListPage**
    - *Description*: Flesh out the librarian landing page with summary stats and build the dedicated table for overdue items.
13. **[Frontend] Build MemberDashboard**
    - *Description*: Flesh out the member landing page showing currently issued books, due dates, and recommendations.
14. **[Frontend] Build MemberApprovalPage**
    - *Description*: Implement the queue for librarians to approve or reject pending member registrations.
15. **[Backend] Implement CirculationRouter & CirculationService**
    - *Description*: Build endpoints for issuing, returning, fine calculation, and overdue item detection.

### Batch 4: Membership Management & Waitlists (Target: July 15 - July 17)
16. **[Frontend] Build MemberDirectoryPage & MemberProfilePage**
    - *Description*: Implement the searchable list of members and the detailed profile view showing borrowing history and fines.
17. **[Frontend] Build BorrowingDashboardPage & PaymentsPage**
    - *Description*: Implement the member's detailed view of current issues and the interface to pay membership fees or fines (mocked via MSW).
18. **[Frontend] Build MyReservationsPage & ReservationAlertsPage**
    - *Description*: Implement the member's waitlist view and the librarian's alerts for returned reserved books.
19. **[Frontend] Build BookRequestPage & PurchaseRequestsPage**
    - *Description*: Implement the member submission/upvoting interface for requests, and the ranked list view for librarians.
20. **[Backend] Implement MembersRouter & MemberService**
    - *Description*: Build endpoints for member approval, profile fetching, and borrowing history retrieval.

### Batch 5: Secondary Modules & Reporting (Target: July 17 - July 20)
21. **[Frontend] Build BudgetTrackerPage & BudgetProgressBar**
    - *Description*: Implement the real-time budget utilization view and visual progress bar against the monthly cap.
22. **[Frontend] Build BookPurchaseEntryPage & SubscriptionManagementPage**
    - *Description*: Implement forms for the librarian to log new purchases and manage newspaper/magazine subscriptions.
23. **[Frontend] Build ReviewModerationPage & MyReviewsPage**
    - *Description*: Implement the librarian's review approval queue and the member's personal review history.
24. **[Frontend] Build UsageReportsPage & ExpenseReportPage**
    - *Description*: Implement the Campus Management dashboard views for usage metrics and itemized expenses.
25. **[Frontend] Build ReadingListManagementPage**
    - *Description*: Implement the UI for librarians to create themed book collections.
26. **[Backend] Implement Reservations & Requests Routers**
    - *Description*: Build endpoints to manage reservation queues and book purchase requests/upvotes.
27. **[Backend] Implement Budget & Subscription Routers**
    - *Description*: Build endpoints for tracking purchases and calculating subscription costs.

---

## User Review Required
Does this document accurately and completely capture all of your instructions, the context files, and the expected final output? If approved, the agent will begin generating `initial-backlogs.md`.
