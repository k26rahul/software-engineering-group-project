# SMART User Stories

This document outlines the exhaustive list of user stories required to build the Library Management System. These stories dictate the features to be implemented based on the workflows of the library.

The stories are written in the SMART format: `As a [user persona], I want [action], so that [value/benefit].`

---

## 1. Librarian (Primary User)

### 1.1 Authentication & Access
*   **As a Librarian**, I want to securely log in to the administrative dashboard, so that I can manage library operations without unauthorized access.

### 1.2 Membership Management
*   **As a Librarian**, I want to review and approve new digital member registrations, so that I can verify their identity before granting them borrowing privileges.
*   **As a Librarian**, I want to view a member's complete borrowing history and current issue limit on their digital profile, so that we completely eliminate the need for 20-entry physical passbooks.
*   **As a Librarian**, I want the system to automatically track an off-campus member's 1-year billing cycle and flag them when they are due for renewal, so that I can easily notify them or disable their access if they haven't paid their ₹100 fee.

### 1.3 Book Catalog Management (CRUD)
*   **As a Librarian**, I want to add new books to the digital catalog (with title, author, category, price, and total copies), so that members can easily search and discover them.
*   **As a Librarian**, I want to edit existing book records, so that I can correct typos or reclassify a book's category.
*   **As a Librarian**, I want to mark specific copies of a book as "lost" or "damaged", so that the real-time availability status remains accurate for members searching the catalog.

### 1.4 Issuing, Returning & Fines
*   **As a Librarian**, I want to digitally issue a book to a member's account, so that the system can automatically record the transaction and calculate the strict 10-day due date.
*   **As a Librarian**, I want to process a book return digitally, so that the member's account is immediately cleared to borrow a new book.
*   **As a Librarian**, I want to view an automated list of all overdue books across the library, so that I no longer have to manually scan pages of a physical register.
*   **As a Librarian**, I want the system to automatically calculate the exact fine (0.5x price for damaged, 1.5x price for lost) when I flag a returned book's condition, so that I can eliminate manual math errors.
*   **As a Librarian**, I want to send automated email or web push notifications to members who have overdue books, so that I can easily remind them to return the items.

### 1.5 Reservation Management
*   **As a Librarian**, I want the system to alert me if a newly returned book has an active reservation, so that I can hold it aside for the queued member rather than returning it to the shelf.

### 1.6 Budgeting & Prioritization
*   **As a Librarian**, I want to view a ranked list of new book purchase requests (sorted by member upvotes), so that I can easily prioritize how to spend the ₹10,000 monthly budget based on actual demand.

### 1.7 Community Curation
*   **As a Librarian**, I want to create and manage custom reading lists (e.g., "Top Sci-Fi", "Required Physics Reading"), so that I can highlight these collections on the members' dashboard.
*   **As a Librarian**, I want to review and moderate book reviews submitted by members, so that I can maintain a high-quality, permanent digital display board.

---

## 2. Library Members / Students (Secondary Users)

### 2.1 Authentication & Profile
*   **As a Member**, I want to self-register for a library account, so that I can access digital services without needing a physical card.
*   **As a Member**, I want to securely log in to my portal, so that I can manage my personal reading activity.

### 2.2 Discovery & Search
*   **As a Member**, I want to search the digital catalog using filters (title, author, category), so that I can find books immediately without manually browsing racks.
*   **As a Member**, I want to see the real-time availability of a book (e.g., "Available" vs "All copies issued"), so that I don't waste time looking for a book that isn't on the shelf.

### 2.3 Borrowing Dashboard
*   **As a Member**, I want to view a dashboard of my currently issued books along with their exact due dates, so that I can ensure I return them within the 10-day window.
*   **As a Member**, I want to be able to issue a new book even if I haven't returned my previous ones (up to the maximum limit), so that I am not forced to return books just to "renew" a physical card.
*   **As a Member**, I want to receive email or web push notifications when my issued books become overdue, so that I am reminded to return them promptly.

### 2.4 Digital Reservations
*   **As a Member**, I want to click a "Reserve" button on a book that is currently out of stock, so that I can enter a fair, automated waitlist.
*   **As a Member**, I want to receive an automated notification when my reserved book is returned to the library, so that I can promptly collect it.

### 2.5 Purchase Requests
*   **As a Member**, I want to submit a formal request for a book the library doesn't currently own, so that the librarian knows what I want to read.
*   **As a Member**, I want to upvote existing book requests submitted by other students, so that highly desired books get prioritized for purchase.

### 2.6 Community Engagement
*   **As a Member**, I want to submit a digital rating and written review for a book I have read, so that my feedback is permanently saved and helps future readers.
*   **As a Member**, I want to read historical reviews left by others on a book's detail page, so that I can decide if it's worth reading.

### 2.7 Payments
*   **As a Member**, I want to pay my annual membership renewal fee (₹100 for off-campus) or overdue fines through the application, so that my account remains active for a full rolling year from my exact date of joining.

---

## 3. Campus Management (Tertiary Users)

### 3.1 Reporting
*   **As Campus Management**, I want to view automated high-level reports on library usage (total active members, books issued per month, most active categories), so that I can measure the library's impact and justify the ongoing ₹10,000 budget allocation.
