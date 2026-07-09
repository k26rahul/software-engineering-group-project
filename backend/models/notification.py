from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from models.user import User

from models.base import CreatedAtMixin, IDMixin
from models.enums import NotificationType


# ── Models ────────────────────────────────────────────────────────────────────


class Notification(IDMixin, CreatedAtMixin, table=True):
    """Represents an alert or message sent to a user."""

    recipient_id: int = Field(
        foreign_key="user.id", description="ID of the user receiving the notification."
    )
    type: NotificationType = Field(description="Type/category of the notification.")
    message: str = Field(description="Content of the notification.")
    is_read: bool = Field(default=False, description="Whether the user has read the notification.")

    recipient: "User" = Relationship(back_populates="notifications")


# ── Schemas ───────────────────────────────────────────────────────────────────


class NotificationResponse(SQLModel):
    id: int
    type: NotificationType
    message: str
    is_read: bool
    created_at: datetime
