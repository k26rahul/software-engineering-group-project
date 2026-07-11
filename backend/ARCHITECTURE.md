# Backend Architecture

> **For coding agents and PR reviewers:** This document is the authoritative reference for backend architecture. When writing or reviewing code, enforce every rule described here without exception. Flag any violation as a review finding.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | FastAPI |
| Language | Python 3.10 |
| ORM | SQLModel (SQLAlchemy + Pydantic) |
| Database | SQLite (`library.db`) |
| Auth | JWT via `python-jose`, passwords via `pwdlib[bcrypt]` |
| Testing | pytest + `httpx2` (FastAPI `TestClient`) |
| Linting / Formatting | Ruff |
| Package Manager | uv |

---

## Layer Architecture

The backend is strictly layered. Each layer has a single responsibility and a defined boundary.

```
HTTP Request
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  Routers  (routers/)                                    │
│  · Declare HTTP endpoints only                          │
│  · Parse request bodies using models/ schemas           │
│  · Delegate all logic to services/                      │
│  · Return response using models/ schemas                │
│  · No direct DB access, no business logic               │
└────────────────────────┬────────────────────────────────┘
                         │ calls
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Services  (services/)                                  │
│  · Contain all business logic                           │
│  · All database mutations happen here                   │
│  · Raise HTTPException for business rule violations     │
│  · Receive Session and model instances via arguments    │
└────────────────────────┬────────────────────────────────┘
                         │ reads/writes
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Models  (models/)                                      │
│  · Define DB tables (SQLModel, table=True)              │
│  · Define request/response schemas (plain SQLModel)     │
│  · May contain small self-contained model methods       │
└─────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│  Core  (core/)                                          │
│  · Cross-cutting concerns used by all layers            │
│  · Config, DB engine/session, auth utilities,           │
│    FastAPI dependencies, DB seeding                     │
└─────────────────────────────────────────────────────────┘
```

---

## Directory Reference

### `main.py`

Application entry point. Responsibilities:
- Creates the `FastAPI` app via `create_app()`.
- Registers CORS middleware (allows `localhost:5173` and `localhost:5174`).
- Registers all routers via `app.include_router(...)`.
- Runs `create_db_and_tables()` and `seed_default_users()` on startup via the `lifespan` context manager.

**Rule:** Only router registration, middleware configuration, and startup/shutdown hooks belong here. No business logic.

---

### `core/`

Cross-cutting infrastructure. Imported freely by routers, services, and tests.

| File | Responsibility |
|---|---|
| `config.py` | `Settings` class (via `pydantic-settings`). Reads `.env`. Single `settings` singleton exported. Contains: `database_url`, `secret_key`, `algorithm`, `access_token_expire_minutes`, `debug`. |
| `database.py` | SQLModel engine, `create_db_and_tables()`, and `get_session()` generator dependency. |
| `auth.py` | Low-level auth utilities: `hash_password`, `verify_password`, `create_access_token`, `decode_token`. Holds the in-memory `token_blocklist: set[str]`. |
| `dependencies.py` | FastAPI `Depends`-based dependencies injected into routers. |
| `seeding.py` | Seeds default dev users (librarian, member, management) on first startup if the DB is empty. |

#### `core/dependencies.py` - Dependency Types

| Name | Type | Resolves to |
|---|---|---|
| `SessionDep` | `Annotated[Session, Depends(get_session)]` | DB session per request |
| `TokenDep` | `Annotated[str, Depends(oauth2_scheme)]` | Raw JWT string from `Authorization` header |
| `CurrentUserDep` | `Annotated[User, Depends(get_current_user)]` | Authenticated `User`, blocklist + DB checked |
| `LibrarianDep` | `Annotated[User, _require_role(LIBRARIAN)]` | Authenticated + role-enforced `User` |
| `MemberDep` | `Annotated[User, _require_role(MEMBER)]` | Authenticated + role-enforced `User` |
| `ManagementDep` | `Annotated[User, _require_role(CAMPUS_MANAGEMENT)]` | Authenticated + role-enforced `User` |
| `StaffDep` | `Annotated[User, _require_role(LIBRARIAN, CAMPUS_MANAGEMENT)]` | Authenticated + either staff role |

**Rule:** All route protection must use one of these dependency types. Never manually check `user.role` inside a router.

---

### `models/`

All SQLModel definitions live here. Each file groups logically related domain models together.

#### Model File Map

