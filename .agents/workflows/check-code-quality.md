---
description: Reviews the entire codebase (or backend/frontend/both as selected) for architectural violations and code quality issues. Produces a detailed report artifact and runs automated checks.
---

# Check Code Quality Workflow

## Step 1 - Select Scope

Ask the user using the `ask_question` tool whether they want to review the backend, frontend, or both.

Prompt options:
1. Backend (`backend/`)
2. Frontend (`frontend/`)
3. Both Backend and Frontend

Wait for the user's response before proceeding.

## Step 2 - Read Architecture Context

Based on the user's selection:
- If **Backend** or **Both** is selected → read `backend/ARCHITECTURE.md`.
- If **Frontend** or **Both** is selected → read `frontend/ARCHITECTURE.md`.
- If **Frontend** is selected and involves API endpoints, request/response models, or store actions → also read `backend/ARCHITECTURE.md`.

## Step 3 - Code Review & Architectural Inspection

Scan, read, and inspect source files in the selected scope (`backend/`, `frontend/`, or both) for violations against the architecture rules read in Step 2.

Ensure you enforce **all rules and invariants** defined in the architecture files read in Step 2. Pay special attention to the "Key Invariants" section of each architecture file. Do not invent new rules, but strictly enforce the ones documented in the respective architecture files.

## Step 4 - Run Automated Checks

Run the following commands based on the selected scope. Capture their output for inclusion in the report.

**If Backend or Both is selected** (run from `backend/` directory):
```
uv run ruff format --check .
uv run ruff check .
uv run pytest
```

**If Frontend or Both is selected** (run from `frontend/` directory):
```
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run validate
```

## Step 5 - Generate Report Artifact

Create a markdown report artifact named `code_quality_report.md`. The report must include:

### Report Structure

```
# Code Quality Report

## Summary
- Date/time of review
- Target Scope: Backend / Frontend / Both
- Files reviewed (list or summary by component)

## Architectural Violations
For each violation:
- **File:** `path/to/file.ext` (line N)
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
