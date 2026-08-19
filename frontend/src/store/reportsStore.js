import { create } from "zustand";
import api from "@/lib/api";

const useReportsStore = create((set) => ({
  usageReport: null,
  expenseReport: null,
  isLoading: false,
  error: null,
  downloadingType: null,

  fetchReportsData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [usageRes, expenseRes] = await Promise.all([
        api.get("/reports/usage"),
        api.get("/reports/expense"),
      ]);

      set({
        usageReport: {
          summary: {
            total_checkouts: usageRes.data.books_issued || 0,
            active_borrowers: usageRes.data.active_members || 0,
            popular_category: (usageRes.data.popular_categories && usageRes.data.popular_categories.length > 0) ? usageRes.data.popular_categories[0] : "None",
            avg_borrow_duration_days: 0,
            return_rate_percentage: 0,
          },
          monthly_trends: usageRes.data.monthly_trends || [],
          category_breakdown: usageRes.data.category_breakdown || [],
          top_borrowed_books: usageRes.data.top_borrowed_books || [],
        },
        expenseReport: {
          summary: expenseRes.data.summary || {
            total_budget: 0,
            total_spent: 0,
            fine_income: 0,
            net_spend: 0,
            budget_utilization_percent: 0,
          },
          monthly_expenses: expenseRes.data.monthly_expenses || [],
          expense_items: (expenseRes.data.items || []).map((item, index) => ({
            id: index,
            date: item.purchase_date,
            description: item.title,
            category: item.category || "General",
            amount: item.total_cost,
            status: "PAID"
          })),
        },
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to load management reports data.",
        isLoading: false,
      });
    }
  },

  downloadReport: async (type) => {
    set({ downloadingType: type });
    try {
      const response = await api.get(`/reports/download/${type}`);
      set({ downloadingType: null });
      return response.data;
    } catch (err) {
      set({ downloadingType: null });
      throw err;
    }
  },
}));

export default useReportsStore;
