import { useAuthStore } from "@/lib/store/authStore";

// AuthUser (types/user.ts, спільний) декларує поле "id", але реально бекенд
// повертає "_id" (перевірено через Network tab на GET /users/me) — тому
// state.user?.id всюди в застосунку насправді undefined. Це баг у спільному
// коді (authStore/AuthProvider записують юзера так, як його віддав бекенд,
// без ремапінгу _id → id) — повідомили команді окремо, а тут просто
// захищаємось від нього локально, щоб наші таби не залежали від фіксу.
export function useCurrentUserId(): string | undefined {
  return useAuthStore((state) => {
    const user = state.user as (typeof state.user & { _id?: string }) | null;
    return user?.id ?? user?._id;
  });
}
