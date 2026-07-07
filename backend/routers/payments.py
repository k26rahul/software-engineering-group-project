"""Router: Payments.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

payments_router = APIRouter(tags=["Payments"])

# Routes to implement:
#
# POST  /payments
#   Description: Processes a payment for a fine or off-campus membership fee.
#
# GET  /members/{id}/payments
#   Description: Retrieves the complete payment history for a specific member.
