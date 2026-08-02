// Mock response for GET /members/:id/history
export const borrowingHistory = [
  {
    transaction_id: 101,
    book_title: "Introduction to Algorithms",
    issue_date: "2026-06-01",
    due_date: "2026-06-15",
    return_date: "2026-06-14",
    is_overdue: false,
  },
  {
    transaction_id: 102,
    book_title: "Clean Code",
    issue_date: "2026-06-10",
    due_date: "2026-06-25",
    return_date: "2026-06-26",
    is_overdue: true,
  },
];

// Mock response for GET /members/:id/current-issues
export const currentIssues = [
  {
    transaction_id: 201,
    book_title: "Designing Data-Intensive Applications",
    issue_date: "2026-07-01",
    due_date: "2026-07-15",
    is_overdue: false,
  },
  {
    transaction_id: 202,
    book_title: "The Pragmatic Programmer",
    issue_date: "2026-06-20",
    due_date: "2026-07-05",
    is_overdue: true,
  },
];

// Mock response for GET /members/:id/payments
export const payments = [
  {
    id: 301,
    amount: 50.0,
    type: "FINE_PAYMENT",
    status: "PAID",
    created_at: "2026-06-26T14:30:00Z",
  },
  {
    id: 302,
    amount: 100.0,
    type: "MEMBERSHIP_FEE",
    status: "PAID",
    created_at: "2026-05-15T10:15:00Z",
  },
];

// Mock response for GET /members/:id/recommendations
export const recommendations = [
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
];
