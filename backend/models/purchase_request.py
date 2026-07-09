from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from models.user import User

from models.base import CreatedAtMixin, IDMixin
from models.enums import RequestStatus

# ── Models ────────────────────────────────────────────────────────────────────


class PurchaseRequest(IDMixin, CreatedAtMixin, table=True):
    """Represents a member's request to the library to purchase a specific book."""

    member_id: int = Field(
        foreign_key="user.id", description="ID of the member making the request."
    )
    title: str = Field(description="Title of the requested book.")
    author: str | None = Field(default=None, description="Author of the requested book.")
    description: str | None = Field(
        default=None, description="Additional details about the request."
    )
    upvote_count: int = Field(
        default=0, description="Number of upvotes received from other members."
    )
    status: RequestStatus = Field(
        default=RequestStatus.PENDING, description="Status of the purchase request."
    )
    purchased_at: datetime | None = Field(default=None, description="When the book was purchased.")

    member: "User" = Relationship(back_populates="purchase_requests")
    votes: list["PurchaseRequestVote"] = Relationship(back_populates="request")


class PurchaseRequestVote(IDMixin, CreatedAtMixin, table=True):
    """
    Represents a vote by a member on a purchase request.
    Prevents a member from double-voting on the same request.
    """

    __table_args__ = (UniqueConstraint("request_id", "member_id", name="uq_request_member_vote"),)

    request_id: int = Field(
        foreign_key="purchaserequest.id", description="ID of the purchase request being voted on."
    )
    member_id: int = Field(foreign_key="user.id", description="ID of the member voting.")

    request: "PurchaseRequest" = Relationship(back_populates="votes")
    member: "User" = Relationship(back_populates="purchase_request_votes")


# ── Schemas ───────────────────────────────────────────────────────────────────


class CreatePurchaseRequestRequest(SQLModel):
    title: str
    author: str | None = None
    description: str | None = None


class PurchaseRequestResponse(SQLModel):
    id: int
    title: str
    author: str | None
    description: str | None
    upvote_count: int
    status: RequestStatus
    created_at: datetime
