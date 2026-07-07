import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { user, token } = response.data;
    set({ user, token });
    localStorage.setItem("token", token);
    return user;
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;
