import { create } from "zustand";
import api from "@/lib/api";

const useTransactionStore = create((set) => ({
  activeTransactions: [],
  allTransactions: [],
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

  fetchAllTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/transactions/active");
      set({ allTransactions: response.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  issueBook: async (member_id, book_id, copy_id, due_date) => {
    set({ isLoading: true, error: null });
    try {
      const body = { member_id, book_id, copy_id };
      if (due_date) body.due_date = due_date;
      const response = await api.post("/transactions/issue", body);
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
      const response = await api.post(`/transactions/return`, {
        transaction_id: transactionId,
        condition: "GOOD",
      });
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

  initiateReturn: async (transactionId, condition) => {
    set((state) => ({ actionLoading: { ...state.actionLoading, [transactionId]: true } }));
    try {
      const response = await api.post(`/transactions/${transactionId}/initiate-return`, {
        condition,
      });
      set((state) => ({ actionLoading: { ...state.actionLoading, [transactionId]: false } }));
      return response.data;
    } catch (err) {
      set((state) => ({ actionLoading: { ...state.actionLoading, [transactionId]: false } }));
      throw err;
    }
  },

  getReturnFine: async (transactionId) => {
    try {
      const response = await api.get(`/transactions/${transactionId}/fine`);
      return response.data;
    } catch (err) {
      // If 404, it means no pending fine, which is handled appropriately.
      if (err.response && err.response.status === 404) {
        return null;
      }
      throw err;
    }
  },

  completeReturn: async (transactionId) => {
    set((state) => ({ actionLoading: { ...state.actionLoading, [transactionId]: true } }));
    try {
      const response = await api.post(`/transactions/${transactionId}/complete-return`);
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
    const response = await api.post("/budget/expenses", entryData);
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
