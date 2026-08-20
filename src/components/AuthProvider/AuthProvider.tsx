"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkSession, getMe } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";

// Header звіряється з цим, щоб не блимнути "Log in/Join now" авторизованому
// юзеру, поки триває первісна перевірка сесії (FE-53).
const AuthPendingContext = createContext(false);
export const useAuthPending = () => useContext(AuthPendingContext);

type Props = {
  children: React.ReactNode;
  // Обчислено на сервері (layout.tsx) з наявності sessionId/accessToken/refreshToken
  // cookie. Гостю без жодної з них питати бекенд немає сенсу — 401 гарантований,
  // а refresh-інтерцептор у відповідь на нього ще й сам смикне /auth/refresh,
  // подвоюючи консольні помилки (FE-67). Справжніх гостей це звільняє від
  // мережевого запиту повністю.
  hasSessionHint: boolean;
};

const AuthProvider = ({ children, hasSessionHint }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [isPending, setIsPending] = useState(hasSessionHint);

  useEffect(() => {
    if (!hasSessionHint) {
      return;
    }

    const fetchUser = async () => {
      try {
        const isAuthenticated = await checkSession();

        if (!isAuthenticated) {
          clearIsAuthenticated();
          return;
        }

        const user = await getMe();

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } finally {
        setIsPending(false);
      }
    };

    fetchUser();
  }, [hasSessionHint, setUser, clearIsAuthenticated]);

  return <AuthPendingContext.Provider value={isPending}>{children}</AuthPendingContext.Provider>;
};

export default AuthProvider;
