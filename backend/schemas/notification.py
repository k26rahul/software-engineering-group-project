from datetime import datetime

from sqlmodel import SQLModel

from models.enums import NotificationType


class NotificationResponse(SQLModel):
  id: int
  type: NotificationType
  message: str
  is_read: bool
  created_at: datetime
