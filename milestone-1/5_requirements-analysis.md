# Requirements Analysis

This document maps the identified user requirements to the system features being built. Each module is grounded in a real pain point discovered during requirements gathering, and the features listed are the direct solutions to those problems.

---

## 1. Authentication & Identity Module

*The library identifies members through physical library cards, but there is no digital access control — member records, approval status, and borrowing privileges are all managed manually.*

- **Secure Access** ➔ Role-based routing to the administrative (Librarian), member (Student), or management (Campus Management) dashboard upon login.
- **Member Onboarding** ➔ Self-registration for students ➔ Librarian approval queue ➔ Member notified on approval or rejection.

---

## 2. Membership Management Module

*Member records are maintained on physical passbooks with a ~20-entry limit. Off-campus member billing is tracked manually with no automated reminders.*

- **Digital Profiles** ➔ Replaces physical passbooks. Tracks complete borrowing history, outstanding fines, and active issue limits.
- **Billing & Renewals** ➔ Automatically tracks the rolling 1-year cycle for off-campus members ➔ Flags the librarian when renewal is due.
- **In-App Payments** ➔ Facilitates payments for annual membership renewals and outstanding fines directly within the application.

---

## 3. Catalog & Inventory Module

*The catalog exists across multiple physical registers with no real-time availability — the librarian and members have no way to know if a book is on the shelf or issued out.*

- **Catalog Management** ➔ Librarian can add, edit, and categorize the library's 5,000+ books.
- **ISBN Barcode Scanning** ➔ Librarian can scan a book's ISBN barcode when adding it to the catalog ➔ System auto-fills the title, author, and genre from an online ISBN database ➔ Reduces manual data entry during the initial setup.
- **Copy-Level Tracking** ➔ Librarian can mark specific copies as lost or damaged ➔ Keeps real-time availability accurate for all members.
- **Book Search & Discovery** ➔ Members can search by title, author, or category ➔ View real-time availability (e.g., "Available" vs. "All copies issued").

---

## 4. Circulation (Issue/Return) Module

*Every issue and return is recorded manually in a physical register. Finding an old entry, tracking overdue items, and calculating fines all require going through pages of handwritten records.*

- **Digital Issue/Return** ➔ Logs transactions instantly and clears member accounts upon return.
- **Deadline Tracking** ➔ Librarian sets a return deadline (5, 10, 20, or 30 days) at the time of issue based on the item type and demand ➔ System records and tracks the exact due date automatically.
- **Automated Fines** ➔ Calculates exact penalties (0.5x price for damaged, 1.5x price for lost) based on the book's base price when a condition is flagged on return.
- **Overdue Alerts** ➔ Maintains a list of all overdue books across the library ➔ Sends automated email or web push notifications to members with overdue items.

---

## 5. Reservation & Request Module

*There is no formal reservation system. The librarian has to mentally remember who asked for a book first, leading to confusion and unfair outcomes. Book purchase requests are verbal with no visibility.*

- **Digital Waitlist** ➔ Members place holds on out-of-stock books ➔ Enter an automated first-in, first-out queue ➔ Can cancel their reservation at any time.
- **Availability Alerts** ➔ System prompts the librarian when a returned book has an active reservation ➔ Automatically notifies the queued member to collect.
- **Book Purchase Requests** ➔ Members suggest new books ➔ Community upvotes ➔ Librarian views a ranked list to prioritize the monthly budget ➔ Marks requests as "Purchased" once fulfilled.

---

## 6. Community & Curation Module

*Member reviews are pinned to a physical display board and lost when rotated out. Reading lists are kept in a register and are hard to update or share.*

- **Digital Reviews** ➔ Members submit ratings and written reviews ➔ Librarian moderates ➔ Displayed permanently on each book's detail page.
- **Reading Lists** ➔ Librarian creates and manages themed collections (e.g., "Best Sci-Fi", "Required Physics Reading") ➔ Displayed on member dashboards.

---

## 7. Recommendations Module

*Members have no way to discover books beyond physically browsing the racks or asking the librarian.*

- **Reading History Tracking** ➔ System tracks the genres and authors from each member's borrowing history.
- **Personalized Suggestions** ➔ Surfaces books from matching genres and authors that the member has not yet read ➔ Displayed on the member dashboard as "Based on your reading".

---

## 8. Budget & Subscription Module

*The librarian manually tallies all subscription costs and book purchases at month-end. There is no running total, making it easy to overspend without realizing it.*

- **Subscription Management** ➔ Librarian adds, modifies, or cancels newspaper and magazine subscriptions (title, copies, price per copy, frequency).
- **Automatic Monthly Cost Calculation** ➔ System calculates the total subscription payout each month based on all active subscriptions and their frequencies.
- **Book Purchase Entry** ➔ Librarian manually enters new book purchases (title, copies, price per copy, vendor) ➔ Cost is immediately added to the month's running total.
- **Running Budget Tracker** ➔ Displays real-time utilization of the ₹10,000 monthly allowance as expenses are added.
- **Month-End Expense Report** ➔ Generates an itemized breakdown (newspapers, magazines, books, vendor totals) ➔ Available on the Campus Management dashboard for reimbursement approval and download.

---

## 9. Reporting Module

*Campus management has no way to view library usage data without asking the librarian directly. Budget reimbursement approvals are based on manually compiled totals.*

- **Library Usage Reports** ➔ Generates metrics such as total active members, books issued per month, and most popular categories ➔ Available for Campus Management to view and download.

---

## Special / USP Features

Features that go beyond the basics.

- **Book Recommendation System** ➔ The library never had a way to suggest books to members. This does it automatically, based on what each member has already read — no effort from the librarian or the member.
- **Newspaper & Magazine Subscription Tracking** ➔ The librarian currently calculates monthly payout for 10-15 subscriptions by hand, accounting for different frequencies. This removes that entirely.
- **Community Book Purchase Requests with Upvoting** ➔ Previously, requests were verbal and often forgotten. Now members can see what others have requested and vote on it — the librarian gets a ranked list instead of relying on memory.
- **Reading Lists Curated by the Librarian** ➔ Gives the librarian a creative tool — she can highlight books by theme and have them show up on member dashboards. Encourages reading beyond just what members already know.
- **ISBN Barcode Scanning** ➔ Entering 5,000 books into a catalog manually would be a huge task. Scanning a barcode and auto-filling the details makes this significantly faster and less error-prone.
