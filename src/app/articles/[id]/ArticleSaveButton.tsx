"use client";

import { useEffect, useState } from "react";

import ButtonAddToBookmarks from "@/components/ButtonAddToBookmarks/ButtonAddToBookmarks";
import { getSavedArticles } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type ArticleSaveButtonProps = {
  articleId: string;
};

type SavedState = {
  userId: string;
  articleIds: string[];
} | null;

export default function ArticleSaveButton({
  articleId,
}: ArticleSaveButtonProps) {
  const user = useAuthStore((state) => state.user);

  const [savedState, setSavedState] = useState<SavedState>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    async function loadSavedArticles() {
      try {
        const savedArticles = await getSavedArticles();

        if (!cancelled) {
          setSavedState({
            userId: user.id,
            articleIds: savedArticles.map((article) => article._id),
          });
        }
      } catch {
        if (!cancelled) {
          setSavedState({
            userId: user.id,
            articleIds: [],
          });
        }
      }
    }

    loadSavedArticles();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const savedArticleIds =
    user && savedState?.userId === user.id
      ? savedState.articleIds
      : [];

  const handleSavedArticlesChange = (articleIds: string[]) => {
    if (!user) {
      return;
    }

    setSavedState({
      userId: user.id,
      articleIds,
    });
  };

  return (
    <ButtonAddToBookmarks
      articleId={articleId}
      isSaved={savedArticleIds.includes(articleId)}
      variant="wide"
      onGuestClick={() => {
        // ModalErrorSave підключимо після завершення ArticlePage.
      }}
      onSavedArticlesChange={handleSavedArticlesChange}
    />
  );
}