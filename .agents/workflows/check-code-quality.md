---
description: Reviews the entire codebase (or backend/frontend/both as selected) for architectural violations and code quality issues based on review scope and depth. Produces a detailed report artifact and runs automated checks.
---

# Check Code Quality Workflow

## Step 1 - Select Scope & Review Depth

Ask the user using the `ask_question` tool the following questions:

1. **Target Scope**: Which part of the codebase to review.
   - Backend (`backend/`)
   - Frontend (`frontend/`)
   - Both Backend and Frontend

2. **Review Depth / Focus**: The purpose and depth of the review.
   - **Architectural Violations Only**: Focus strictly on enforcing architectural rules and invariants.
   - **Comprehensive Review**: Include architectural violations as well as improvement suggestions (code quality, performance, maintainability, and best practices).

Wait for the user's response before proceeding.

## Step 2 - Read Architecture Context

Based on the selected scope:
- If **Backend** or **Both** is selected → read `backend/ARCHITECTURE.md`.
- If **Frontend** or **Both** is selected → read `frontend/ARCHITECTURE.md`.
- If **Frontend** is selected and involves API endpoints, request/response models, or store actions → also read `backend/ARCHITECTURE.md`.

## Step 3 - Code Review & Architectural Inspection

Scan, read, and inspect source files in the selected scope (`backend/`, `frontend/`, or both) based on the chosen review depth:

1. **Architectural Violations**: Check against all rules and invariants defined in the architecture files read in Step 2. Pay special attention to the "Key Invariants" section of each architecture file. Strictly enforce documented rules.
2. **Improvement & Optimization Suggestions** (if Comprehensive Review was selected): Identify areas that can be implemented in a better way (e.g., refactoring opportunities, performance enhancements, error handling improvements, code cleanliness).

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
- Review Depth: Violations Only / Comprehensive Review
- Files reviewed (list or summary by component)

## Architectural Violations
For each violation:
- **File:** `path/to/file.ext` (line N)
- **Rule violated:** [exact rule name]
- **Problem:** What is wrong and why it violates the architecture.
- **Fix:** The correct way to write it, with a short code example if helpful.

If no violations found, state: "No architectural violations found."

## Improvement & Optimization Suggestions (Comprehensive Mode)
For each suggestion (if Comprehensive Review selected):
- **File:** `path/to/file.ext` (line N)
- **Category:** Performance / Maintainability / Code Style / Best Practice
- **Observation:** What can be done in a better way.
- **Recommendation:** Suggested improvement with code snippet.

If no suggestions or in Violations Only mode, state: "N/A or No additional suggestions."

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

The report must be specific. Vague findings like "this looks wrong" are not acceptable. Every finding must name the file, the line or block, the rule or category, and the correct fix or recommendation.
