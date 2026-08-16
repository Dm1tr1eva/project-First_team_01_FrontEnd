// Логіку перенесено у спільний хук src/hooks/useCurrentUser.ts — той самий
// підхід (React Query кеш під ключем ["me"], гідрований на сервері,
// замість Zustand-стору, який заповнюється асинхронно й був причиною
// вічного спінера на /profile) тепер потрібен і на /authors/[id]
// (AuthorArticlesSection), тому дублювати його тут більше не варто.
//
// Цей файл лишився тонким ре-експортом, щоб не міняти імпорти в
// @myArticles/default.tsx і @savedArticles/default.tsx.
export { useCurrentUser, useCurrentUserId } from "@/hooks/useCurrentUser";
