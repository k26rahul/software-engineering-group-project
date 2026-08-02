---
description: Validates frontend, backend, or both using individual formatting, linting, and testing commands from tasks.json. Automatically runs fix commands and repairs failures when detected.
---

# Validate and Fix Workflow

This workflow executes formatting, linting, and testing commands step-by-step for the chosen target scope. If any command fails, it automatically runs fix commands or repairs the failing code/tests before moving to the next step.

## Step 1 - Select Scope

Ask the user using the `ask_question` tool:

1. **Target Scope**: Which part of the codebase to validate and fix?
   - **Backend** (`backend/`)
   - **Frontend** (`frontend/`)
   - **Both Backend and Frontend**

Wait for the user's response before proceeding.

---

## Step 2 - Backend Validation & Auto-Fix

If **Backend** or **Both** was selected in Step 1, run each command separately from the `backend/` directory.

### 1. Format Check & Fix
- Run format check:
  ```powershell
  uv run ruff format --check .
  ```
- **If Check Fails**: Run auto-formatting command:
  ```powershell
  uv run ruff format .
  ```
- Verify `uv run ruff format --check .` passes.

### 2. Lint Check & Fix
- Run lint check:
  ```powershell
  uv run ruff check .
  ```
- **If Check Fails**:
  1. Run auto-fix command:
     ```powershell
     uv run ruff check --fix .
     ```
  2. If lint errors remain, inspect the output, locate the affected files, and fix the remaining code quality issues.
  3. Verify `uv run ruff check .` passes cleanly.

### 3. Test Suite
- Run test suite:
  ```powershell
  uv run pytest
  ```
- **If Tests Fail**:
  1. Inspect the pytest failure tracebacks and error messages.
  2. Read the failing test files and underlying implementation code.
  3. Fix the bugs or update out-of-date tests to restore contract validity.
  4. Re-run `uv run pytest` until all tests pass.

---

## Step 3 - Frontend Validation & Auto-Fix

If **Frontend** or **Both** was selected in Step 1, run each command separately from the `frontend/` directory using the Node CLI workaround: `node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"`.

### 1. Format Check & Fix
- Run format check:
  ```powershell
  node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run format:check
  ```
- **If Check Fails**: Run auto-formatting command:
  ```powershell
  node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run format
  ```
- Verify `format:check` passes cleanly.

### 2. Lint Check & Fix
- Run lint check:
  ```powershell
  node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run lint
  ```
- **If Check Fails**:
  1. Run auto-fix command:
     ```powershell
     node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run lint:fix
     ```
  2. If ESLint warnings or errors remain, inspect the failure output, edit the code, and re-run lint check.
  3. Verify `lint` passes cleanly.

### 3. Test Suite
- Run test suite:
  ```powershell
  node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run test
  ```
- **If Tests Fail**:
  1. Inspect the Vitest error output and failing assertions.
  2. Examine component, store, handler, or test source files.
  3. Resolve the test failures and re-run `run test` until all tests pass.

### 4. Build Verification
- Run build check:
  ```powershell
  node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build
  ```
- **If Build Fails**: Inspect build diagnostics (e.g. missing imports, syntax errors), repair the issues, and confirm `build` succeeds.

---

## Step 4 - Final Summary & Report

After running all steps for the selected scope, summarize the outcome in a clean markdown table showing the status of each check:

| Target | Step | Initial Status | Auto-Fix / Repair Applied | Final Status |
| :--- | :--- | :--- | :--- | :--- |
| Backend | Format | PASS / FAIL | Applied `ruff format` | PASS |
| Backend | Lint | PASS / FAIL | Applied `ruff check --fix` / Code Edit | PASS |
| Backend | Tests | PASS / FAIL | Code/Test Repair | PASS |
| Frontend | Format | PASS / FAIL | Applied `npm run format` | PASS |
| Frontend | Lint | PASS / FAIL | Applied `npm run lint:fix` / Code Edit | PASS |
| Frontend | Tests | PASS / FAIL | Code/Test Repair | PASS |
| Frontend | Build | PASS / FAIL | Code Repair | PASS |
