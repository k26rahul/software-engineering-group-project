---
description: Guidelines and workflow for refactoring MSW mock handlers to be static and simple without stateful backend simulation or CRUD logic.
---

# Simplify MSW Handlers Workflow

This workflow provides principles, rules, and step-by-step instructions for refactoring frontend Mock Service Worker (MSW) handlers in `frontend/src/mocks/handlers/`.

---

## 1. Core Philosophy: "Dumb is Better"

- **Primary Goal**: MSW mock handlers exist **only** to serve static dummy data so UI components can render correctly for screenshots, UI layout inspection, and component testing.
- **Non-Goals**: MSW handlers are **NOT** meant to simulate a working backend.
  - Do NOT implement stateful operations, in-memory databases, or CRUD synchronization across handlers.
  - Do NOT write logic just to make UI buttons functional or reflect UI mutations.
  - Do NOT parse request bodies or url search parameters unless strictly required for basic auth/dev flows (e.g., resolving token in `GET /auth/me`).

---

## 2. Refactoring Rules for MSW Handlers

1. **Remove Stateful In-Memory Structures**
   - Delete `structuredClone`, mutable arrays (e.g., `membersDB`), and helper functions that mutate arrays (e.g., `addMemberToDirectory`).
   - Remove state synchronization across handler files.

2. **Remove Query Parameter Filtering**
   - Do NOT parse `new URL(request.url)` or search params (`search`, `status`, etc.).
   - Return static mock data arrays directly from `mocks/data/` (e.g., `HttpResponse.json(membersList)`).

3. **Simplify Mutation Handlers (PATCH / POST / PUT / DELETE)**
   - Do NOT parse `request.json()` to reconstruct updated objects.
   - For endpoints returning 204: `return new HttpResponse(null, { status: 204 })`.
   - For endpoints returning updated objects: return static mock item directly (e.g., `HttpResponse.json(membersList[0])`).

4. **Simplify Resource Identifiers (GET /resource/:id)**
   - Look up static mock item or fallback to first item in mock data array:
     ```javascript
     const item = mockList.find((m) => m.id === parseInt(params.id)) || mockList[0];
     return HttpResponse.json(item);
     ```

---

## 3. Mandatory Endpoint Comment Annotations

Every MSW handler in `frontend/src/mocks/handlers/*.js` **must** have a clear, single-line comment directly above the `http.<method>` call specifying the HTTP method, endpoint path, and associated backend response schema.

### Comment Format
```javascript
// <METHOD> <endpoint_path> - Response: <schema_file>/<SchemaClassName>
```

### Examples
```javascript
// GET /members - Response: list[user/MemberSummaryResponse]
http.get(`${baseURL}/members`, () => {
  return HttpResponse.json(membersList);
});

// PATCH /members/{id}/approve - Response: None (204 No Content)
http.patch(`${baseURL}/members/:id/approve`, () => {
  return new HttpResponse(null, { status: 204 });
});

// GET /members/{id} - Response: user/MemberDetailResponse
http.get(`${baseURL}/members/:id`, ({ params }) => {
  const member = membersList.find((m) => m.id === parseInt(params.id)) || membersList[0];
  return HttpResponse.json(member);
});

// GET /members/{id}/history - Response: list[transaction/TransactionHistoryItemResponse]
http.get(`${baseURL}/members/:id/history`, () => {
  return HttpResponse.json(borrowingHistory);
});
```

---

## 4. Backend Schema Verification Checklist

When adding or editing schema annotations in MSW handlers:
1. Open `backend/schemas/` and find the matching Pydantic/SQLModel schema class (e.g., `user.py`, `transaction.py`, `payment.py`, `book.py`).
2. Verify the class exists and is exported in `backend/schemas/__init__.py`.
3. Check corresponding router specification in `backend/routers/` to ensure exact contract alignment.
4. Ensure schema names follow domain module naming conventions (e.g. `TransactionHistoryItemResponse` under `transaction.py`).
