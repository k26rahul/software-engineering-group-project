"""Router: Notifications.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

notifications_router = APIRouter(tags=["Notifications"])

# Routes to implement:
#
# GET  /notifications
#   Description: Retrieves all notifications for the authenticated user.
#
# PATCH  /notifications/{id}/read
#   Description: Marks a specific notification as read.
