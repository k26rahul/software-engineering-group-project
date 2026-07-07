"""Router: Purchase Requests.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

requests_router = APIRouter(tags=["Purchase Requests"])

# Routes to implement:
#
# GET  /purchase-requests
#   Description: Returns all purchase requests ranked by upvote count.
#
# POST  /purchase-requests
#   Description: Submits a new purchase request on behalf of a member.
#
# POST  /purchase-requests/{id}/upvote
#   Description: Adds an upvote from a member to a purchase request, rejecting duplicate votes.
#
# PATCH  /purchase-requests/{id}/purchased
#   Description: Librarian-only. Marks a purchase request as purchased.
