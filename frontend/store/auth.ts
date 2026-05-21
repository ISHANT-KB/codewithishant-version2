import { create } from "zustand";
import { adminLogin, adminLogout } from "@/lib/api/auth";

// NO token stored here — httpOnly cookie handles it
// Store only UI state: is user considered logged in?

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuthenticated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  login: async (email, password) => {
    await adminLogin({ email, password });       // sets httpOnly cookie
    set({ isAuthenticated: true });
  },

  logout: async () => {
    await adminLogout();                          // clears cookie server-side
    set({ isAuthenticated: false });
  },

  setAuthenticated: (val) => set({ isAuthenticated: val }),
}));