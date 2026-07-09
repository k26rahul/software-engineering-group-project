import { create } from "zustand";
import api, { ACCESS_TOKEN_KEY } from "@/lib/api";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { user, access_token } = response.data;
    set({ user, accessToken: access_token });
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
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
    set({ user, accessToken: access_token });
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    return user;
  },

  logout: () => {
    set({ user: null, accessToken: null });
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
}));

export default useAuthStore;
