# Backend Architecture

> **For coding agents and PR reviewers:** This document is the authoritative reference for backend architecture. Enforce every rule described here without exception.

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

**Routers (`routers/`)** - Declare HTTP endpoints only. Parse request bodies using `models/` schemas, delegate all logic to `services/`, return responses using `models/` schemas. No direct DB access, no business logic.

**Services (`services/`)** - Contain all business logic. All database mutations happen here. Raise `HTTPException` for business rule violations. Receive `Session` and model instances via arguments from routers.

**Models (`models/`)** - Define DB tables (`SQLModel`, `table=True`) and request/response schemas (plain `SQLModel`). May contain small self-contained model methods.

**Core (`core/`)** - Cross-cutting concerns used by all layers: config, DB engine/session, auth utilities, FastAPI dependencies, DB seeding.

---

## Directory Reference

### `main.py`

Application entry point:
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
| `seeding.py` | Seeds default dev users on first startup if the DB is empty. |

`core/dependencies.py` exports typed dependency aliases: `SessionDep`, `TokenDep`, `CurrentUserDep`, `LibrarianDep`, `MemberDep`, `ManagementDep`, `StaffDep`. These enforce authentication and role checks via dependency injection.

**Rule:** All route protection must use one of these dependency types. Never manually check `user.role` inside a router.

### `schemas/`

All HTTP request and response DTO schemas live here, organized by domain module (e.g. `schemas/auth.py`, `schemas/user.py`, `schemas/book.py`).

**Rules:**
- All schemas use plain `SQLModel` without `table=True`.
- Reusable schemas are imported across routers and services.

### `models/`

All SQLModel database table definitions live here. Each file groups logically related domain entities together.

Each model file defines DB table classes (`table=True`) and shared base/mixin classes.

**Rules:**
- DB table classes use `table=True`.
- Base classes (`IDMixin`, `CreatedAtMixin`, `UpdatedAtMixin` from `base.py`) are composed via multiple inheritance.
- Enums are defined in `enums.py` as `str, enum.Enum` types.
- Model methods are permitted only when the logic is self-contained, trivial, and requires only the model instance itself (e.g., `is_overdue()`, `available_copies()`). Methods must not encode business rules about when or whether an operation is allowed.
- `models/__init__.py` exports all table classes so SQLModel discovers them for schema creation.


### `routers/`

Thin HTTP layer. One file per domain area. Each file exports a single `APIRouter`.

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

---

### `tests/`

Test suite using pytest. Router integration tests live in `tests/api/`, core unit tests in `tests/core/`. Shared fixtures in `conftest.py` provide in-memory SQLite sessions, `TestClient` with overridden dependencies, and pre-seeded user objects with tokens.

**Rules:**
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