| File | DB Tables | Request/Response Schemas |
|---|---|---|
| `base.py` | `IDMixin`, `CreatedAtMixin`, `UpdatedAtMixin` (mixins, not tables) | - |
| `enums.py` | All `str, enum.Enum` types | - |
| `auth.py` | - | `LoginRequest`, `RegisterRequest`, `ChangePasswordRequest`, `TokenResponse` |
| `user.py` | `User` | `UserProfileResponse`, `MemberSummaryResponse`, `MemberDetailResponse`, `BorrowingHistoryItemResponse`, `UpdateProfileRequest` |
| `catalog.py` | `Book`, `BookCopy` | `AddBookRequest`, `UpdateBookRequest`, `ISBNLookupRequest`, `UpdateCopyStatusRequest`, `BookSummaryResponse`, `BookDetailResponse`, `BookRecommendationResponse` |
| `circulation.py` | `Transaction`, `Fine` | `IssueBookRequest`, `ReturnBookRequest`, `TransactionResponse`, `FineResponse` |
| `reservation.py` | `Reservation` | reservation schemas |
| `community.py` | `Review` | review schemas |
| `reading_list.py` | `ReadingList`, `ReadingListBook` | reading list schemas |
| `purchase_request.py` | `PurchaseRequest`, `PurchaseRequestVote` | purchase request schemas |
| `subscription.py` | `Subscription`, `Magazine`, `Newspaper` | subscription schemas |
| `budget.py` | `Vendor`, `BookPurchaseEntry` | budget schemas |
| `notification.py` | `Notification` | notification schemas |
| `payment.py` | `Payment` | payment schemas |

#### Model Structure Pattern

Each model file follows this pattern:

```python
# ── Models ────────────
class EntityBase(SQLModel):       # shared fields
    ...

class Entity(EntityBase, IDMixin, ..., table=True):  # DB table
    ...

# ── Schemas ───────────
class CreateEntityRequest(SQLModel):  # request body
    ...

class EntityResponse(SQLModel):       # response body
    ...
```

**Rules:**
- DB table classes use `table=True`.
- Schema classes never use `table=True`.
- Base classes (not tables) are composed via multiple inheritance.
- `IDMixin`, `CreatedAtMixin`, `UpdatedAtMixin` from `base.py` are composed in where needed.
- Model methods are permitted only when: the logic is self-contained, trivial, and requires only the model instance itself (e.g., `is_overdue()`, `days_overdue()`, `monthly_cost()`, `available_copies()`, `average_rating()`). Such methods must not encode business rules about when or whether an operation is allowed.
- `models/__init__.py` exports all table classes so SQLModel discovers them for schema creation.

---

### `routers/`

Thin HTTP layer. One file per domain area. Each file exports a single `APIRouter`.

#### Router File Map

| File | Router Variable | Route Prefix Pattern |
|---|---|---|
| `auth.py` | `auth_router` | `/auth/*` |
| `catalog.py` | `catalog_router` | `/books/*` |
| `circulation.py` | `circulation_router` | `/circulation/*` |
| `members.py` | `members_router` | `/members/*` |
| `reservations.py` | `reservations_router` | `/reservations/*` |
| `requests.py` | `requests_router` | `/requests/*` |
| `reviews.py` | `reviews_router` | `/reviews/*` |
| `reading_lists.py` | `reading_lists_router` | `/reading-lists/*` |
| `subscriptions.py` | `subscriptions_router` | `/subscriptions/*` |
| `budget.py` | `budget_router` | `/budget/*` |
| `recommendations.py` | `recommendations_router` | `/recommendations/*` |
| `reports.py` | `reports_router` | `/reports/*` |
| `payments.py` | `payments_router` | `/payments/*` |
| `notifications.py` | `notifications_router` | `/notifications/*` |
| `health.py` | `router` | `/health` |

#### Correct Router Pattern

```python
from fastapi import APIRouter
from core.dependencies import SessionDep, LibrarianDep
from models.catalog import AddBookRequest, BookDetailResponse
from services import catalog as catalog_service

catalog_router = APIRouter(tags=["Catalog"])

@catalog_router.post("/books", response_model=BookDetailResponse, status_code=201)
def add_book(body: AddBookRequest, session: SessionDep, current_user: LibrarianDep) -> BookDetailResponse:
    """Adds a new book to the catalog."""
    return catalog_service.add_book(body, session)
```

**Rules:**
- Routers must never call `session.exec()`, `session.get()`, `session.add()`, or `session.commit()`.
- Routers must never import from `core.auth` directly (use `core.dependencies`).
- Every endpoint must declare `response_model` using a schema from `models/`.
- Business logic and error handling belong in `services/`, not routers.
- `routers/__init__.py` exports all routers for import into `main.py`.

---

### `services/`

