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
        usageReport: usageRes.data,
        expenseReport: expenseRes.data,
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
