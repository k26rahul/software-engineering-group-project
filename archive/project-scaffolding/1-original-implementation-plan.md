# Project Scaffold - Library Management System

Scaffold the initial `frontend/` and `backend/` directories at the repo root. Both reach a "hello world" state - the frontend renders a placeholder page and the backend returns a health-check response. All tooling (linting, formatting, testing) is wired up and ready for real feature work.

---

## Proposed Changes

### Root

#### [MODIFY] [.gitignore](file:///c:/k26rahul/Code/Work/MAY2026-Team-052/.gitignore)
Extend the existing `.gitignore` with frontend (`node_modules/`, `dist/`) and backend (`__pycache__/`, `.venv/`, `*.db`) entries.

---

### Backend (`backend/`)

Tech: **FastAPI · SQLModel · SQLite · Pydantic · uv · Ruff · pytest**

#### Directory layout

```
backend/
├── pyproject.toml          # uv/pip metadata, Ruff config, pytest config
├── .python-version         # pins Python version for uv
├── main.py                 # FastAPI app factory + lifespan (DB init)
├── core/
│   ├── __init__.py
│   ├── config.py           # Settings (Pydantic BaseSettings, reads .env)
│   └── database.py         # SQLModel engine + get_session dependency
├── models/
│   ├── __init__.py
│   └── enums.py            # All Python enums (UserRole, CopyStatus, …)
├── routers/
│   ├── __init__.py
│   └── health.py           # GET /health → {"status": "ok"}
├── services/
│   └── __init__.py
└── tests/
    ├── __init__.py
    └── test_health.py      # pytest: asserts GET /health returns 200
```

> **Other folders added beyond your list:** `tests/` - needed from day 1 since pytest is in the stack.

#### Files created / what goes in them

| File | Contents |
|---|---|
| `pyproject.toml` | `[project]` metadata; `[tool.ruff]` lint/format config; `[tool.pytest.ini_options]` |
| `.python-version` | `3.12` |
| `main.py` | `create_app()` → `FastAPI`, mounts `health_router`, lifespan creates DB tables |
| `core/config.py` | `Settings(BaseSettings)` with `database_url`, `secret_key`, `debug` |
| `core/database.py` | `engine`, `create_db_and_tables()`, `get_session` dependency |
| `models/enums.py` | All 11 enums from `1.4_database-components.md` |
| `routers/health.py` | `GET /health` returns `{"status": "ok", "version": "0.1.0"}` |
| `tests/test_health.py` | `TestClient` test asserting 200 + correct body |

#### Terminal commands

```powershell
# 1. Init uv project (creates pyproject.toml, .python-version, .venv)
uv init backend --python 3.12 --no-workspace

# 2. Install runtime dependencies
uv add fastapi "uvicorn[standard]" sqlmodel pydantic-settings python-jose "passlib[bcrypt]" --project backend

# 3. Install dev dependencies
uv add --dev ruff pytest httpx --project backend
```

> **`httpx`** is required by FastAPI's `TestClient`.

---

### Frontend (`frontend/`)

Tech: **React · Vite · Zustand · Tailwind CSS v4 · shadcn/ui · ESLint · Prettier · Vitest**

#### Directory layout

```
frontend/
├── package.json
├── vite.config.js
├── eslint.config.js
├── .prettierrc
├── components.json         # shadcn/ui registry config
├── index.html
└── src/
    ├── main.jsx            # React DOM entry point
    ├── App.jsx             # Root component with router + AppLayout
    │   └── App.test.jsx    # co-located Vitest test for App
    ├── assets/             # Static files (images, fonts, SVGs)
    ├── components/         # Shared/reusable UI components
    │   └── ui/             # shadcn/ui primitives land here (Button, etc.)
    ├── layouts/
    │   └── AppLayout.jsx   # Sidebar + header shell (placeholder)
    ├── pages/
    │   └── HomePage.jsx    # Temporary landing page ("Hello World")
    ├── services/           # API client functions (axios/fetch wrappers)
    │   └── api.js          # Base axios instance pointing at backend URL
    └── store/              # Zustand stores
        └── authStore.js    # useAuthStore (user, token, login/logout actions)
```

> **Test convention:** Vitest tests are **co-located** - `App.test.jsx` lives next to `App.jsx`, etc. No separate `tests/` directory on the frontend. `components/ui/` is the shadcn/ui drop zone.

#### Terminal commands

```powershell
# 1. Scaffold Vite + React project
npx -y create-vite@latest frontend --template react

# 2. Install runtime dependencies
npm install --prefix frontend zustand react-router-dom axios

# 3. Install Tailwind CSS v4
npm install --prefix frontend tailwindcss @tailwindcss/vite

# 4. Install dev dependencies
npm install --prefix frontend --save-dev \
  eslint prettier prettier-plugin-tailwindcss \
  @eslint/js eslint-plugin-react eslint-plugin-react-hooks \
  vitest @vitest/coverage-v8 jsdom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event

# 5. Init shadcn/ui with defaults (installs all peer deps automatically)
#    This adds clsx, tailwind-merge, class-variance-authority, lucide-react, etc.
npx --prefix frontend shadcn@latest init --defaults
```

> **shadcn/ui init:** Running with `--defaults` picks `neutral` base color and CSS variables. All peer dependencies (`clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `@radix-ui/react-slot`) are installed automatically by the init command - no separate install step needed.

---

## Verification Plan

### Backend
```powershell
# Run the server
uv run --project backend uvicorn main:app --reload --port 8000

# Expected: GET http://localhost:8000/health → {"status":"ok","version":"0.1.0"}
# Expected: GET http://localhost:8000/docs   → Swagger UI

# Run tests
uv run --project backend pytest
```

### Frontend
```powershell
# Run the dev server
npm run dev --prefix frontend

# Expected: browser opens http://localhost:5173 → LMS placeholder page

# Run unit tests
npm run test --prefix frontend
```

---

## Resolved Decisions

| Decision | Choice |
|---|---|
| Tailwind CSS version | v4 (CSS-first config, `@tailwindcss/vite` plugin) |
| shadcn/ui init | `--defaults` (neutral base color, CSS variables on); patch `components.json` if needed |
| Frontend test layout | Co-located (`*.test.jsx` next to source files, no separate `tests/` dir) |
| Backend test layout | Top-level `backend/tests/` directory (standard Python/pytest convention) |
| `frontend/` + `backend/` location | Repo root alongside `milestone-1/`, `milestone-2/`, etc. |
