from fastapi import APIRouter

purchase_requests_router = APIRouter(tags=["Purchase Requests"])

# Routes to implement:
#
# GET  /purchase-requests
#   Description: Returns all purchase requests ranked by upvote count.
#   Response: list[PurchaseRequestResponse]
#
# POST  /purchase-requests
#   Description: Submits a new purchase request on behalf of a member.
#   Request:  CreatePurchaseRequestRequest
#   Response: PurchaseRequestResponse
#
# POST  /purchase-requests/{id}/upvote
#   Description: Adds an upvote from a member to a purchase request, rejecting duplicate votes.
#   Response: PurchaseRequestResponse
#
# PATCH  /purchase-requests/{id}/purchased
#   Description: Librarian-only. Marks a purchase request as purchased.
#   Response: PurchaseRequestResponse
