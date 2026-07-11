# Code Review Guidelines

This repository has strict architectural guidelines. When reviewing Pull Requests or Merge Requests, please enforce the rules defined below.

For complete context and details on the architecture, refer to:
- [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md)
- [frontend/ARCHITECTURE.md](frontend/ARCHITECTURE.md)

## Backend Guidelines

Enforce the following rules for any changes in the `backend/` directory:
- No `session.*` calls inside `routers/`.
- No business logic, conditional rules, or `HTTPException` raised inside `routers/`.
- Every router endpoint declares `response_model=` using a schema class from `models/`.
- Services receive typed arguments; all DB mutations happen in `services/`.
- Role enforcement uses `LibrarianDep`, `MemberDep`, `ManagementDep`, `StaffDep`, `CurrentUserDep` - never a manual `if user.role == ...` check in a router.
- No `table=True` model returned directly as a response; a schema class must be used.
- Model methods are only permitted for self-contained, instance-level logic with no multi-entity business rules.
- New domain areas have matching files in `models/`, `routers/`, `services/`, and the router is registered in `main.py`.

## Frontend Guidelines

Enforce the following rules for any changes in the `frontend/` directory:
- No `api` (Axios) calls outside of `store/`. Pages and components must never call `api` directly.
- No global state (`useAuthStore`, other stores' `setState`) mutated inside pages or components.
- No direct `localStorage` access outside of `store/authStore.js` and `lib/api.js`.
- Child routes for dashboards (`/librarian/*`, `/member/*`, `/management/*`) must be declared inside their respective dashboard component, not in `App.jsx`.
- Mock handlers must import data from `mocks/data/`; no inline data objects inside handler files.
- `components/ui/` must not be manually edited.
- New stores must follow the `authStore.js` pattern.
- All HTTP goes through `lib/api.js`; `axios` must not be imported directly anywhere else.
