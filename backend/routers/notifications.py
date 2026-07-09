from fastapi import APIRouter

notifications_router = APIRouter(tags=["Notifications"])

# Routes to implement:
#
# GET  /notifications
#   Description: Retrieves all notifications for the authenticated user.
#   Response: list[NotificationResponse]
#
# PATCH  /notifications/{id}/read
#   Description: Marks a specific notification as read.
#   Response: NotificationResponse
