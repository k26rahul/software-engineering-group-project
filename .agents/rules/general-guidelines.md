---
trigger: always_on
glob:
description: General project guidelines and restrictions.
---

## Architecture Files

- **Backend tasks:** Read `backend/ARCHITECTURE.md` before writing or reviewing any backend code.
- **Frontend tasks:** Read `frontend/ARCHITECTURE.md` before writing or reviewing any frontend code.
- **Cross-concern rule:** When doing frontend work that involves API endpoints, request bodies, or response shapes, also read `backend/ARCHITECTURE.md` to understand the contract. You do not need the backend architecture for pure UI tasks (layout, styling, local state, routing).

## Restrictions
- **DO NOT** read any PDF files anywhere in the project. Reading PDFs wastes tokens unnecessarily.
- **DO NOT** run any formatting, linting, or testing unless explicitly asked.
