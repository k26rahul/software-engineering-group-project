import { create } from "zustand";
import api from "@/lib/api";

const useMemberStore = create((set) => ({
  profile: null,
  issues: [],
  payments: [],
  recommendations: [],
  readingLists: [],
  readingListDetail: null,
  reservations: [],
  history: [],
  pendingFines: [],
  loading: false,
  error: "",
  members: [],
  membersLoading: false,
  membersError: "",
  memberActionLoading: {},
  memberDetail: null,
  memberCurrentIssues: [],
  memberHistory: [],
  memberDetailLoading: false,
  memberDetailError: "",

  fetchMembers: async (params = {}) => {
    set({ membersLoading: true, membersError: "" });
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.approval_status) query.append("approval_status", params.approval_status);
      if (params.role) query.append("role", params.role);
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

  fetchMemberDetail: async (id) => {
    set({ memberDetailLoading: true, memberDetailError: "", memberDetail: null, memberCurrentIssues: [], memberHistory: [] });
    try {
      const [detailRes, issuesRes, historyRes] = await Promise.all([
        api.get(`/members/${id}`),
        api.get(`/members/${id}/current-issues`),
        api.get(`/members/${id}/history`),
      ]);
      set({
        memberDetail: detailRes.data,
        memberCurrentIssues: issuesRes.data,
        memberHistory: historyRes.data,
        memberDetailLoading: false,
      });
    } catch (err) {
      set({ memberDetailError: err.message || "Failed to load member details.", memberDetailLoading: false });
    }
  },

  clearMemberDetail: () => {
    set({ memberDetail: null, memberCurrentIssues: [], memberHistory: [], memberDetailError: "" });
  },

  fetchDashboardData: async (memberId) => {
    try {
      set({ loading: true, error: "" });
      const [profileRes, issuesRes, paymentsRes, recsRes, listsRes] = await Promise.all([
        api.get(`/members/${memberId}`),
        api.get(`/members/${memberId}/current-issues`),
        api.get(`/payments/history`),
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

  fetchReservations: async (memberId) => {
    try {
      const response = await api.get(`/members/${memberId}/reservations`);
      set({ reservations: response.data });
    } catch (err) {
      console.error("Error loading reservations in store:", err);
    }
  },

  fetchReadingListDetail: async (listId) => {
    try {
      set({ loading: true, error: "", readingListDetail: null });
      const response = await api.get(`/reading-lists/${listId}/detail`);
      set({ readingListDetail: response.data, loading: false });
    } catch (err) {
      console.error("Error loading reading list detail in store:", err);
      set({ error: "Could not load reading list. Please try again.", loading: false });
    }
  },

  fetchProfileAndHistory: async (memberId) => {
    try {
      set({ loading: true, error: "" });
      const [profileRes, historyRes, finesRes] = await Promise.all([
        api.get(`/members/${memberId}`),
        api.get(`/members/${memberId}/history`),
        api.get(`/payments/fines`),
      ]);

      set({
        profile: profileRes.data,
        history: historyRes.data,
        pendingFines: finesRes.data,
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

  fetchPendingFines: async () => {
    try {
      const response = await api.get(`/payments/fines`);
      set({ pendingFines: response.data });
    } catch (err) {
      console.error("Error fetching pending fines:", err);
    }
  },

  payFine: async (fineId, amount) => {
    try {
      const response = await api.post(`/payments/fines/${fineId}`, { amount });
      
      // Update pending fines locally
      set((state) => ({
        pendingFines: state.pendingFines.filter((f) => f.id !== fineId)
      }));
      
      return response.data;
    } catch (err) {
      console.error("Error paying fine:", err);
      const error = new Error(err.message || "Failed to process payment. Please try again.");
      error.cause = err;
      throw error;
    }
  },
}));

export default useMemberStore;
