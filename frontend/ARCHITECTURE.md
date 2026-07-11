# Frontend Architecture

> **For coding agents and PR reviewers:** This document is the authoritative reference for frontend architecture. When writing or reviewing code, enforce every rule described here without exception. Flag any violation as a review finding.

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

The frontend enforces a strict unidirectional data flow. There are no exceptions.

```
User Interaction
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Pages / Components  (pages/, components/)              │
│  · Render UI from store state                           │
│  · Capture user input via local state only              │
│  · Call store actions in response to user events        │
│  · Never make API calls directly                        │
│  · Never hold global state                              │
└────────────────────────┬────────────────────────────────┘
                         │ calls actions on
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Stores  (store/)                                       │
│  · Hold global application state                        │
│  · Expose actions that mutate state                     │
│  · Make all network requests via lib/api.js             │
│  · Update state from API responses                      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP via
                         ▼
┌─────────────────────────────────────────────────────────┐
│  lib/api.js  (Axios instance)                           │
│  · Single shared Axios instance                         │
│  · Attaches JWT from localStorage on every request      │
│  · Normalizes error responses                           │
└────────────────────────┬────────────────────────────────┘
                         │ intercepted in dev by
                         ▼
┌─────────────────────────────────────────────────────────┐
│  MSW  (mocks/)                                          │
│  · Intercepts HTTP at Service Worker level              │
│  · Returns mock responses from mocks/data/              │
│  · Active only in development mode                      │
└─────────────────────────────────────────────────────────┘
```

---

## Directory Reference

### `main.jsx`

Application entry point. Responsibilities:

- Conditionally starts the MSW Service Worker before rendering (only in `development` mode when `VITE_USE_MOCKS !== "false"`).
- Renders `<App />` wrapped in `<StrictMode>` after mocking is ready.

**Rule:** No application logic here. MSW bootstrapping and React mounting only.

---

### `App.jsx` - App Shell

The root routing component. Responsibilities:

- Owns `BrowserRouter` and the top-level `<Routes>` tree.
- Calls `initializeAuth()` on mount to restore session from `localStorage`.
- Renders a loading screen while auth is initializing.
- Declares top-level routes: public pages, auth pages, and the three dashboard entry points.
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
- Dashboard child routes (sub-pages within a dashboard) must be declared inside their respective dashboard component using nested `<Routes>`, not here.
- Never add `<Route>` children inline here for dashboard sub-pages.

---

### `layouts/`

Structural wrappers with no domain logic.

