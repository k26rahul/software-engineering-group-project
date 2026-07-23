import { create } from "zustand";
import api from "@/lib/api";

const useTransactionStore = create((set) => ({
  activeTransactions: [],
  isLoading: false,
  error: null,
  actionLoading: {},

  budget: null,
  budgetLoading: false,
  budgetError: null,

  fetchActiveTransactions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      const response = await api.get(`/transactions/active?${query.toString()}`);
      set({ activeTransactions: response.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  issueBook: async (member_id, book_id, copy_id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/transactions/issue", { member_id, book_id, copy_id });
      set((state) => ({
        activeTransactions: [...state.activeTransactions, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  returnBook: async (transactionId) => {
    set((state) => ({ actionLoading: { ...state.actionLoading, [transactionId]: true } }));
    try {
      const response = await api.patch(`/transactions/${transactionId}/return`);
      set((state) => ({
        activeTransactions: state.activeTransactions.filter(
          (t) => t.transaction_id !== transactionId
        ),
        actionLoading: { ...state.actionLoading, [transactionId]: false },
      }));
      return response.data;
    } catch (err) {
      set((state) => ({ actionLoading: { ...state.actionLoading, [transactionId]: false } }));
      throw err;
    }
  },

  fetchBudget: async () => {
    set({ budgetLoading: true, budgetError: null });
    try {
      const response = await api.get("/budget");
      set({ budget: response.data, budgetLoading: false });
    } catch (err) {
      set({ budgetError: err.message, budgetLoading: false });
    }
  },

  addBudgetEntry: async (entryData) => {
    const response = await api.post("/budget/entries", entryData);
    set((state) => ({
      budget: state.budget
        ? {
            ...state.budget,
            entries: [...state.budget.entries, response.data],
            budget_spent:
              entryData.type === "EXPENSE"
                ? state.budget.budget_spent + entryData.amount
                : state.budget.budget_spent - entryData.amount,
            total_expenses:
              entryData.type === "EXPENSE"
                ? state.budget.total_expenses + entryData.amount
                : state.budget.total_expenses,
            total_income:
              entryData.type === "INCOME"
                ? state.budget.total_income + entryData.amount
                : state.budget.total_income,
          }
        : null,
    }));
    return response.data;
  },
}));

export default useTransactionStore;