Business logic layer. One file per domain area, mirroring `routers/`.

**Rules:**
- Services receive typed arguments (parsed request models, `Session`, `User` objects) from routers.
- Services perform all DB reads and writes (`session.exec`, `session.add`, `session.commit`, `session.refresh`).
- Services raise `HTTPException` when a business rule is violated.
- Services return typed response model instances (schemas from `models/`).
- Services must not import from `routers/`.

#### Correct Service Pattern

```python
from fastapi import HTTPException, status
from sqlmodel import Session, select
from models.catalog import AddBookRequest, Book, BookDetailResponse

def add_book(body: AddBookRequest, session: Session) -> BookDetailResponse:
    """Creates a new book record."""
    existing = session.exec(select(Book).where(Book.isbn == body.isbn)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="ISBN already exists.")
    book = Book.model_validate(body)
    session.add(book)
    session.commit()
    session.refresh(book)
    return BookDetailResponse.model_validate(book)
```

---

### `tests/`

Test suite using pytest. Tests are organized by what they test, not by domain feature.

```
tests/
├── conftest.py          # shared fixtures
├── test_health.py       # health endpoint smoke test
├── api/                 # router integration tests
│   └── test_api_auth.py
└── core/                # unit tests for core utilities
    ├── test_core_auth.py
    └── test_core_dependencies.py
```

#### `conftest.py` - Shared Fixtures

| Fixture | Scope | Description |
|---|---|---|
| `clear_blocklist` | autouse | Clears `token_blocklist` before every test. |
| `db_session` | function | In-memory SQLite session; tables created and dropped per test. |
| `client` | function | `TestClient` with `get_session` dependency overridden to use `db_session`. |
| `normal_user` | function | Active, approved `MEMBER` user in DB. |
| `inactive_user` | function | Inactive, pending `MEMBER` user in DB. |
| `librarian_user` | function | Active, approved `LIBRARIAN` user in DB. |
| `normal_user_token` | function | Valid JWT for `normal_user` obtained via `/auth/login`. |

**Rules:**
- Router tests live in `tests/api/`. They test the full HTTP request-response cycle via `TestClient`.
- Core tests live in `tests/core/`. They test utility functions in `core/` in isolation.
- Services are not tested directly. Router tests exercise services implicitly.
- All tests use in-memory SQLite to avoid polluting `library.db`.
- New fixtures go into `conftest.py` if they are reusable across multiple test files.

---

## User Roles

Defined in `models/enums.py` as `UserRole`.

| Role | Value | Access |
|---|---|---|
| Librarian | `LIBRARIAN` | Full catalog, circulation, member management |
| Member | `MEMBER` | Browse catalog, borrow, reserve, reading lists |
| Campus Management | `CAMPUS_MANAGEMENT` | Reports, budget, subscriptions |

---

## Authentication Flow

1. Client sends credentials to `POST /auth/login`.
2. `auth_service.login` verifies email + bcrypt password, returns a signed JWT.
3. JWT payload: `{"sub": "<user_id>", "exp": <timestamp>}`.
4. Client includes `Authorization: Bearer <token>` on subsequent requests.
5. `CurrentUserDep` (via `get_current_user`) decodes the token, checks the blocklist, and fetches the `User` from DB.
6. `POST /auth/logout` adds the token to `token_blocklist` (in-memory set). Token is invalid for the duration of the process.

> **Note:** `token_blocklist` is in-memory. It resets on server restart. This is acceptable for a learning project.

---

## Database Seeding

On startup, `seed_default_users()` inserts three default users if the DB is empty:

| Email | Role | Password |
|---|---|---|
| `librarian@example.com` | `LIBRARIAN` | `password123` |
| `member@example.com` | `MEMBER` | `password123` |
| `management@example.com` | `CAMPUS_MANAGEMENT` | `password123` |

---

## Key Invariants (Enforce on Every PR)

1. **No DB calls in routers.** Any direct `session.*` usage inside `routers/` is a violation.
2. **No business logic in routers.** Conditional logic, validation beyond schema, and error decisions belong in `services/`.
3. **No logic in models beyond self-contained methods.** Methods that query other tables or enforce multi-entity rules belong in `services/`.
4. **`response_model` is always declared.** Every endpoint must have `response_model=` set to a schema class.
5. **Role enforcement uses dependency injection.** Never manually check roles inside a router or service when a typed dependency exists.
6. **Schemas and DB models are separate classes.** Never return a `table=True` model directly as a response.
7. **New domain areas follow the established pattern:** one file in `models/`, one in `routers/`, one in `services/`, router registered in `main.py`.
