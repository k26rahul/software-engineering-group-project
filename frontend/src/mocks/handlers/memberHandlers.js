import { http, HttpResponse } from "msw";
import { users } from "@/mocks/data";
import { baseURL } from "@/lib/api";

// Helper to find a user by ID
const findUserById = (id) => {
  if (id === 1) {
    const user = users["member@example.com"];
    if (user) {
      return {
        id: 1,
        phone: user.phone || "9876543210",
        membership_type: "ON_CAMPUS",
        approval_status: "APPROVED",
        is_active: true,
        created_at: "2025-05-15T10:00:00Z",
        membership_start_date: "2025-05-15",
        max_issue_limit: 5,
        ...user,
      };
    }
  }
  if (id === 10) {
    const user = users["librarian@example.com"];
    if (user) {
      return {
        id: 10,
        phone: user.phone || "9876543201",
        approval_status: "APPROVED",
        is_active: true,
        created_at: "2025-01-01T09:00:00Z",
        ...user,
      };
    }
  }
  if (id === 20) {
    const user = users["management@example.com"];
    if (user) {
      return {
        id: 20,
        phone: user.phone || "9876543202",
        approval_status: "APPROVED",
        is_active: true,
        created_at: "2025-01-01T09:00:00Z",
        ...user,
      };
    }
  }
  return Object.values(users).find((user) => user.id === id);
};

// In-memory data for borrow history, current issues, payments, and recommendations
const borrowingHistory = {
  1: [
    {
      transaction_id: 101,
      book_title: "Introduction to Algorithms",
      issue_date: "2025-06-01",
      due_date: "2025-06-15",
      return_date: "2025-06-14",
      is_overdue: false,
    },
    {
      transaction_id: 102,
      book_title: "Clean Code",
      issue_date: "2025-06-10",
      due_date: "2025-06-25",
      return_date: "2025-06-26",
      is_overdue: true,
    },
  ],
};

const currentIssues = {
  1: [
    {
      transaction_id: 201,
      book_title: "Designing Data-Intensive Applications",
      issue_date: "2025-07-01",
      due_date: "2025-07-15",
      is_overdue: false,
    },
    {
      transaction_id: 202,
      book_title: "The Pragmatic Programmer",
      issue_date: "2025-06-20",
      due_date: "2025-07-05",
      is_overdue: true,
    },
  ],
};

const payments = {
  1: [
    {
      id: 301,
      amount: 50.0,
      type: "FINE_PAYMENT",
      status: "PAID",
      created_at: "2025-06-26T14:30:00Z",
    },
    {
      id: 302,
      amount: 100.0,
      type: "MEMBERSHIP_FEE",
      status: "PAID",
      created_at: "2025-05-15T10:15:00Z",
    },
  ],
};

const recommendations = {
  1: [
    {
      id: 401,
      title: "Refactoring: Improving the Design of Existing Code",
      author: "Martin Fowler",
      category: "Software Engineering",
      availability: 3,
    },
    {
      id: 402,
      title: "Compilers: Principles, Techniques, and Tools",
      author: "Alfred Aho",
      category: "Computer Science",
      availability: 1,
    },
  ],
};

const readingLists = [
  {
    id: 501,
    title: "Must-Read Tech Classics",
    description: "Essential reading for every software engineer.",
    books: [
      { id: 401, title: "Refactoring" },
      { id: 403, title: "Mythical Man-Month" },
    ],
  },
  {
    id: 502,
    title: "Getting Started with Python & FastAPI",
    description: "Curated lists for learning modern Python backend development.",
    books: [{ id: 404, title: "Fluent Python" }],
  },
];

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

    // Persist update back into our mock data
    const idToEmail = {
      1: "member@example.com",
      10: "librarian@example.com",
      20: "management@example.com",
    };
    const emailKey = idToEmail[userId];
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
