"""Router: Circulation.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

circulation_router = APIRouter(tags=["Circulation"])

# Routes to implement:
#
# POST  /transactions/issue
#   Description: Issues a book copy to a member with a specific deadline.
#
# POST  /transactions/return
#   Description: Processes the return of a book and calculates fines if damaged or lost.
#
# GET  /transactions/{id}
#   Description: Retrieves details of a specific borrowing transaction.
#
# GET  /transactions/overdue
#   Description: Retrieves a list of all currently overdue borrowing transactions.
#
# GET  /members/{id}/current-issues
#   Description: Retrieves a list of all books currently issued to a specific member.
