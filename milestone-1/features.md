# System Modules & Features

This document outlines the core modules of the Library Management System and their associated features, derived directly from the SMART User Stories. 

## 1. Authentication & Identity Module
*   **Secure Access** ➔ Role-based routing to administrative (Librarian) or standard (Member) dashboards.
*   **Member Onboarding** ➔ Self-registration for students ➔ Librarian approval queue.

## 2. Membership Management Module
*   **Digital Profiles** ➔ Replaces physical passbooks; tracks complete borrowing history and active limits.
*   **Billing & Renewals** ➔ Automatically tracks the rolling 1-year cycle for off-campus members ➔ Flags librarian for pending renewals.
*   **Payment Gateway** ➔ Facilitates in-app payments for annual membership renewals and overdue fines.

## 3. Catalog & Inventory Module
*   **Catalog CRUD** ➔ Librarian can add, edit, and categorize the library's 5,000+ books.
*   **Inventory Health** ➔ Granular copy tracking to mark specific books as lost or damaged.
*   **Smart Discovery** ➔ Members can search by title, author, or category ➔ View real-time availability status (e.g., "Available" vs. "Out of Stock").

## 4. Circulation (Issue/Return) Module
*   **Digital Issue/Return** ➔ Instantly logs transactions and clears member accounts upon return.
*   **Deadline Tracking** ➔ Automatically calculates the strict 10-day return window.
*   **Automated Fines** ➔ Instantly calculates exact penalties (0.5x for damaged, 1.5x for lost) based on the book's base price.
*   **Overdue Engine** ➔ Aggregates a global list of overdue items ➔ Dispatches automated email/web push notifications to late members.

## 5. Reservation & Request Module
*   **Digital Waitlist** ➔ Members place holds on out-of-stock books ➔ Enters an automated First-In-First-Out queue.
*   **Availability Alerts** ➔ System prompts librarian to hold returned reserved books ➔ Automatically notifies the queued member to collect.
*   **Purchase Pipeline** ➔ Members suggest new books ➔ Community upvotes ➔ Librarian ranks requests to prioritize the ₹10,000 monthly budget.

## 6. Community & Curation Module
*   **Digital Reviews** ➔ Members submit ratings and reviews ➔ Librarian moderates ➔ Permanently displayed for future readers.
*   **Reading Lists** ➔ Librarian curates thematic collections (e.g., "Best Sci-Fi") ➔ Displayed prominently on member dashboards.

## 7. Reporting Module
*   **High-Level Analytics** ➔ Generates automated metrics (total active members, monthly issues, popular categories) ➔ Used to justify campus budget allocations.
