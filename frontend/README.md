# Library Management System - Frontend

This is the frontend client for the Library Management System, built as a modern Single Page Application (SPA).

## 🚀 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **UI Components:** shadcn/ui (Accessible, customizable primitives)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
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

## 🛠️ Commands

To get started with development, follow these steps. 

> **Prerequisite:** Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Install Dependencies
```bash
npm install
```
Installs all the required core and development packages.

### Run Development Server
```bash
npm run dev
```
Starts the Vite local development server with Hot Module Replacement (HMR). You can access the app at `http://localhost:5173`.

### Run Tests
```bash
npm run test
```
Executes the Vitest test suite. Tests are co-located with their respective components (e.g., `App.test.jsx`).

### Run Linting
```bash
npm run lint
```
Checks the codebase for errors and bad practices using ESLint.

### Run Formatting
```bash
npm run format
```
Automatically formats all files in the project using Prettier and sorts Tailwind classes.

### Build for Production
```bash
npm run build
```
Creates an optimized, production-ready static build of the application in the `dist/` directory. You can preview this build locally by running `npm run preview`.
