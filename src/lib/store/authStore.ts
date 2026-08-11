import { create } from "zustand";
import type { AuthUser } from "@/types/user";
type AuthStore = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user: AuthUser) => {
    set(() => ({ user, isAuthenticated: true }));
  },
  clearIsAuthenticated: () => {
    set(() => ({ user: null, isAuthenticated: false }));
  },
}));
