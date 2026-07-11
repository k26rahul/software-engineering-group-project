import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";

export const dashboardHandlers = [
  http.get(`${baseURL}/dashboard/librarian`, () => {
    return HttpResponse.json({
      pending_approvals_count: 2,
      overdue_books_count: 1,
      active_reservations_count: 1,
      budget_spent: 2300.0,
      budget_limit: 10000.0,
      pending_approvals: [
        {
          id: 4,
          name: "Sneha Reddy",
          email: "pending_member1@example.com",
          created_at: "2026-07-10",
        },
        {
          id: 5,
          name: "Amit Patel",
          email: "pending_member2@example.com",
          created_at: "2026-07-11",
        },
      ],
      recent_overdue_books: [
        {
          transaction_id: 1,
          title: "The Catcher in the Rye",
          borrower_name: "Vaishnavi",
          due_date: "2026-06-15",
          days_overdue: 26,
        },
      ],
    });
  }),

  http.get(`${baseURL}/dashboard/management`, () => {
    return HttpResponse.json({
      total_members: 4,
      active_members: 2,
      active_issues: 2,
      total_books: 4,
      budget_spent: 2300.0,
      budget_limit: 10000.0,
      monthly_stats: [
        { name: "Feb 2026", issues: 5, spent: 2000 },
        { name: "Mar 2026", issues: 8, spent: 3400 },
        { name: "Apr 2026", issues: 12, spent: 4100 },
        { name: "May 2026", issues: 9, spent: 1500 },
        { name: "Jun 2026", issues: 15, spent: 6200 },
        { name: "Jul 2026", issues: 2, spent: 2300 },
      ],
      category_stats: [
        { name: "Fiction", value: 2 },
        { name: "Computer Science", value: 1 },
        { name: "Science", value: 1 },
      ],
    });
  }),
];
