# Tech Stack

This document records the tools, libraries, and workflows chosen for building and maintaining the Library Management System. It explains what each tool is, why it's part of our stack, and how we intend to use it. This is an internal working document, not a milestone deliverable.

---

## 1. Frontend

### React

The core UI library used to build the application as a component-based single-page app. All pages and shared UI components described in the Milestone 2 component design are implemented as React components.

### Vite

The build tool and dev server for the frontend. It provides fast local development (hot module reload) and produces an optimized static `dist` folder for production. Since the output is purely static assets, it can be deployed on any static hosting service without needing a Node server in production.

### Zustand

The state management library for the frontend. Used to manage global client-side state such as the logged-in user's session/role, cart-like UI state, and any data that needs to be shared across components without prop-drilling (e.g., notification counts, budget tracker values). Kept intentionally lightweight compared to heavier alternatives like Redux, since our state needs are modest.

### Tailwind CSS

The utility-first CSS framework used for all styling. Instead of writing custom CSS files, styles are applied directly via utility classes in JSX, keeping styling co-located with markup and consistent across pages.

### shadcn/ui

The component library used for common UI primitives (buttons, dialogs, dropdowns, tables, form inputs, etc.). Since shadcn/ui components are copied into our codebase rather than installed as an opaque dependency, we can freely customize them to match our design needs while still building on top of accessible, well-tested primitives. This forms the basis for shared components like `DataTable`, `ConfirmationModal`, and `FormField`.

---

## 2. Backend

### FastAPI

The web framework used to build the backend REST API. Chosen for its speed, native async support, and automatic request/response validation. All routers described in the component design (`auth_router`, `catalog_router`, `circulation_router`, etc.) are implemented as FastAPI routers.

### Pydantic

Used to define request and response schemas for the API layer (e.g., the shape of data expected when issuing a book, or the shape of a book returned from search). FastAPI uses these models to validate incoming requests and serialize outgoing responses automatically.

### SQLModel

The ORM layer used to define database models. SQLModel combines SQLAlchemy's database capabilities with Pydantic's validation, letting us define a single model class per entity (`User`, `Book`, `Transaction`, etc.) that serves as both the database table definition and a data-validation schema.

### SQLite

The database engine for the application. Chosen for its simplicity and zero-configuration setup, well suited to the scale of this project (a single campus library). The database is a single file, making local development and backups straightforward.

### Layered Architecture: Routers → Services → Models

We follow a strict separation of concerns on the backend:

- **Routers** define HTTP endpoints and handle request/response wiring only.
- **Services** contain all business logic (e.g., fine calculation, reservation queueing, budget totals) and are the only layer that routers call into.
- **Models** (SQLModel classes) represent persisted data and expose only simple computed properties/helpers — no business logic.

This keeps endpoints thin, business logic testable in isolation, and database concerns isolated from API concerns.

### OpenAPI Schema

FastAPI automatically generates an OpenAPI schema from our routers and Pydantic models. We rely on this for interactive API documentation during development and as a reference contract between frontend and backend, without maintaining separate API docs by hand.

---

## 3. Code Quality: Formatting & Linting

### ESLint + Prettier (JavaScript/Frontend)

- **ESLint (v10)** checks the frontend code for programming errors, unused variables, and enforces consistent coding patterns. We use **@eslint-react/eslint-plugin** for comprehensive React component and hook validation in place of legacy plugins.
- **Prettier** handles automatic code formatting (spacing, quotes, line length) so that formatting is never a matter of personal preference or PR discussion.
- We use **prettier-plugin-tailwindcss** alongside Prettier to automatically sort Tailwind utility classes into a consistent order, keeping class lists readable and avoiding inconsistent ordering across the codebase.
- Configured via `eslint.config.js` and `.prettierrc` at the project root.

### Ruff (Python/Backend)

A single fast tool that handles both linting and formatting for the Python backend, replacing the need for separate tools (like flake8 + black + isort). Configured via `pyproject.toml`.

