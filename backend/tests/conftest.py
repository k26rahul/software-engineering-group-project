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
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="client")
def client_fixture(db_session: Session):
    def get_session_override():
        return db_session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="normal_user")
def normal_user_fixture(db_session: Session) -> User:
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
