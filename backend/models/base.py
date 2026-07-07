from datetime import datetime

from sqlmodel import Field, SQLModel


class IDMixin(SQLModel):
  id: int | None = Field(
    default=None, primary_key=True, description="Unique identifier for this record."
  )


class CreatedAtMixin(SQLModel):
  created_at: datetime = Field(
    default_factory=datetime.utcnow, description="Timestamp when this record was created."
  )


class UpdatedAtMixin(SQLModel):
  updated_at: datetime | None = Field(
    default=None,
    description="Timestamp when this record was last updated. Null until the first update.",
  )
