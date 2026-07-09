# Library Management System - Backend

This is the backend API for the Library Management System, providing a robust, high-performance RESTful API.

## 🚀 Tech Stack

- **Framework:** FastAPI
- **Language:** Python 3.10
- **Package Manager:** uv (Extremely fast Python package and environment manager)
- **Database:** SQLite
- **ORM:** SQLModel (Combines SQLAlchemy and Pydantic)
- **Validation:** Pydantic
- **Authentication:** pwdlib + Python-JOSE (JWT)
- **Testing:** pytest
- **Code Quality:** Ruff

## 📦 Installed Libraries

### Core Dependencies
- `fastapi`: Modern, fast web framework for building APIs.
- `uvicorn[standard]`: Lightning-fast ASGI web server.
- `sqlmodel`: ORM layer for interacting with the SQLite database seamlessly.
- `pydantic-settings`: Management of settings and environment variables.
- `pwdlib[bcrypt]`: Modern, secure password hashing.
- `python-jose[cryptography]`: Generation and verification of JSON Web Tokens (JWT) for user authentication.

### Development Dependencies
- `ruff`: An extremely fast Python linter and code formatter, replacing flake8, black, and isort.
- `pytest`: The framework for writing small, readable, and scalable tests.
- `httpx2`: A fully featured HTTP client, necessary for FastAPI's `TestClient` during integration testing.

## 🛠️ Commands

To get started with development, you'll need the `uv` package manager installed.

> **Prerequisite:** Install [uv](https://docs.astral.sh/uv/getting-started/installation/) on your machine.

### Install Dependencies & Sync Environment
```bash
uv sync
```
This command automatically manages your virtual environment (`.venv`), respects the `.python-version` (Python 3.10), and installs all required dependencies from `uv.lock`.

> **VS Code Setup:** When opening this project in VS Code for the first time, you must manually select the Python interpreter. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`), type **Python: Select Interpreter**, and select the executable located at `backend/.venv/Scripts/python.exe`.

### Run Development Server
```bash
uv run uvicorn main:app --reload --port 8000
```
Starts the FastAPI application with auto-reload enabled. 
- API Base URL: `http://localhost:8000`
- Interactive API Docs (Swagger UI): `http://localhost:8000/docs`

### Run Tests
```bash
uv run pytest
```
Discovers and runs all tests located in the `tests/` directory.

### Linting

To check the codebase for errors and bad practices using Ruff:
```bash
uv run ruff check .
```
(Refer to the [Ruff Rules](https://docs.astral.sh/ruff/rules/) documentation for more information regarding lint errors.)

To automatically fix fixable lint errors:
```bash
uv run ruff check --fix .
```

### Formatting

To automatically format the codebase to enforce consistent style (double quotes, space indentation, etc.):
```bash
uv run ruff format .
```

To check if all files in the project are formatted correctly, without making any changes:
```bash
uv run ruff format --check .
```
