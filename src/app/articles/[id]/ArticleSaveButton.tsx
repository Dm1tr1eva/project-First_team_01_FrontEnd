"use client";

import { useEffect, useState } from "react";

import ButtonAddToBookmarks from "@/components/ButtonAddToBookmarks/ButtonAddToBookmarks";
import ModalErrorSave from "@/components/ModalErrorSave/ModalErrorSave";
import { getSavedArticles } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type ArticleSaveButtonProps = {
  articleId: string;
};

type SavedState = {
  userId?: string;
  articleIds: string[];
};

export default function ArticleSaveButton({
  articleId,
}: ArticleSaveButtonProps) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const [savedState, setSavedState] = useState<SavedState>({
    userId: undefined,
    articleIds: [],
  });

  const [isErrorSaveOpen, setIsErrorSaveOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;

    async function loadSavedArticles() {
      try {
        const savedArticles = await getSavedArticles();

        if (!cancelled) {
          setSavedState({
            userId,
            articleIds: savedArticles.map((article) => article._id),
          });
        }
      } catch {
        if (!cancelled) {
          setSavedState({
            userId,
            articleIds: [],
          });
        }
      }
    }

    loadSavedArticles();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const savedArticleIds =
    userId && savedState.userId === userId
      ? savedState.articleIds
      : [];

  const handleSavedArticlesChange = (articleIds: string[]) => {
    if (!userId) {
      return;
    }

    setSavedState({
      userId,
      articleIds,
    });
  };

  return (
    <>
      <ButtonAddToBookmarks
        articleId={articleId}
        isSaved={savedArticleIds.includes(articleId)}
        variant="wide"
        onGuestClick={() => setIsErrorSaveOpen(true)}
        onSavedArticlesChange={handleSavedArticlesChange}
      />

      {isErrorSaveOpen && (
        <ModalErrorSave
          onClose={() => setIsErrorSaveOpen(false)}
        />
      )}
    </>
  );
}
