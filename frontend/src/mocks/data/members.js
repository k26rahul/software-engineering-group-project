export const borrowingHistory = {
  1: [
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
  ],
};

export const currentIssues = {
  1: [
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
  ],
};

export const payments = {
  1: [
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
  ],
};

export const recommendations = {
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

export const readingLists = [
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