| File                  | Purpose                                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthLayout.jsx`      | Centered card container for login and register pages.                                                                                                                                                    |
| `DashboardLayout.jsx` | Authenticated shell: fixed sidebar + header + main content area. Handles route protection by checking `user` and `user.role` from `authStore`. Redirects to `/login` if not authenticated or wrong role. |
| `AppLayout.jsx`       | Generic sidebar + header layout (placeholder, available for future public pages).                                                                                                                        |

**Rules:**

- Layouts must not make API calls or hold domain state.
- `DashboardLayout` is the only place where route-level auth/role checks happen. Do not duplicate this logic elsewhere.

---

### `pages/`

All screens and views of the application.

```
pages/
├── HomePage.jsx
├── auth/
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
├── librarian/
│   └── LibrarianDashboard.jsx     ← owns /librarian/* child routes
├── member/
│   └── MemberDashboard.jsx        ← owns /member/* child routes
└── management/
    └── ManagementDashboard.jsx    ← owns /management/* child routes
```

**Rules:**

- Pages may use **local state** (`useState`) for UI interactivity and form field values only.
- Pages must **never** manage global state directly or define Zustand stores.
- Pages must **never** call `api` (the Axios instance) directly. All data fetching is done through store actions.
- Pages read global state by subscribing to Zustand stores via `useStore((state) => state.field)`.
- Pages trigger mutations by calling store actions (e.g., `store.login(...)`, `store.fetchBooks()`).
- New pages for a dashboard (e.g., a catalog page under `/librarian/catalog`) must be placed in the appropriate role folder and linked as a child route inside that dashboard component.
- Files must be grouped by role area (`auth/`, `librarian/`, `member/`, `management/`).

---

### `store/`

Global state management via Zustand. One store file per domain area.

```
store/
└── authStore.js        ← authentication state
```

#### `authStore.js` - State Shape

| Field            | Type             | Description                                                |
| ---------------- | ---------------- | ---------------------------------------------------------- |
| `user`           | `object \| null` | Authenticated user profile from `/auth/me`.                |
| `accessToken`    | `string \| null` | JWT stored in memory. Also persisted to `localStorage`.    |
| `isInitializing` | `boolean`        | True while session restoration is in progress on app load. |
| `hasInitialized` | `boolean`        | Guards against duplicate `initializeAuth` calls.           |

#### `authStore.js` - Actions

| Action                                                   | Description                                                                       |
| -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `initializeAuth()`                                       | Reads token from `localStorage`, calls `GET /auth/me` to restore the session.     |
| `login(email, password)`                                 | Calls `POST /auth/login`, stores token in memory and `localStorage`, sets `user`. |
| `register(name, email, password, phone, membershipType)` | Calls `POST /auth/register`, stores token and sets `user`.                        |
| `logout()`                                               | Clears `user`, `accessToken`, and removes token from `localStorage`.              |

**Rules:**

- Every store action that needs an API call must use the shared `api` instance from `lib/api.js`.
- Stores must handle their own error state where needed; pages read the error from the store.
- JWT persistence: the token is saved to `localStorage` under the key `ACCESS_TOKEN_KEY` (exported from `lib/api.js`). Stores manage this key; pages must never touch `localStorage` directly.
- New domain stores (e.g., `catalogStore.js`, `circulationStore.js`) follow the same pattern as `authStore.js`.

---

### `lib/`

Shared utilities that are not domain-specific.

#### `lib/api.js`

The only place where Axios is configured. Exports:

| Export             | Description                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `api` (default)    | Configured Axios instance. Base URL from `VITE_API_URL` env var, falls back to `http://localhost:8000`. |
| `baseURL`          | The resolved base URL string. Used by MSW handlers to construct full URLs.                              |
| `ACCESS_TOKEN_KEY` | The `localStorage` key string `"access_token"`. Single source of truth for this constant.               |

**Interceptors:**

- **Request:** Reads `ACCESS_TOKEN_KEY` from `localStorage` and appends `Authorization: Bearer <token>` if present.
- **Response (error):** Normalizes all API errors into a plain `Error` with `message`, `cause`, and `status` fields. Stores and pages can catch this and read `err.message` directly.

**Rule:** All HTTP requests in the application must go through this `api` instance. Never import `axios` directly in a store or component.

#### `lib/utils.js`

Exports `cn(...inputs)` - a utility that merges Tailwind class names using `clsx` and `tailwind-merge`. Used throughout components to conditionally apply classes.

---

### `components/`

Reusable UI building blocks shared across pages.

```
components/
├── Header.jsx        ← top navigation bar for dashboards
├── Sidebar.jsx       ← role-aware sidebar navigation
├── FormSelect.jsx    ← reusable select input wrapper
└── ui/               ← shadcn/ui auto-generated components (do not edit manually)
```

#### `Sidebar.jsx`

Reads `user.role` from `authStore` and renders the appropriate navigation links per role:

- `LIBRARIAN`: Dashboard, Members, Catalog
- `MEMBER`: Dashboard, Catalog
- `CAMPUS_MANAGEMENT`: Dashboard, Reports

**Rules:**

- Components may read from Zustand stores (read-only subscriptions for display purposes).
- Components must **not** call store actions or make API calls.
- Components must **not** hold global state.
- `components/ui/` is managed by shadcn CLI. Never manually edit files inside it.
- New reusable components that are used across multiple pages go in `components/` (not in `pages/`).

---

### `mocks/`

MSW-based API mocking for development and testing. Active when `VITE_USE_MOCKS !== "false"` in `development` mode.

```
mocks/
├── browser.js              ← MSW Service Worker setup (browser)
├── server.js               ← MSW server setup (for Vitest/node)
├── handlers/
│   ├── index.js            ← aggregates all handler arrays
│   └── authHandlers.js     ← handlers for /auth/* endpoints
└── data/
    ├── index.js            ← re-exports all mock data
    └── users.js            ← mock user objects
```

#### `mocks/browser.js`

Calls `setupWorker(...handlers)` from `msw/browser`. Used by `main.jsx` at startup.

#### `mocks/server.js`

Calls `setupServer(...handlers)` from `msw/node`. Used by the Vitest test setup to mock API calls in component tests.

#### `mocks/handlers/`

One handler file per API domain (mirroring backend routers). Each file exports a named array of MSW handler objects.

**Rules:**

- Handler files must import mock data from `mocks/data/`, never inline data objects.
- Handler files must import `baseURL` from `lib/api.js` to construct full endpoint URLs.
- Handlers should only implement the minimal logic needed to return a plausible response. Do not replicate real backend validation or business rules.
- `handlers/index.js` aggregates and exports all handler arrays as a single `handlers` array.

#### `mocks/data/`

Static JS modules exporting mock data objects. One file per domain area.

**Rules:**

- Data files export plain JS objects or arrays.
- Data must mirror the shape of real API response payloads.
- No logic in data files - only data definitions.

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
- Test setup lives in `test-setup.js` (configures `@testing-library/jest-dom` matchers and MSW server lifecycle).

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
