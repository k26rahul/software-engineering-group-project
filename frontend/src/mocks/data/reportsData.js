export const usageReportMockData = {
  summary: {
    total_checkouts: 142,
    active_borrowers: 38,
    popular_category: "Technology",
    avg_borrow_duration_days: 11.4,
    return_rate_percentage: 94.2,
  },
  monthly_trends: [
    { month: "Feb 2026", checkouts: 18, returns: 16 },
    { month: "Mar 2026", checkouts: 24, returns: 22 },
    { month: "Apr 2026", checkouts: 31, returns: 29 },
    { month: "May 2026", checkouts: 28, returns: 27 },
    { month: "Jun 2026", checkouts: 35, returns: 31 },
    { month: "Jul 2026", checkouts: 26, returns: 24 },
  ],
  category_breakdown: [
    { category: "Technology", checkouts: 52, percentage: 36.6 },
    { category: "Science", checkouts: 34, percentage: 23.9 },
    { category: "Fiction", checkouts: 28, percentage: 19.7 },
    { category: "History", checkouts: 16, percentage: 11.3 },
    { category: "Biography", checkouts: 12, percentage: 8.5 },
  ],
  top_borrowed_books: [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Technology", checkouts: 28, available: 2 },
    { id: 3, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", checkouts: 22, available: 3 },
    { id: 7, title: "Design Patterns", author: "Erich Gamma et al.", category: "Technology", checkouts: 19, available: 4 },
    { id: 5, title: "Sapiens", author: "Yuval Noah Harari", category: "History", checkouts: 17, available: 2 },
    { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", checkouts: 14, available: 1 },
  ],
};

export const expenseReportMockData = {
  summary: {
    total_budget: 60000.0,
    total_spent: 19500.0,
    fine_income: 1850.0,
    net_spend: 17650.0,
    budget_utilization_percent: 32.5,
  },
  monthly_expenses: [
    { month: "Feb 2026", budget: 10000, spent: 2000, income: 250 },
    { month: "Mar 2026", budget: 10000, spent: 3400, income: 400 },
    { month: "Apr 2026", budget: 10000, spent: 4100, income: 300 },
    { month: "May 2026", budget: 10000, spent: 1500, income: 200 },
    { month: "Jun 2026", budget: 10000, spent: 6200, income: 500 },
    { month: "Jul 2026", budget: 10000, spent: 2300, income: 200 },
  ],
  expense_items: [
    { id: 1, date: "2026-07-15", description: "O'Reilly Technical Books Purchase", category: "Book Acquisition", amount: 1500.0, status: "APPROVED" },
    { id: 2, date: "2026-07-02", description: "ACM Digital Library Monthly Subscription", category: "Subscription", amount: 800.0, status: "PAID" },
    { id: 3, date: "2026-06-28", description: "Binding & Repair for Damaged Volume Copies", category: "Maintenance", amount: 1200.0, status: "PAID" },
    { id: 4, date: "2026-06-14", description: "Annual IEEE Access Journal Renewal", category: "Subscription", amount: 3500.0, status: "PAID" },
    { id: 5, date: "2026-06-01", description: "New Fiction Bestseller Additions", category: "Book Acquisition", amount: 1500.0, status: "PAID" },
  ],
};
