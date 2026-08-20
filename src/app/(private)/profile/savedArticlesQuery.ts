import { getSavedArticles, getUserInfo } from "@/lib/api/clientApi";
import type { Article } from "@/types/article";

export type SavedArticlesWithAuthors = {
  articles: Article[];
  authorNames: Record<string, string>;
};

// Перший елемент ключа — "saved-articles", той самий, що й у решти п'яти
// місць, які кешують збережені статті (ButtonAddToBookmarks і споживачі).
// Спільний префікс потрібен, щоб один invalidateQueries({queryKey: ["saved-articles"]})
// зачепив одразу всі — інакше цей лічильник ніколи не дізнається про
// save/unsave, зроблений деінде, і показує застаріле число, поки хтось не
// перемонтує компонент заново (типово — хард-рефреш).
export function savedArticlesQueryKey(currentUserId: string | undefined) {
  return ["saved-articles", currentUserId, "full"] as const;
}

export async function fetchSavedArticlesWithAuthors(): Promise<SavedArticlesWithAuthors> {
  const articles = await getSavedArticles();

  const embeddedAuthorEntries = articles.flatMap((article) =>
    article.ownerId === null || typeof article.ownerId === "string"
      ? []
      : ([[article.ownerId._id, article.ownerId.name]] as const),
  );
  const ownerIdsToResolve = [
    ...new Set(
      articles.flatMap((article) => (typeof article.ownerId === "string" ? [article.ownerId] : [])),
    ),
  ];
  const fetchedAuthorEntries = await Promise.all(
    ownerIdsToResolve.map(async (ownerId) => {
      try {
        const author = await getUserInfo(ownerId);
        return [ownerId, author.name] as const;
      } catch {
        return [ownerId, "Unknown author"] as const;
      }
    }),
  );

  return {
    articles,
    authorNames: Object.fromEntries([...embeddedAuthorEntries, ...fetchedAuthorEntries]),
  };
}
