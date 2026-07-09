from fastapi import APIRouter

payments_router = APIRouter(tags=["Payments"])

# Routes to implement:
#
# POST  /payments
#   Description: Processes a payment for a fine or off-campus membership fee.
#   Request:  ProcessPaymentRequest
#   Response: PaymentResponse
#
# GET  /members/{id}/payments
#   Description: Retrieves the complete payment history for a specific member.
#   Response: list[PaymentResponse]
