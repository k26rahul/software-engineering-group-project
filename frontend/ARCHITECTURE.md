# Frontend Architecture

> **For coding agents and PR reviewers:** This document is the authoritative reference for frontend architecture. Enforce every rule described here without exception.

## Tech Stack

| Concern              | Choice                                 |
| -------------------- | -------------------------------------- |
| Framework            | React 19                               |
| Build Tool           | Vite                                   |
| Styling              | Tailwind CSS v4                        |
| State Management     | Zustand                                |
| UI Components        | shadcn/ui + Radix UI                   |
| Routing              | React Router DOM                       |
| HTTP Client          | Axios (`lib/api.js`)                   |
| API Mocking          | Mock Service Worker (MSW)              |
| Testing              | Vitest + React Testing Library + jsdom |
| Linting / Formatting | ESLint v10 + Prettier                  |

---

## Data Flow Architecture

The frontend enforces strict unidirectional data flow:

**Pages / Components (`pages/`, `components/`)** - Render UI from store state. Capture user input via local state only. Call store actions in response to user events. Never make API calls directly. Never hold global state.

**Stores (`store/`)** - Hold global application state. Expose actions that mutate state. Make all network requests via `lib/api.js`. Update state from API responses.

**`lib/api.js` (Axios instance)** - Single shared Axios instance. Attaches JWT from `localStorage` on every request. Normalizes error responses.

**MSW (`mocks/`)** - Intercepts HTTP at Service Worker level in development mode only. Returns mock responses from `mocks/data/`.

---

## Directory Reference

### `main.jsx`

Application entry point:

- Conditionally starts the MSW Service Worker before rendering (only in `development` mode when `VITE_USE_MOCKS !== "false"`).
- Renders `<App />` wrapped in `<StrictMode>` after mocking is ready.

**Rule:** No application logic here. MSW bootstrapping and React mounting only.

---

### `App.jsx` - App Shell

The root routing component:

- Owns `BrowserRouter` and the top-level `<Routes>` tree.
- Calls `initializeAuth()` on mount to restore session from `localStorage`.
- Renders a loading screen while auth is initializing.
- Wraps dashboard routes in `<DashboardLayout requiredRole="...">` for route protection.

#### Route Structure

| Path            | Component             | Layout            | Protection               |
| --------------- | --------------------- | ----------------- | ------------------------ |
| `/`             | `HomePage`            | none              | public                   |
| `/login`        | `LoginPage`           | `AuthLayout`      | public                   |
| `/register`     | `RegisterPage`        | `AuthLayout`      | public                   |
| `/librarian/*`  | `LibrarianDashboard`  | `DashboardLayout` | `LIBRARIAN` role         |
| `/member/*`     | `MemberDashboard`     | `DashboardLayout` | `MEMBER` role            |
| `/management/*` | `ManagementDashboard` | `DashboardLayout` | `CAMPUS_MANAGEMENT` role |

**Rules:**

- Only the six top-level routes listed above belong in `App.jsx`.
- Dashboard child routes must be declared inside their respective dashboard component using nested `<Routes>`, not here.

---

### `layouts/`

Structural wrappers with no domain logic.

| File                  | Purpose                                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthLayout.jsx`      | Centered card container for login and register pages.                                                                                                                                                    |
| `DashboardLayout.jsx` | Authenticated shell: fixed sidebar + header + main content area. Handles route protection by checking `user` and `user.role` from `authStore`. Redirects to `/login` if not authenticated or wrong role. |
| `AppLayout.jsx`       | Generic sidebar + header layout (placeholder for future public pages).                                                                                                                                   |

**Rules:**

- Layouts must not make API calls or hold domain state.
- `DashboardLayout` is the only place where route-level auth/role checks happen. Do not duplicate this logic elsewhere.

---

### `pages/`

All screens and views. Organized by role area (`auth/`, `librarian/`, `member/`, `management/`). Each dashboard component (e.g., `LibrarianDashboard.jsx`) owns its own child routes.

**Rules:**

- Pages may use `useState` for UI interactivity and form field values only.
- Pages must never manage global state directly or define Zustand stores.
- Pages must never call `api` (the Axios instance) directly. All data fetching is done through store actions.
- Pages read global state by subscribing to Zustand stores via `useStore((state) => state.field)`.
- Pages trigger mutations by calling store actions (e.g., `store.login(...)`, `store.fetchBooks()`).
- New pages for a dashboard must be placed in the appropriate role folder and linked as a child route inside that dashboard component.

---

### `store/`

Global state management via Zustand. One store file per domain area (e.g., `authStore.js`). Each store holds state and exposes actions that make API calls via `lib/api.js` and update state from responses.

**Rules:**

- Every store action that needs an API call must use the shared `api` instance from `lib/api.js`.
- Stores must handle their own error state where needed; pages read the error from the store.
- JWT persistence: the token is saved to `localStorage` under the key `ACCESS_TOKEN_KEY` (exported from `lib/api.js`). Stores manage this key; pages must never touch `localStorage` directly.
- New domain stores follow the same pattern as `authStore.js`: state shape + actions in one `create(...)` call.

---

### `lib/`

Shared utilities that are not domain-specific.

**`lib/api.js`** - The only place where Axios is configured. Exports the configured `api` instance (base URL from `VITE_API_URL`, defaults to `http://localhost:8000`), the `baseURL` string (used by MSW handlers), and the `ACCESS_TOKEN_KEY` constant. Request interceptor attaches JWT; response error interceptor normalizes errors into a plain `Error` with `message`, `cause`, and `status` fields.

