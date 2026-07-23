# Project Sprint Schedule

## Milestone 2: UI Implementation Phase
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

## Milestone 3 (Sprint 1): Backend API Development & Integration
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

## Milestone 4 (Sprint 2): Advanced Features & Final API Polish
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

## Milestone 5: Final Submission & Handoff
**Target Date:** 23rd August 2026

**Sprint Goal:** Comprehensive end-to-end validation, final polish, and project compilation.

**Planned Tasks:**
- Cross-module consistency fixes (ensuring returns, payments, reviews, and reservations all sync correctly).
- Finalize all UI empty states, loading indicators, and error handling.
- Full end-to-end walkthrough of all user stories.
- Record final video presentation / demo.
- Prepare the final slide presentation focusing on user stories and identification.
- Compile the complete source code, updated `README.md`, and the final comprehensive report.
