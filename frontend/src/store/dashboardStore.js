import { create } from "zustand";
import api from "@/lib/api";

const useDashboardStore = create((set) => ({
  librarianStats: null,
  managementStats: null,
  alerts: [],
  loading: false,
  error: null,
  actionLoading: {},

  fetchLibrarianDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const [statsRes, alertsRes] = await Promise.all([
        api.get("/dashboard/librarian"),
        api.get("/notifications"),
      ]);
      set({
        librarianStats: statsRes.data,
        alerts: alertsRes.data.filter((n) => !n.is_read),
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to load dashboard data. Please try again.",
        loading: false,
      });
    }
  },

  fetchManagementDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/dashboard/management");
      set({ managementStats: res.data, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to load dashboard metrics. Please try again.",
        loading: false,
      });
    }
  },

  dismissAlert: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== id),
      }));
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
    }
  },

  handleMemberAction: async (id, action) => {
    set((state) => ({ actionLoading: { ...state.actionLoading, [id]: action } }));
    try {
      await api.patch(`/members/${id}/${action}`);
      set((state) => ({
        librarianStats: state.librarianStats
          ? {
              ...state.librarianStats,
              pending_approvals: Math.max(
                0,
                (state.librarianStats.pending_approvals || state.librarianStats.pending_approvals_count || 1) - 1
              ),
              pending_approvals_list: (state.librarianStats.pending_approvals_list || []).filter((u) => u.id !== id),
            }
          : null,
        actionLoading: { ...state.actionLoading, [id]: null },
      }));
    } catch (err) {
      set((state) => ({ actionLoading: { ...state.actionLoading, [id]: null } }));
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useDashboardStore;
