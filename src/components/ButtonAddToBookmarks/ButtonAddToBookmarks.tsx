"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addSavedArticle, removeSavedArticle } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ButtonAddToBookmarks.module.css";

export type BookmarkButtonVariant = "icon" | "wide";

export interface ButtonAddToBookmarksProps {
  /** MongoDB id статті, який додається або видаляється через saved API. */
  articleId: string;
  /** Контрольований стан: батьківський компонент визначає, чи id уже збережений. */
  isSaved: boolean;
  /** `icon` використовується в картці, `wide` — на сторінці статті. */
  variant?: BookmarkButtonVariant;
  /** Відкриває ModalErrorSave для неавторизованого користувача. */
  onGuestClick: () => void;
  /**
   * Backend повертає весь список saved id. Збережіть його в батьківському стані,
   * щоб усі екземпляри кнопки для цієї статті синхронно оновилися.
   */
  onSavedArticlesChange: (savedArticleIds: string[]) => void;
}

const FALLBACK_ERROR_MESSAGE = "Unable to update saved articles";

/**
 * Контрольована кнопка закладок із двома Figma-видами та спільною API-логікою.
 * Вона не зберігає `isSaved` локально: джерелом правди залишається сторінка,
 * список статей або query cache, який передає props.
 *
 * @example
 * const isSaved = savedArticleIds.includes(article.id);
 * <ButtonAddToBookmarks
 *   articleId={article.id}
 *   isSaved={isSaved}
 *   onGuestClick={() => setIsErrorSaveOpen(true)}
 *   onSavedArticlesChange={setSavedArticleIds}
 * />
 */
export default function ButtonAddToBookmarks({
  articleId,
  isSaved,
  variant = "icon",
  onGuestClick,
  onSavedArticlesChange,
}: ButtonAddToBookmarksProps) {
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: () => (isSaved ? removeSavedArticle(articleId) : addSavedArticle(articleId)),
    onSuccess: ({ savedArticles }) => {
      onSavedArticlesChange(savedArticles);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE);
    },
  });

  const handleClick = () => {
    if (!user) {
      onGuestClick();
      return;
    }

    mutation.mutate();
  };

  const isPending = mutation.isPending;
  const visibleLabel = isPending
    ? isSaved
      ? "Removing..."
      : "Saving..."
    : isSaved
      ? "Unsave"
      : "Save";
  const accessibleLabel = isPending
    ? isSaved
      ? "Removing article from bookmarks"
      : "Saving article to bookmarks"
    : isSaved
      ? "Remove article from bookmarks"
      : "Add article to bookmarks";

  return (
    <button
      type="button"
      className={css.button}
      data-variant={variant}
      data-saved={isSaved}
      data-state={isPending ? "loading" : "idle"}
      aria-label={accessibleLabel}
      aria-pressed={isSaved}
      aria-busy={isPending}
      disabled={isPending}
      onClick={handleClick}
    >
      {variant === "wide" && <span className={css.label}>{visibleLabel}</span>}

      <svg className={css.icon} aria-hidden="true" focusable="false">
        <use href="/sprite.svg#icon-Genericbookmark-alternative" />
      </svg>
    </button>
  );
}
