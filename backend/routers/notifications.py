from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from core.dependencies import CurrentUserDep, SessionDep
from models.notification import Notification
from schemas.notification import NotificationResponse

notifications_router = APIRouter(tags=["Notifications"])

@notifications_router.get("/notifications", response_model=list[NotificationResponse])
def get_notifications(
  session: SessionDep,
  current_user: CurrentUserDep,
):
  """Retrieves all notifications for the authenticated user."""
  statement = select(Notification).where(Notification.recipient_id == current_user.id)
  return session.exec(statement).all()

@notifications_router.patch("/notifications/{id}/read", response_model=NotificationResponse)
def mark_notification_read(
  id: int,
  session: SessionDep,
  current_user: CurrentUserDep,
):
  """Marks a specific notification as read."""
  notification = session.get(Notification, id)
  if not notification:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
  if notification.recipient_id != current_user.id:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your notification")
  
  notification.is_read = True
  session.add(notification)
  session.commit()
  session.refresh(notification)
  return notification
