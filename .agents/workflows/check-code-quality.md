---
description: Reviews staged and unstaged changes for architectural violations and code quality issues. Produces a detailed report artifact and runs automated checks.
---

# Check Code Quality Workflow

## Step 1 - Understand the Changes

Run `git diff HEAD` from the repository root to see all pending changes (staged and unstaged). Read the full diff carefully.

From the diff, determine:
- **Which side is affected?** Backend (`backend/`), frontend (`frontend/`), or both?
- **What is the direction of work?** What feature or fix is being implemented?

## Step 2 - Read Architecture Context

Based on what the diff touches:
- If any `backend/` files changed → read `backend/ARCHITECTURE.md`.
- If any `frontend/` files changed → read `frontend/ARCHITECTURE.md`.
- If frontend changes involve API endpoints, request/response models, or store actions that call the API → also read `backend/ARCHITECTURE.md`.

## Step 3 - Read Relevant Source Files

For every file that appears in the diff, read its **complete current content** (not just the diff). This is necessary to catch violations that may not be obvious from the diff alone (e.g., a router that was already making DB calls before this change, or a component that already had an API call the diff builds on).

## Step 4 - Architectural Review

Using the architecture rules from the files you read in Step 2, inspect every changed file for violations. Check each applicable rule:

**Backend rules to enforce:**
- No `session.*` calls inside `routers/`.
- No business logic, conditional rules, or `HTTPException` raised inside `routers/`.
- Every router endpoint declares `response_model=` using a schema class from `models/`.
- Services receive typed arguments; all DB mutations happen in `services/`.
- Role enforcement uses `LibrarianDep`, `MemberDep`, `ManagementDep`, `StaffDep`, `CurrentUserDep` - never a manual `if user.role == ...` check in a router.
- No `table=True` model returned directly as a response; a schema class must be used.
- Model methods are only permitted for self-contained, instance-level logic with no multi-entity business rules.
- New domain areas have matching files in `models/`, `routers/`, `services/`, and the router is registered in `main.py`.

**Frontend rules to enforce:**
- No `api` (Axios) calls outside of `store/`. Pages and components must never call `api` directly.
- No global state (`useAuthStore`, other stores' `setState`) mutated inside pages or components.
- No direct `localStorage` access outside of `store/authStore.js` and `lib/api.js`.
- Child routes for dashboards (`/librarian/*`, `/member/*`, `/management/*`) must be declared inside their respective dashboard component, not in `App.jsx`.
- Mock handlers must import data from `mocks/data/`; no inline data objects inside handler files.
- `components/ui/` must not be manually edited.
- New stores must follow the `authStore.js` pattern.
- All HTTP goes through `lib/api.js`; `axios` must not be imported directly anywhere else.

## Step 5 - Run Automated Checks

Run the following commands. Capture their output for inclusion in the report.

**If backend files changed** (run from `backend/` directory):
```
uv run ruff format --check .
uv run ruff check .
uv run pytest
```

**If frontend files changed** (run from `frontend/` directory):
```
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run validate
```

## Step 6 - Generate Report Artifact

Create a markdown report artifact named `code_quality_report.md`. The report must include:

### Report Structure

```
# Code Quality Report

## Summary
- Date/time of review
- Files reviewed (list)
- Direction of work inferred from the diff

## Architectural Violations
For each violation:
- **File:** `path/to/file.py` (line N)
- **Rule violated:** [exact rule name]
- **Problem:** What is wrong and why it violates the architecture.
- **Fix:** The correct way to write it, with a short code example if helpful.

If no violations found, state: "No architectural violations found."

## Automated Check Results
### Backend (if applicable)
- Ruff format check: PASS / FAIL (paste relevant output on failure)
- Ruff lint check: PASS / FAIL (paste relevant output on failure)
- pytest: PASS / FAIL (paste failure summary)

### Frontend (if applicable)
- npm run validate: PASS / FAIL (paste relevant output on failure)

## Overall Verdict
PASS or FAIL, with a one-line reason.
```

The report must be specific. Vague findings like "this looks wrong" are not acceptable. Every finding must name the file, the line or block, the rule violated, and the correct fix.