**`lib/utils.js`** - Exports `cn(...inputs)`, a utility that merges Tailwind class names using `clsx` and `tailwind-merge`.

**Rule:** All HTTP requests in the application must go through the `api` instance. Never import `axios` directly in a store or component.

---

### `components/`

Reusable UI building blocks shared across pages. Includes `Header.jsx`, `Sidebar.jsx` (role-aware navigation), and `FormSelect.jsx`. The `components/ui/` subdirectory contains shadcn/ui auto-generated components.

**Rules:**

- Components may read from Zustand stores (read-only subscriptions for display purposes).
- Components must not call store actions or make API calls.
- Components must not hold global state.
- `components/ui/` is managed by shadcn CLI. Never manually edit files inside it.
- New reusable components that are used across multiple pages go in `components/` (not in `pages/`).

---

### `mocks/`

MSW-based API mocking for development and testing. Active when `VITE_USE_MOCKS !== "false"` in `development` mode. Structure: `browser.js` (Service Worker setup for browser), `server.js` (MSW server for Vitest), `handlers/` (one handler file per API domain, aggregated in `handlers/index.js`), and `data/` (static mock data objects, one file per domain).

**Rules:**

- Handler files must import mock data from `mocks/data/`, never inline data objects.
- Handler files must import `baseURL` from `lib/api.js` to construct full endpoint URLs.
- Handlers should only implement minimal logic for plausible responses. Do not replicate real backend validation.
- Data files export plain JS objects/arrays mirroring real API response shapes. No logic in data files.

---

### `index.css`

Global stylesheet. Imports Tailwind base styles and defines CSS custom properties for the design system (colors, radii, etc.) via `:root` and `.dark` selectors following the shadcn/ui convention.

---

## Environment Variables

| Variable         | File           | Effect                                                          |
| ---------------- | -------------- | --------------------------------------------------------------- |
| `VITE_API_URL`   | `.env.*`       | Base URL for `lib/api.js`. Defaults to `http://localhost:8000`. |
| `VITE_USE_MOCKS` | `.env.no-mock` | Set to `"false"` to disable MSW.                                |

`.env.development` - used by `npm run dev` (mocks enabled).
`.env.no-mock` - used by `npm run dev:no-mock` (mocks disabled, real backend required).

---

## Testing

Tests use Vitest + React Testing Library. MSW's `server.js` is started in `test-setup.js` to intercept API calls during component tests.

**Rules:**

- Test files are co-located with the file they test (e.g., `LoginPage.test.jsx` next to `LoginPage.jsx`).
- Component tests must use MSW mocks and must not make real network requests.
- Store logic is exercised implicitly through component tests.

---

## Key Invariants (Enforce on Every PR)

1. **No API calls in pages or components.** Any use of `api` (or `axios`) outside of `store/` is a violation.
2. **No global state in pages or components.** `useState`/`useReducer` for local UI state is fine; creating or mutating Zustand state directly is not.
3. **All HTTP through `lib/api.js`.** Never import `axios` directly anywhere other than `lib/api.js`.
4. **Child routes belong in dashboards, not `App.jsx`.** Routes under `/librarian/*`, `/member/*`, `/management/*` must be declared inside the respective dashboard component.
5. **Mock data belongs in `mocks/data/`, not in handlers.** Handler files must import their data; they must not contain inline data objects.
6. **`components/ui/` is read-only.** Only the shadcn CLI writes to this directory.
7. **New domain stores follow `authStore.js` pattern.** State shape + actions in one `create(...)` call.
8. **`localStorage` is only touched by `authStore.js` and `lib/api.js`.** No other file reads or writes `localStorage`.
