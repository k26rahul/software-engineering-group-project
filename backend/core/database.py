from core.config import settings
from sqlmodel import SQLModel, Session, create_engine
from typing import Generator

engine = create_engine(settings.database_url, echo=settings.debug)


def create_db_and_tables() -> None:
    """Create all SQLModel tables if they don't exist."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a DB session per request."""
    with Session(engine) as session:
        yield session
