import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from core.auth import hash_password, token_blocklist
from core.database import get_session
from main import app
from models.enums import MemberApprovalStatus, UserRole
from models.user import User


@pytest.fixture(autouse=True)
def clear_blocklist():
  """Clears the token blocklist before each test execution."""
  token_blocklist.clear()


# Use an in-memory SQLite database for testing
sqlite_url = "sqlite:///:memory:"
engine = create_engine(
  sqlite_url,
  connect_args={"check_same_thread": False},
  poolclass=StaticPool,
)


@pytest.fixture(name="db_session")
def session_fixture():
  """Creates a database session with a clean SQLite memory database for the test."""
  SQLModel.metadata.create_all(engine)
  with Session(engine) as session:
    yield session
  SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="client")
def client_fixture(db_session: Session):
  """Provides a FastAPI test client configured with database overrides."""

  def get_session_override():
    """Overrides the database session dependency to return the test session."""
    return db_session

  app.dependency_overrides[get_session] = get_session_override
  client = TestClient(app)
  yield client
  app.dependency_overrides.clear()


@pytest.fixture(name="normal_user")
def normal_user_fixture(db_session: Session) -> User:
  """Creates and returns an active approved member user in the database."""
  user = User(
    email="member@test.com",
    name="Test Member",
    password_hash=hash_password("password123"),
    role=UserRole.MEMBER,
    is_active=True,
    approval_status=MemberApprovalStatus.APPROVED,
    max_issue_limit=3,
  )
  db_session.add(user)
  db_session.commit()
  db_session.refresh(user)
  return user


@pytest.fixture(name="inactive_user")
def inactive_user_fixture(db_session: Session) -> User:
  """Creates and returns an inactive pending member user in the database."""
  user = User(
    email="inactive@test.com",
    name="Inactive User",
    password_hash=hash_password("password123"),
    role=UserRole.MEMBER,
    is_active=False,
    approval_status=MemberApprovalStatus.PENDING,
    max_issue_limit=3,
  )
  db_session.add(user)
  db_session.commit()
  db_session.refresh(user)
  return user


@pytest.fixture(name="librarian_user")
def librarian_user_fixture(db_session: Session) -> User:
  """Creates and returns an active approved librarian user in the database."""
  user = User(
    email="librarian@test.com",
    name="Test Librarian",
    password_hash=hash_password("password123"),
    role=UserRole.LIBRARIAN,
    is_active=True,
    approval_status=MemberApprovalStatus.APPROVED,
    max_issue_limit=10,
  )
  db_session.add(user)
  db_session.commit()
  db_session.refresh(user)
  return user


@pytest.fixture(name="normal_user_token")
def normal_user_token_fixture(client: TestClient, normal_user: User) -> str:
  """Retrieves a valid JWT access token for the normal member user."""
  response = client.post(
    "/auth/login",
    json={"email": normal_user.email, "password": "password123"},
  )
  return response.json()["access_token"]


@pytest.fixture(name="librarian_user_token")
def librarian_user_token_fixture(client: TestClient, librarian_user: User) -> str:
  """Retrieves a valid JWT access token for the librarian user."""
  response = client.post(
    "/auth/login",
    json={"email": librarian_user.email, "password": "password123"},
  )
  return response.json()["access_token"]

