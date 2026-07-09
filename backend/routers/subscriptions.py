from fastapi import APIRouter

subscriptions_router = APIRouter(tags=["Subscriptions"])

# Routes to implement:
#
# GET  /subscriptions
#   Description: Retrieves all recurring subscriptions.
#   Response: list[SubscriptionResponse]
#
# POST  /subscriptions
#   Description: Adds a new recurring subscription for a newspaper or magazine.
#   Request:  CreateSubscriptionRequest
#   Response: SubscriptionResponse
#
# PATCH  /subscriptions/{id}
#   Description: Updates details of an existing subscription.
#   Request:  UpdateSubscriptionRequest
#   Response: SubscriptionResponse
#
# DELETE  /subscriptions/{id}
#   Description: Cancels an active subscription.
