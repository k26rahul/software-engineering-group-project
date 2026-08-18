# Milestone 4 Deliverables Report

## Table of Contents
- [1. Implemented APIs](#1-implemented-apis)
  - [Authentication](#authentication)
  - [Book Catalog](#book-catalog)
  - [Member Management](#member-management)
  - [Circulation / Transactions](#circulation--transactions)
  - [Reservations](#reservations)
  - [Dashboard & System](#dashboard--system)
- [2. Complete Test Suite Record](#2-complete-test-suite-record)
  - [API Tests](#api-tests)
  - [Core Tests](#core-tests)
- [3. Detailed Test Case Demonstrations](#3-detailed-test-case-demonstrations)
  - [Test Execution Proof](#test-execution-proof)
- [4. User Feedback](#4-user-feedback)
- [5. Plan for Next Sprint (Milestone 5)](#5-plan-for-next-sprint-milestone-5)

<div class="page-break"></div>

## 1. Implemented APIs

### Authentication
* **Register Member**
  * **Endpoint:** `POST /auth/register`
  * **User Story:** US-2.1: As a Member, I want to self-register and securely log in to access digital services and manage my account.
  * **Response Codes:** 201 (Created), 409 (Conflict), 422 (Unprocessable Entity)
* **User Login**
  * **Endpoint:** `POST /auth/login`
  * **User Story:** US-1.1 & US-2.1: Secure login to portal / admin dashboard
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 422 (Unprocessable Entity)
* **User Logout**
  * **Endpoint:** `POST /auth/logout`
  * **User Story:** US-1.1 & US-2.1: Invalidate active session token
  * **Response Codes:** 204 (No Content), 401 (Unauthorized)
* **Change Password**
  * **Endpoint:** `POST /auth/change-password`
  * **User Story:** US-2.1: Account credential management
  * **Response Codes:** 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 422 (Unprocessable Entity)
* **Get Current Profile**
  * **Endpoint:** `GET /auth/me`
  * **User Story:** US-1.1 & US-2.1: Retrieve active user context
  * **Response Codes:** 200 (OK), 401 (Unauthorized)

### Book Catalog
* **List & Filter Books**
  * **Endpoint:** `GET /books`
  * **User Story:** US-1.3 & US-2.2: Search digital catalog and overview inventory
  * **Response Codes:** 200 (OK), 401 (Unauthorized)
* **Add Book**
  * **Endpoint:** `POST /books`
  * **User Story:** US-1.3: Add new book to the digital catalog
  * **Response Codes:** 201 (Created), 401 (Unauthorized), 403 (Forbidden), 422 (Unprocessable Entity)
* **ISBN Auto-fill Lookup**
  * **Endpoint:** `POST /books/isbn-lookup`
  * **User Story:** US-1.3: Scan ISBN barcode to auto-fill metadata
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity)
* **Get Book Details**
  * **Endpoint:** `GET /books/{id}`
  * **User Story:** US-2.2: Real-time copy availability check
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 404 (Not Found)
* **Edit Book Record**
  * **Endpoint:** `PATCH /books/{id}`
  * **User Story:** US-1.3: Update title, author, category metadata
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity)
* **Update Copy Status**
  * **Endpoint:** `PATCH /books/{id}/copies/{copy_id}`
  * **User Story:** US-1.3: Mark copy status as lost or damaged
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity)

### Member Management
* **List Members**
  * **Endpoint:** `GET /members`
  * **User Story:** US-1.2: Member directory filtered by status/role
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Get Member Profile**
  * **Endpoint:** `GET /members/{id}`
  * **User Story:** US-1.2: View digital profile & issue limits
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Approve Registration**
  * **Endpoint:** `PATCH /members/{id}/approve`
  * **User Story:** US-1.2 & US-2.1: Review and approve member account
  * **Response Codes:** 204 (No Content), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict)
* **Reject Registration**
  * **Endpoint:** `PATCH /members/{id}/reject`
  * **User Story:** US-1.2: Review and reject registration
  * **Response Codes:** 204 (No Content), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict)
* **Update Profile**
  * **Endpoint:** `PATCH /members/{id}/profile`
  * **User Story:** US-1.2: Edit contact info and profile details
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity)
* **Borrowing History**
  * **Endpoint:** `GET /members/{id}/history`
  * **User Story:** US-1.2: View complete digital borrowing log
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

### Circulation / Transactions
* **Issue Book Copy**
  * **Endpoint:** `POST /transactions/issue`
  * **User Story:** US-1.4 & US-2.3: Digitally issue book & set due date
  * **Response Codes:** 201 (Created), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 422 (Unprocessable Entity)
* **Return Book Copy**
  * **Endpoint:** `POST /transactions/return`
  * **User Story:** US-1.4: Process return & calculate condition fines
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity)
* **List Overdue Loans**
  * **Endpoint:** `GET /transactions/overdue`
  * **User Story:** US-1.4: Automated overdue loan list across library
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Transaction Detail**
  * **Endpoint:** `GET /transactions/{id}`
  * **User Story:** US-1.4: Inspect borrowing & return transaction record
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Member Issued Items**
  * **Endpoint:** `GET /members/{id}/current-issues`
  * **User Story:** US-2.3: Member dashboard for current issues & deadlines
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

### Reservations
* **Create Waitlist Reserve**
  * **Endpoint:** `POST /reservations`
  * **User Story:** US-2.4: Reserve out-of-stock book waitlist entry
  * **Response Codes:** 201 (Created), 401 (Unauthorized), 404 (Not Found), 409 (Conflict), 422 (Unprocessable Entity)
* **Cancel Reservation**
  * **Endpoint:** `DELETE /reservations/{id}`
  * **User Story:** US-2.4: Withdraw active waitlist reservation
  * **Response Codes:** 204 (No Content), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Reservation Alerts**
  * **Endpoint:** `GET /reservations/alerts`
  * **User Story:** US-1.5: Alert librarian when reserved book is returned
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Member Waitlist**
  * **Endpoint:** `GET /members/{id}/reservations`
  * **User Story:** US-2.4: View personal waitlist queue positions
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)


### Purchase Requests & Budget
* **List Purchase Requests**
  * **Endpoint:** `GET /purchase-requests`
  * **User Story:** US-2.5: Members can view purchase requests.
  * **Response Codes:** 200 (OK), 401 (Unauthorized)
* **Create Purchase Request**
  * **Endpoint:** `POST /purchase-requests`
  * **User Story:** US-2.5: Members can request new books.
  * **Response Codes:** 201 (Created), 401 (Unauthorized), 422 (Unprocessable Entity)
* **Upvote Purchase Request**
  * **Endpoint:** `POST /purchase-requests/{id}/upvote`
  * **User Story:** US-2.5: Members can upvote requests.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 404 (Not Found)
* **Mark Purchase Request as Purchased**
  * **Endpoint:** `PATCH /purchase-requests/{id}/status`
  * **User Story:** US-1.6: Librarian marks book as purchased.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Get Budget Summary**
  * **Endpoint:** `GET /budget`
  * **User Story:** US-1.7: Librarian tracks budget.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Record Expense**
  * **Endpoint:** `POST /budget/expenses`
  * **User Story:** US-1.7: Librarian manually records expense.
  * **Response Codes:** 201 (Created), 401 (Unauthorized), 403 (Forbidden), 422 (Unprocessable Entity)

### Subscriptions & Reports
* **List Subscriptions**
  * **Endpoint:** `GET /subscriptions`
  * **User Story:** US-1.8: Retrieve recurring subscriptions.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Create Subscription**
  * **Endpoint:** `POST /subscriptions`
  * **User Story:** US-1.8: Add a new subscription.
  * **Response Codes:** 201 (Created), 401 (Unauthorized), 403 (Forbidden), 422 (Unprocessable Entity)
* **Update Subscription**
  * **Endpoint:** `PATCH /subscriptions/{id}`
  * **User Story:** US-1.8: Update subscription details.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity)
* **Cancel Subscription**
  * **Endpoint:** `DELETE /subscriptions/{id}`
  * **User Story:** US-1.8: Cancel an active subscription.
  * **Response Codes:** 204 (No Content), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Usage Report**
  * **Endpoint:** `GET /reports/usage`
  * **User Story:** US-3.2: Admin views usage metrics.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Expense Report**
  * **Endpoint:** `GET /reports/expense`
  * **User Story:** US-3.2: Admin views expense report.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Download Report**
  * **Endpoint:** `GET /reports/download/{type}`
  * **User Story:** US-3.2: Download report as CSV.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

### Community & Recommendations
* **Submit Review**
  * **Endpoint:** `POST /books/{id}/reviews`
  * **User Story:** US-2.6: Member submits book review.
  * **Response Codes:** 201 (Created), 401 (Unauthorized), 404 (Not Found), 422 (Unprocessable Entity)
* **Get Book Reviews**
  * **Endpoint:** `GET /books/{id}/reviews`
  * **User Story:** US-2.6: View approved reviews.
  * **Response Codes:** 200 (OK), 404 (Not Found)
* **Delete Review**
  * **Endpoint:** `DELETE /books/reviews/{review_id}`
  * **User Story:** US-1.9: Moderation or self-deletion.
  * **Response Codes:** 204 (No Content), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Moderate Review**
  * **Endpoint:** `PATCH /reviews/{id}/moderate`
  * **User Story:** US-1.9: Librarian moderates review.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **List Reading Lists**
  * **Endpoint:** `GET /reading-lists`
  * **User Story:** US-2.7: Member browses reading lists.
  * **Response Codes:** 200 (OK), 401 (Unauthorized)
* **Get Reading List Details**
  * **Endpoint:** `GET /reading-lists/{id}`
  * **User Story:** US-2.7: View reading list books.
  * **Response Codes:** 200 (OK), 404 (Not Found)
* **Create Reading List**
  * **Endpoint:** `POST /reading-lists`
  * **User Story:** US-1.10: Librarian creates reading list.
  * **Response Codes:** 201 (Created), 401 (Unauthorized), 403 (Forbidden), 422 (Unprocessable Entity)
* **Update Reading List**
  * **Endpoint:** `PATCH /reading-lists/{id}`
  * **User Story:** US-1.10: Librarian updates reading list.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity)
* **Delete Reading List**
  * **Endpoint:** `DELETE /reading-lists/{id}`
  * **User Story:** US-1.10: Librarian deletes reading list.
  * **Response Codes:** 204 (No Content), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Add Book to Reading List**
  * **Endpoint:** `POST /reading-lists/{id}/books`
  * **User Story:** US-1.10: Librarian adds book to list.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Remove Book from Reading List**
  * **Endpoint:** `DELETE /reading-lists/{id}/books/{book_id}`
  * **User Story:** US-1.10: Librarian removes book.
  * **Response Codes:** 204 (No Content), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
* **Get Recommendations**
  * **Endpoint:** `GET /members/{id}/recommendations`
  * **User Story:** US-2.8: Personalized recommendations.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 404 (Not Found)

### Payments
* **Get Pending Fines**
  * **Endpoint:** `GET /payments/fines`
  * **User Story:** US-2.9: Member checks fines.
  * **Response Codes:** 200 (OK), 401 (Unauthorized)
* **Get Payment History**
  * **Endpoint:** `GET /payments/history`
  * **User Story:** US-2.9: Member checks payment history.
  * **Response Codes:** 200 (OK), 401 (Unauthorized)
* **Pay Fine**
  * **Endpoint:** `POST /payments/fines/{fine_id}`
  * **User Story:** US-2.9: Member pays fine.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 404 (Not Found), 422 (Unprocessable Entity)
* **Pay Membership Renewal**
  * **Endpoint:** `POST /payments/membership-renewal`
  * **User Story:** US-2.9: Member renews membership.
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 422 (Unprocessable Entity)

### Dashboard & System
* **Librarian Dashboard**
  * **Endpoint:** `GET /dashboard/librarian`
  * **User Story:** US-1.1, US-1.2 & US-1.4: Metrics, pending approvals, overdue alerts
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Management Dashboard**
  * **Endpoint:** `GET /dashboard/management`
  * **User Story:** US-3.1: Usage analytics & circulation metrics
  * **Response Codes:** 200 (OK), 401 (Unauthorized), 403 (Forbidden)
* **Health Check**
  * **Endpoint:** `GET /health`
  * **User Story:** INFRA-1.0: Infrastructure & API liveness check
  * **Response Codes:** 200 (OK)

---

<div class="page-break"></div>

## 2. Complete Test Suite Record

Below is an exhaustive record of all 61 test cases developed to assure the quality of the backend APIs and core business logic. All tests currently maintain a passing status.

### API Tests
* **`tests/api/test_api_auth.py::test_register_success`** - Verifies that a member is successfully registered and inactive by default. *(Status: Passing)*
* **`tests/api/test_api_auth.py::test_register_duplicate_email`** - Verifies that registering with an existing email returns a 409 Conflict. *(Status: Passing)*
* **`tests/api/test_api_auth.py::test_login_success`** - Verifies that an active user can log in successfully with valid credentials. *(Status: Passing)*
* **`tests/api/test_api_auth.py::test_login_invalid_credentials`** - Verifies that login fails and returns 401 with invalid credentials. *(Status: Passing)*
* **`tests/api/test_api_auth.py::test_login_inactive_user`** - Verifies that an inactive user can log in successfully. *(Status: Passing)*
* **`tests/api/test_api_auth.py::test_get_current_user_me`** - Verifies that the /auth/me endpoint returns the correct profile info. *(Status: Passing)*
* **`tests/api/test_api_auth.py::test_change_password_success`** - Verifies that a user can change their password successfully. *(Status: Passing)*
* **`tests/api/test_api_auth.py::test_change_password_invalid_old_password`** - Verifies that changing password fails if the current password is incorrect. *(Status: Passing)*
* **`tests/api/test_api_auth.py::test_logout_success`** - Verifies that logging out invalidates the user's access token. *(Status: Passing)*
* **`tests/api/test_api_books.py::test_list_books_empty`** - Verify GET /books returns empty list when catalog is empty. *(Status: Passing)*
* **`tests/api/test_api_books.py::test_create_book_as_librarian`** - Verify librarian can add a book to the catalog. *(Status: Passing)*
* **`tests/api/test_api_books.py::test_create_book_as_member_forbidden`** - Verify non-librarian member receives 403 when attempting to add a book. *(Status: Passing)*
* **`tests/api/test_api_books.py::test_get_book_detail_and_not_found`** - Verify retrieving book details and 404 response for non-existent book. *(Status: Passing)*
* **`tests/api/test_api_books.py::test_isbn_lookup`** - Verify ISBN lookup endpoint returns expected auto-fill schema. *(Status: Passing)*
* **`tests/api/test_api_books.py::test_update_book_and_copy_status`** - Verify librarian can update book metadata and copy status. *(Status: Passing)*
* **`tests/api/test_api_dashboard.py::test_get_librarian_dashboard`** - Verify librarian can retrieve dashboard metrics and alerts. *(Status: Passing)*
* **`tests/api/test_api_dashboard.py::test_get_management_dashboard`** - Verify campus management can retrieve dashboard metrics and budget stats. *(Status: Passing)*
* **`tests/api/test_api_members.py::test_list_members_as_librarian`** - Verify librarian can list members. *(Status: Passing)*
* **`tests/api/test_api_members.py::test_list_members_as_member_forbidden`** - Verify non-librarian member cannot list member directory. *(Status: Passing)*
* **`tests/api/test_api_members.py::test_get_member_detail`** - Verify retrieving profile details for a member. *(Status: Passing)*
* **`tests/api/test_api_members.py::test_approve_and_reject_member`** - Verify librarian can approve and reject a member account. *(Status: Passing)*
* **`tests/api/test_api_members.py::test_update_member_profile`** - Verify updating a member's profile. *(Status: Passing)*
* **`tests/api/test_api_reservations.py::test_create_and_cancel_reservation`** - Verify member creating and canceling a reservation. *(Status: Passing)*
* **`tests/api/test_api_reservations.py::test_get_reservation_alerts_as_librarian`** - Verify librarian can fetch reservation alerts. *(Status: Passing)*
* **`tests/api/test_api_transactions.py::test_issue_and_return_book`** - Verify issuing a book copy to a member and returning it. *(Status: Passing)*
* **`tests/api/test_api_transactions.py::test_get_overdue_transactions`** - Verify overdue transactions list endpoint returns 200. *(Status: Passing)*
* **`tests/api/test_api_transactions.py::test_issue_limit_exceeded`** - Verify that issuing a book fails if the member exceeds their max issue limit. *(Status: Passing)*


* **`tests/api/test_api_budget_reports.py::test_get_budget_summary`** - Verifies retrieving the budget summary. *(Status: Passing)*
* **`tests/api/test_api_budget_reports.py::test_record_expense`** - Verifies librarian can record expenses. *(Status: Passing)*
* **`tests/api/test_api_budget_reports.py::test_record_expense_unauthorized`** - Verifies unauthorized users cannot record expenses. *(Status: Passing)*
* **`tests/api/test_api_budget_reports.py::test_get_usage_report`** - Verifies retrieving usage reports. *(Status: Passing)*
* **`tests/api/test_api_budget_reports.py::test_get_expense_report`** - Verifies retrieving expense reports. *(Status: Passing)*
* **`tests/api/test_api_budget_reports.py::test_download_report`** - Verifies report downloading API. *(Status: Passing)*
* **`tests/api/test_api_community.py::test_submit_and_list_reviews`** - Verifies submitting and listing reviews. *(Status: Passing)*
* **`tests/api/test_api_community.py::test_delete_review`** - Verifies review deletion functionality. *(Status: Passing)*
* **`tests/api/test_api_community.py::test_reading_lists`** - Verifies CRUD operations for reading lists. *(Status: Passing)*
* **`tests/api/test_api_payments.py::test_get_pending_fines`** - Verifies listing pending fines. *(Status: Passing)*
* **`tests/api/test_api_payments.py::test_pay_fine`** - Verifies paying a fine. *(Status: Passing)*
* **`tests/api/test_api_payments.py::test_pay_membership_renewal`** - Verifies membership renewal payments. *(Status: Passing)*
* **`tests/api/test_api_payments.py::test_get_payment_history`** - Verifies payment history retrieval. *(Status: Passing)*
* **`tests/api/test_api_purchase_requests.py::test_create_and_list_purchase_requests`** - Verifies creating and listing purchase requests. *(Status: Passing)*
* **`tests/api/test_api_purchase_requests.py::test_upvote_purchase_request`** - Verifies upvoting purchase requests. *(Status: Passing)*
* **`tests/api/test_api_purchase_requests.py::test_mark_purchase_request_purchased_as_member`** - Verifies members cannot mark requests purchased. *(Status: Passing)*
* **`tests/api/test_api_purchase_requests.py::test_mark_purchase_request_purchased_as_librarian`** - Verifies librarian marking request as purchased. *(Status: Passing)*
* **`tests/api/test_api_recommendations.py::test_get_recommendations_success`** - Verifies fetching book recommendations. *(Status: Passing)*
* **`tests/api/test_api_recommendations.py::test_get_recommendations_unauthorized`** - Verifies unauthorized users cannot fetch recommendations. *(Status: Passing)*
* **`tests/api/test_api_subscriptions.py::test_subscriptions`** - Verifies subscription management. *(Status: Passing)*

### Core Tests
* **`tests/core/test_core_auth.py::test_hash_and_verify_password`** - Verifies that passwords can be hashed and verified correctly. *(Status: Passing)*
* **`tests/core/test_core_auth.py::test_create_access_token`** - Verifies that signed JWT access tokens can be created. *(Status: Passing)*
* **`tests/core/test_core_auth.py::test_decode_token_success`** - Verifies that a valid JWT token is successfully decoded. *(Status: Passing)*
* **`tests/core/test_core_auth.py::test_decode_token_invalid`** - Verifies that decoding an invalid token raises a JWTError. *(Status: Passing)*
* **`tests/core/test_core_auth.py::test_decode_token_missing_sub`** - Verifies that decoding a token without a subject claim raises a JWTError. *(Status: Passing)*
* **`tests/core/test_core_auth.py::test_decode_token_expired`** - Verifies that decoding an expired token raises a JWTError. *(Status: Passing)*
* **`tests/core/test_core_dependencies.py::test_get_current_user_success`** - Verifies get_current_user successfully returns the user for a valid token. *(Status: Passing)*
* **`tests/core/test_core_dependencies.py::test_get_current_user_blocklisted`** - Verifies get_current_user raises a 401 Unauthorized for blocklisted tokens. *(Status: Passing)*
* **`tests/core/test_core_dependencies.py::test_get_current_user_invalid_token`** - Verifies get_current_user raises a 401 Unauthorized for malformed tokens. *(Status: Passing)*
* **`tests/core/test_core_dependencies.py::test_get_current_user_not_found`** - Verifies get_current_user raises a 401 Unauthorized if the user does not exist. *(Status: Passing)*
* **`tests/core/test_core_dependencies.py::test_get_current_user_inactive`** - Verifies get_current_user successfully returns the user even if they are inactive. *(Status: Passing)*
* **`tests/core/test_core_dependencies.py::test_require_role_success`** - Verifies role requirement check succeeds when the user has the correct role and is active. *(Status: Passing)*
* **`tests/core/test_core_dependencies.py::test_require_role_forbidden`** - Verifies role requirement check raises a 403 Forbidden when the user has a different role. *(Status: Passing)*
* **`tests/core/test_core_dependencies.py::test_require_role_inactive`** - Verifies role requirement check raises a 403 Forbidden when the user is inactive. *(Status: Passing)*

---

<div class="page-break"></div>

## 3. Detailed Test Case Demonstrations

The following 10 detailed cases are selected as representative examples to demonstrate our testing process, including the specific inputs, expected vs. actual outputs, and how testing helps us identify and resolve bugs (as seen in the failing case demonstrations).

### Test Execution Proof
Below are representative screenshots from the VS Code integrated test explorer demonstrating our test execution process. The first screenshot shows two test cases failing (when bugs are introduced), and the second shows all tests passing successfully after the code is corrected.

![Failing Test Screenshot](https://raw.githubusercontent.com/k26rahul/software-testing/main/test_failure.png)

![Passing Test Screenshot](https://raw.githubusercontent.com/k26rahul/software-testing/main/test_success.png)

**Test Case 1: Successful Member Registration**
1. **API endpoint being tested:** `POST /auth/register`
2. **Input:** JSON payload with valid `email`, `password`, `name`, and `membership_type`.
3. **Expected output:** HTTP `201 Created` with a JWT `access_token` and `user.is_active` set to `false`.
4. **Actual output:** HTTP `201 Created` with the correct JWT token payload.
5. **Result/Status:** Passed

**Test Case 2: Duplicate Email Registration (Failing Case Demonstration)**
*Note: This documents a bug caught during testing where duplicate emails triggered an internal server error instead of a validation conflict.*
1. **API endpoint being tested:** `POST /auth/register`
2. **Input:** JSON payload with an email that already exists in the database.
3. **Expected output:** HTTP `409 Conflict` with detail message "Email already registered."
4. **Actual output:** HTTP `500 Internal Server Error` (Unhandled SQLAlchemy IntegrityError).
5. **Result/Status:** Failed
6. **Resolution:** We corrected the `services/auth.py` logic to explicitly check for existing users by email before inserting, and raise an `HTTPException` with status `409` if a match is found. Re-testing this case now passes.

**Test Case 3: Successful Login**
1. **API endpoint being tested:** `POST /auth/login`
2. **Input:** JSON payload with valid `email` and `password`.
3. **Expected output:** HTTP `200 OK` with a valid JWT `access_token` and `token_type` "bearer".
4. **Actual output:** HTTP `200 OK` with the expected token payload.
5. **Result/Status:** Passed

**Test Case 4: Catalog Search and Filtering**
1. **API endpoint being tested:** `GET /books`
2. **Input:** Query parameter `query="science"` to search for books containing "science" in the title or category.
3. **Expected output:** HTTP `200 OK` with a list of `BookSummaryResponse` objects filtered by the search term.
4. **Actual output:** HTTP `200 OK` returning exactly the subset of books matching the query.
5. **Result/Status:** Passed

**Test Case 5: Librarian Issues Book to Member**
1. **API endpoint being tested:** `POST /transactions/issue`
2. **Input:** Valid authentication token for a Librarian, and a JSON payload with `member_id` and `book_id`.
3. **Expected output:** HTTP `201 Created` with a `TransactionResponse` showing the issued copy ID and exact return deadline.
4. **Actual output:** HTTP `201 Created` with the newly recorded transaction details.
5. **Result/Status:** Passed

**Test Case 6: Issue Limit Exceeded (Failing Case Demonstration)**
*Note: This documents a bug caught during testing where members could borrow more books than their allowed limit.*
1. **API endpoint being tested:** `POST /transactions/issue`
2. **Input:** Librarian attempts to issue a 6th book to a member whose active issue limit is only 5.
3. **Expected output:** HTTP `409 Conflict` indicating the member has reached their borrowing limit.
4. **Actual output:** HTTP `201 Created` (The book was successfully issued, violating business rules).
5. **Result/Status:** Failed
6. **Resolution:** We added a validation check in `services/transactions.py` to compare the member's current active issues count against their allowed limit before creating the transaction. If exceeded, it raises a `409 HTTPException`. Re-testing now passes.

**Test Case 7: Returning a Book and Calculating Fines**
1. **API endpoint being tested:** `POST /transactions/return`
2. **Input:** JSON payload with the `transaction_id` of an active loan and a condition flag of `DAMAGED`.
3. **Expected output:** HTTP `200 OK` showing the transaction status as `RETURNED_DAMAGED` and calculating the fine amount based on 0.5x of the book's price.
4. **Actual output:** HTTP `200 OK` with the correct fine calculation reflected in the response payload.
5. **Result/Status:** Passed

**Test Case 8: Member Waitlist Reservation**
1. **API endpoint being tested:** `POST /reservations`
2. **Input:** Member token and JSON payload containing the `book_id` for a book where all physical copies are currently issued.
3. **Expected output:** HTTP `201 Created` with a `ReservationResponse` confirming the member's queue position.
4. **Actual output:** HTTP `201 Created` and successfully entering the waitlist queue.
5. **Result/Status:** Passed

**Test Case 9: Fetch Librarian Dashboard Alerts**
1. **API endpoint being tested:** `GET /dashboard/librarian`
2. **Input:** Valid authentication token for a Librarian user.
3. **Expected output:** HTTP `200 OK` containing aggregated system metrics, the count of pending member approvals, and any overdue loan alerts.
4. **Actual output:** HTTP `200 OK` with accurately aggregated statistics across the catalog and active loans.
5. **Result/Status:** Passed

**Test Case 10: View Current Profile (Authentication Check)**
1. **API endpoint being tested:** `GET /auth/me`
2. **Input:** Valid authentication token (Bearer) in the Authorization header.
3. **Expected output:** HTTP `200 OK` with the `UserProfileResponse` detailing the active user's ID, name, email, and role.
4. **Actual output:** HTTP `200 OK` with matching profile information.
5. **Result/Status:** Passed

---

## 4. User Feedback

During the demonstration of the Sprint 1 and Sprint 2 features, we collected the following feedback from our primary stakeholders:

* **From the Librarian:**
  * *"The digital issuing and returning workflow is a massive time-saver. Finding overdue books is now instant via the dashboard, whereas I previously had to manually scan through months of physical register entries."*
  * *"The automated waitlist reservation system completely resolves the confusion of handling verbal hold requests from multiple students for the same book."*
  * *"Seeing a consolidated view of pending member approvals on the dashboard is very intuitive."*
  * *"The budget and expense tracking features are fantastic. I no longer need to manage a separate Excel sheet for purchases and subscriptions."*
  * *"Being able to quickly approve or reject member reviews ensures our catalog remains professional."*

* **From Library Members (Students):**
  * *"Searching the digital catalog with filters saves a tremendous amount of time compared to physically browsing the library racks just to find out a book is unavailable."*
  * *"The member dashboard is great because it clearly displays the exact due dates for my borrowed books, which helps me avoid unexpected late fines."*
  * *"Being able to self-register online is much easier than filling out a paper application form in person."*
  * *"I love the personalized book recommendations and the ability to upvote purchase requests for new materials."*
  * *"Paying fines and renewing my membership digitally is much more convenient than paying cash at the desk."*

* **From Campus Management:**
  * *"The administrative dashboard provides immediate visibility into the library's active circulation and user base, which is very helpful for tracking engagement."*
  * *"The automatically generated usage and expense reports make auditing our monthly allowance of ₹10,000 straightforward and transparent."*

---

<div class="page-break"></div>

## 5. Plan for Next Sprint (Milestone 5)

With the completion of Sprint 2, our backend features are fully implemented, spanning from core functionalities to community features, financial tracking, and personalization. 
Our primary focus for Milestone 5 (Final Submission & Handoff) will be:

* **Frontend Integration Complete**: Integrating the remaining Sprint 2 APIs (Budgets, Payments, Recommendations, Reviews) into the frontend.
* **End-to-End Testing**: Validating full workflows starting from the UI down to the database.
* **Documentation & Handoff**: Finalizing the README instructions, preparing the final presentation slides, and recording the complete project video demo as requested in the project specification.
* **Bug Fixes & Refinement**: Addressing any edge cases discovered during final testing and optimizing UI/UX.
