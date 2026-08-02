# Library Management System - Frontend

This is the frontend client for the Library Management System, built as a modern Single Page Application (SPA).

## 🚀 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **UI Components:** shadcn/ui
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **API Mocking:** Mock Service Worker (MSW)
- **Testing:** Vitest + React Testing Library + jsdom
- **Code Quality:** ESLint (v10) + Prettier

## 📦 Installed Libraries

### Core Dependencies

- `react`, `react-dom`: The core UI rendering ecosystem.
- `react-router-dom`: Client-side routing.
- `zustand`: Lightweight global state management.
- `axios`: Promise-based HTTP client for API requests.
- `tailwindcss`, `@tailwindcss/vite`: Utility-first CSS framework (v4).
- `lucide-react`: Beautiful vector icons.
- `clsx`, `tailwind-merge`, `class-variance-authority`: Utilities for constructing and merging Tailwind class names dynamically.
- `@radix-ui/react-slot`: Headless UI components used by shadcn/ui.

### Development Dependencies

- `eslint` (v10), `@eslint/js`: Core linting.
- `@eslint-react/eslint-plugin`: Comprehensive lint rules for React hooks and components.
- `prettier`, `prettier-plugin-tailwindcss`: Code formatting and automatic Tailwind class sorting.
- `vitest`, `@vitest/coverage-v8`, `jsdom`: The blazing fast test runner and browser environment simulation.
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`: Testing utilities that encourage good testing practices simulating user behavior.
- `msw`: Mock Service Worker for network-level API mocking during development.

## 📂 Project Structure

```text
src/
├── assets/
├── components/
│   ├── ui/
│   ├── Header.jsx
│   └── Sidebar.jsx
├── layouts/
│   ├── AppLayout.jsx
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── lib/
│   ├── api.js
│   └── utils.js
├── mocks/
│   ├── data/
│   ├── handlers/
│   │   ├── authHandlers.js
│   │   ├── booksHandlers.js
│   │   ├── ...
│   │   └── index.js
│   ├── browser.js
│   └── server.js
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── librarian/
│   ├── management/
│   ├── member/
│   └── HomePage.jsx
└── store/
    ├── authStore.js
    ├── bookStore.js
    └── ...
```

## 🏗️ Architecture

- **Components:** Render data read from a store, capture user interaction, and call store actions in response.
- **Stores:** Hold the relevant slice of app state, make the API call directly (via the shared `axios` instance in `lib/api.js`), update state from the response, and surface errors.
- **Mocking:** MSW intercepts outgoing requests at the network level via handlers defined per-domain in `mocks/handlers/`, backed by mock data in `mocks/data/`. This is why there is no separate API/service layer — MSW already mocks at the HTTP boundary, so stores can make API calls directly without needing an extra indirection layer.

## 🛠️ Commands

To get started with development, follow these steps.

> **Prerequisite:** Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Install Dependencies

```bash
npm install
```

Installs all the required core and development packages.

### Run Development Server

To start the Vite local development server with Hot Module Replacement (HMR) and API mocking active (default):

```bash
npm run dev
```

To start the development server with the mock service worker disabled, allowing requests to hit the actual API server:

```bash
npm run dev:no-mock
```

In either case, you can access the app at `http://localhost:5173`.

### Run Tests

```bash
npm run test
```

Executes the Vitest test suite. Tests are co-located with their respective components (e.g., `App.test.jsx`).

### Linting

To check the codebase for errors and bad practices using ESLint:

```bash
npm run lint
```

To automatically fix linting errors and warnings where possible:

```bash
npm run lint:fix
```

### Formatting

To automatically format all files in the project using Prettier and sort Tailwind classes:

```bash
npm run format
```

To check if all files in the project are formatted correctly, without making any changes:

```bash
npm run format:check
```

### Validation

To run all checks (formatting, linting, and tests) sequentially before committing:

```bash
npm run validate
```

### Build for Production

```bash
npm run build
```

Creates an optimized, production-ready static build of the application in the `dist/` directory. You can preview this build locally by running `npm run preview`.