---

## 4. Testing

### pytest (Backend/API)

Used to write and run tests for the FastAPI backend — covering service-layer business logic (e.g., fine calculation, reservation queueing) as well as API endpoint behavior. Forms the primary safety net for backend correctness.

### Vitest + React Testing Library + jest-dom + jsdom (Frontend Unit/State)

- **Vitest** is the test runner for the frontend, integrating tightly with our Vite build setup.
- **@testing-library/react** is used to render and interact with React components in tests the way a user would, rather than testing internal implementation details.
- **@testing-library/jest-dom** adds convenient DOM-specific matchers (e.g., checking if an element is visible or disabled) on top of Vitest's assertions.
- **jsdom** provides a simulated browser DOM environment so component and Zustand store tests can run in Node without a real browser.

### Playwright (Frontend End-to-End)

Used to write end-to-end tests that simulate real user flows across the whole application in an actual browser — e.g., a member logging in, searching the catalog, and reserving a book, or a librarian issuing and returning a book. This validates that frontend and backend work correctly together, beyond what unit tests can cover.

---

## 5. Editor Setup

The following VS Code extensions are recommended for all contributors, matching the tools above:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) — surfaces ESLint errors/warnings directly in the editor.
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) — formats JS/TS files on save.
- [Ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) — surfaces lint errors and formats Python files on save.
- [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) — run and debug Vitest tests directly from the editor's test explorer.
- [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) — run, debug, and generate Playwright end-to-end tests from the editor.
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) — autocomplete, linting, and hover previews for Tailwind utility classes.
- [Inline Fold](https://marketplace.visualstudio.com/items?itemName=moalamri.inline-fold) — collapses long inline attributes (like Tailwind class lists) for improved readability while editing.

---

## 6. Python Environment Management

### uv

Used to manage the Python environment for the backend — virtual environment creation, dependency installation, and dependency locking. Chosen for its speed and simplicity over traditional `pip` + `venv` workflows.

---

## 7. Continuous Integration & Code Review

### GitHub Actions

Used to automatically run linting and formatting checks (ESLint/Prettier for frontend, Ruff for backend) on every pull request. A PR cannot be merged unless these checks pass, ensuring that no unformatted or lint-failing code reaches the main branch.

### Kilo Code Reviewer

Used as an automated first pass on pull requests, providing AI-assisted code review comments (e.g., flagging potential bugs, inconsistencies, or missed edge cases) before a human reviewer looks at the PR. This doesn't replace human review but reduces the review burden for straightforward issues.

---

## 8. Summary Table

| Layer                       | Tool                                              | Purpose                                          |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| Frontend framework          | React                                             | Component-based UI                               |
| Frontend build tool         | Vite                                              | Dev server + static production build             |
| Frontend state              | Zustand                                           | Global client-side state management              |
| Styling                     | Tailwind CSS                                      | Utility-first styling                            |
| UI components               | shadcn/ui                                         | Reusable, customizable UI primitives             |
| Backend framework           | FastAPI                                           | REST API, routers, auto-generated OpenAPI schema |
| Schema validation           | Pydantic                                          | Request/response validation                      |
| ORM                         | SQLModel                                          | Database models + validation                     |
| Database                    | SQLite                                            | Persistent storage                               |
| JS lint/format              | ESLint + Prettier (+ prettier-plugin-tailwindcss) | Code quality and class sorting for frontend      |
| Python lint/format          | Ruff                                              | Code quality for backend                         |
| Backend testing             | pytest                                            | API and service-layer tests                      |
| Frontend unit/state testing | Vitest, React Testing Library, jest-dom, jsdom    | Component and store-level tests                  |
| Frontend E2E testing        | Playwright                                        | Full user-flow browser tests                     |
| Python env management       | uv                                                | Virtual env + dependency management              |
| CI                          | GitHub Actions                                    | Enforce lint/format checks on PRs                |
| Automated review            | Kilo Code Reviewer                                | AI-assisted PR review                            |
