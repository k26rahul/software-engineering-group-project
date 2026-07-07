from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from core.config import settings

engine = create_engine(settings.database_url, echo=settings.debug)


def create_db_and_tables() -> None:
  """Create all SQLModel tables if they don't exist."""
  SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
  """FastAPI dependency that yields a DB session per request."""
  with Session(engine) as session:
    yield session
