import type { Ref } from "react";
import ArticlesItem from "@/components/ArticlesItem/ArticlesItem";
import type { Article } from "@/types/article";
import css from "./ArticlesList.module.css";

interface ArticlesListProps {
  articles: Article[];
  authorNames: Record<string, string>;
  savedArticleIds: string[];
  onGuestClick: () => void;
  onSavedArticlesChange: (savedArticleIds: string[]) => void;
  scrollTargetId: string | null;
  scrollTargetRef: Ref<HTMLLIElement>;
}

export default function ArticlesList({
  articles,
  authorNames,
  savedArticleIds,
  onGuestClick,
  onSavedArticlesChange,
  scrollTargetId,
  scrollTargetRef,
}: ArticlesListProps) {
  if (articles.length === 0) {
    return <p className={css.empty}>No articles found.</p>;
  }

  return (
    <ul className={css.list}>
      {articles.map((article) => (
        <li
          key={article._id}
          ref={article._id === scrollTargetId ? scrollTargetRef : undefined}
          className={css.item}
        >
          <ArticlesItem
            article={article}
            authorName={authorNames[article.ownerId] ?? "Unknown author"}
            isSaved={savedArticleIds.includes(article._id)}
            onGuestClick={onGuestClick}
            onSavedArticlesChange={onSavedArticlesChange}
          />
        </li>
      ))}
    </ul>
  );
}
