import { http, HttpResponse } from "msw";
import {
  users,
  borrowingHistory,
  currentIssues,
  payments,
  recommendations,
  readingLists,
} from "@/mocks/data";
import { baseURL } from "@/lib/api";

// Helper to find a user by ID
const findUserById = (id) => {
  return Object.values(users).find((user) => user.id === id);
};

export const memberHandlers = [
  // GET /members/{id}
  http.get(`${baseURL}/members/:id`, async ({ params }) => {
    const userId = parseInt(params.id);
    const user = findUserById(userId);

    if (!user) {
      return new HttpResponse(JSON.stringify({ detail: "Member not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return HttpResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      role: user.role,
      membership_type: user.membership_type || "ON_CAMPUS",
      approval_status: user.approval_status || "APPROVED",
      is_active: user.is_active,
      created_at: user.created_at,
      membership_start_date: user.membership_start_date || null,
      max_issue_limit: user.max_issue_limit || 5,
    });
  }),

  // PATCH /members/{id}/profile
  http.patch(`${baseURL}/members/:id/profile`, async ({ params, request }) => {
    const userId = parseInt(params.id);
    const user = findUserById(userId);

    if (!user) {
      return new HttpResponse(JSON.stringify({ detail: "Member not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, phone } = await request.json();

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    // Persist update back into mock users data
    const emailKey = Object.keys(users).find((key) => users[key].id === userId);
    if (emailKey && users[emailKey]) {
      if (name !== undefined) users[emailKey].name = name;
      if (phone !== undefined) users[emailKey].phone = phone;
    }

    return HttpResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      role: user.role,
      membership_type: user.membership_type || "ON_CAMPUS",
      approval_status: user.approval_status || "APPROVED",
      is_active: user.is_active,
      created_at: user.created_at,
    });
  }),

  // GET /members/{id}/history
  http.get(`${baseURL}/members/:id/history`, async ({ params }) => {
    const userId = parseInt(params.id);
    const history = borrowingHistory[userId] || [];
    return HttpResponse.json(history);
  }),

  // GET /members/{id}/current-issues
  http.get(`${baseURL}/members/:id/current-issues`, async ({ params }) => {
    const userId = parseInt(params.id);
    const issues = currentIssues[userId] || [];
    return HttpResponse.json(issues);
  }),

  // GET /members/{id}/payments
  http.get(`${baseURL}/members/:id/payments`, async ({ params }) => {
    const userId = parseInt(params.id);
    const userPayments = payments[userId] || [];
    return HttpResponse.json(userPayments);
  }),

  // GET /members/{id}/recommendations
  http.get(`${baseURL}/members/:id/recommendations`, async ({ params }) => {
    const userId = parseInt(params.id);
    const recs = recommendations[userId] || [];
    return HttpResponse.json(recs);
  }),

  // GET /reading-lists
  http.get(`${baseURL}/reading-lists`, async () => {
    return HttpResponse.json(readingLists);
  }),
];
