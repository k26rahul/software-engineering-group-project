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
  members: [],
  membersLoading: false,
  membersError: "",
  memberActionLoading: {},

  fetchMembers: async (params = {}) => {
    set({ membersLoading: true, membersError: "" });
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.approval_status) query.append("approval_status", params.approval_status);
      const response = await api.get(`/members?${query.toString()}`);
      set({ members: response.data, membersLoading: false });
    } catch (err) {
      console.error("Error loading members list in store:", err);
      set({
        membersError: "Could not load members list. Please try again.",
        membersLoading: false,
      });
    }
  },

  approveMember: async (id) => {
    set((state) => ({ memberActionLoading: { ...state.memberActionLoading, [id]: "approve" } }));
    try {
      await api.patch(`/members/${id}/approve`);
      // Optimistically update the row in place
      set((state) => ({
        members: state.members.map((m) =>
          m.id === id ? { ...m, approval_status: "APPROVED", is_active: true } : m
        ),
        memberActionLoading: { ...state.memberActionLoading, [id]: null },
      }));
    } catch (err) {
      set((state) => ({ memberActionLoading: { ...state.memberActionLoading, [id]: null } }));
      throw err;
    }
  },

  rejectMember: async (id) => {
    set((state) => ({ memberActionLoading: { ...state.memberActionLoading, [id]: "reject" } }));
    try {
      await api.patch(`/members/${id}/reject`);
      // Optimistically update the row in place
      set((state) => ({
        members: state.members.map((m) =>
          m.id === id ? { ...m, approval_status: "REJECTED", is_active: false } : m
        ),
        memberActionLoading: { ...state.memberActionLoading, [id]: null },
      }));
    } catch (err) {
      set((state) => ({ memberActionLoading: { ...state.memberActionLoading, [id]: null } }));
      throw err;
    }
  },

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
