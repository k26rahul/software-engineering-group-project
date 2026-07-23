import { create } from "zustand";
import api from "@/lib/api";

const useMemberStore = create((set) => ({
  profile: null,
  issues: [],
  payments: [],
  recommendations: [],
  readingLists: [],
  history: [],
  loading: false,
  error: "",

  fetchDashboardData: async (memberId) => {
    try {
      set({ loading: true, error: "" });
      const [profileRes, issuesRes, paymentsRes, recsRes, listsRes] = await Promise.all([
        api.get(`/members/${memberId}`),
        api.get(`/members/${memberId}/current-issues`),
        api.get(`/members/${memberId}/payments`),
        api.get(`/members/${memberId}/recommendations`),
        api.get("/reading-lists"),
      ]);

      set({
        profile: profileRes.data,
        issues: issuesRes.data,
        payments: paymentsRes.data,
        recommendations: recsRes.data,
        readingLists: listsRes.data,
        loading: false,
      });
    } catch (err) {
      console.error("Error loading dashboard data in store:", err);
      set({
        error: "Could not load dashboard data. Please try again later.",
        loading: false,
      });
    }
  },

  fetchProfileAndHistory: async (memberId) => {
    try {
      set({ loading: true, error: "" });
      const [profileRes, historyRes] = await Promise.all([
        api.get(`/members/${memberId}`),
        api.get(`/members/${memberId}/history`),
      ]);

      set({
        profile: profileRes.data,
        history: historyRes.data,
        loading: false,
      });
    } catch (err) {
      console.error("Error loading profile data in store:", err);
      set({
        error: "Failed to load profile details. Please try again.",
        loading: false,
      });
    }
  },

  updateProfile: async (memberId, name, phone) => {
    try {
      set({ error: "" });
      const response = await api.patch(`/members/${memberId}/profile`, {
        name,
        phone,
      });

      set({ profile: response.data });
      return response.data;
    } catch (err) {
      console.error("Error updating profile in store:", err);
      const error = new Error(err.message || "Failed to update profile. Please try again.");
      error.cause = err;
      throw error;
    }
  },
}));

export default useMemberStore;
