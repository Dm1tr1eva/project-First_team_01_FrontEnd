import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/user";

type AuthStore = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setUser: (user) => {
        // Деякі бекендні відповіді (getMe, updateUser) віддають сирий Mongoose-
        // документ з `_id`, а не нормалізований `id`, попри тип AuthUser —
        // без цього user.id стає undefined і мовчки ламає все, що на нього
        // зав'язане (лічильник збережених статей, підсвітка кнопки Save).
        const normalizedUser =
          user && !user.id
            ? { ...user, id: (user as AuthUser & { _id?: string })._id ?? "" }
            : user;

        set({
          user: normalizedUser,
          isAuthenticated: normalizedUser !== null,
        });
      },

      clearIsAuthenticated: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
