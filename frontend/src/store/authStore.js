import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { user, access_token } = response.data;
    set({ user, token: access_token });
    localStorage.setItem("token", access_token);
    return user;
  },

  register: async (name, email, password, phone, membershipType) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      phone: phone || null,
      membership_type: membershipType,
    });
    const { user, access_token } = response.data;
    set({ user, token: access_token });
    localStorage.setItem("token", access_token);
    return user;
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;
