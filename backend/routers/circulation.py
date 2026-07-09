from fastapi import APIRouter

circulation_router = APIRouter(tags=["Circulation"])

# Routes to implement:
#
# POST  /transactions/issue
#   Description: Issues a book copy to a member with a specific deadline.
#   Request:  IssueBookRequest
#   Response: TransactionResponse
#
# POST  /transactions/return
#   Description: Processes the return of a book and calculates fines if damaged or lost.
#   Request:  ReturnBookRequest
#   Response: TransactionResponse
#
# GET  /transactions/{id}
#   Description: Retrieves details of a specific borrowing transaction.
#   Response: TransactionResponse
#
# GET  /transactions/overdue
#   Description: Retrieves a list of all currently overdue borrowing transactions.
#   Response: list[TransactionResponse]
#
# GET  /members/{id}/current-issues
#   Description: Retrieves a list of all books currently issued to a specific member.
#   Response: list[TransactionResponse]
