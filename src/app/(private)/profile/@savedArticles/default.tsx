"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import ArticlesEmptyState from "@/components/ArticlesEmptyState/ArticlesEmptyState";
import ArticlesList from "@/components/ArticlesList/ArticlesList";
import Loader from "@/components/Loader/Loader";
import Pagination from "@/components/Pagination/Pagination";
import { useCurrentUserId } from "../useCurrentUserId";
import { fetchSavedArticlesWithAuthors, savedArticlesQueryKey } from "../savedArticlesQuery";
import css from "./default.module.css";

const ARTICLES_PER_PAGE = 12;

type ApiErrorResponse = { error?: string; message?: string };

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.error ?? error.response?.data.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export default function SavedArticlesTab() {
  const currentUserId = useCurrentUserId();

  const [page, setPage] = useState(1);
  const [removedArticleIds, setRemovedArticleIds] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data, error, isError, isPending } = useQuery({
    queryKey: savedArticlesQueryKey(currentUserId),
    queryFn: fetchSavedArticlesWithAuthors,
    enabled: Boolean(currentUserId),
  });

  const allArticles = useMemo(
    () => (data?.articles ?? []).filter((article) => !removedArticleIds.has(article._id)),
    [data?.articles, removedArticleIds],
  );
  const totalPages = Math.max(1, Math.ceil(allArticles.length / ARTICLES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const articles = useMemo(
    () =>
      allArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE),
    [allArticles, currentPage],
  );

  const handlePageChange = (nextPage: number) => {
    if (nextPage === currentPage) {
      return;
    }

    setPage(nextPage);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sectionRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleGuestSaveAttempt = () => {
    toast.error("Please log in to save articles");
  };

  const handleSavedArticlesChange = (articleIds: string[]) => {
    const stillSavedIds = new Set(articleIds);
    setRemovedArticleIds((previous) => {
      const next = new Set(previous);
      allArticles.forEach((article) => {
        if (!stillSavedIds.has(article._id)) {
          next.add(article._id);
        }
      });
      return next;
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error, "Couldn't load saved articles. Please try again later."));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  if (isPending) {
    return <Loader />;
  }

  if (isError && allArticles.length === 0) {
    return (
      <p className={css.error} role="alert">
        {getErrorMessage(error, "Couldn't load saved articles. Please try again later.")}
      </p>
    );
  }

  if (allArticles.length === 0) {
    return (
      <ArticlesEmptyState
        description="Save your first article"
        actionLabel="Go to articles"
        actionHref="/articles"
      />
    );
  }

  return (
    <div className={css.section} ref={sectionRef}>
      <ArticlesList
        articles={articles}
        authorNames={data?.authorNames ?? {}}
        savedArticleIds={allArticles.map((article) => article._id)}
        onGuestClick={handleGuestSaveAttempt}
        onSavedArticlesChange={handleSavedArticlesChange}
      />

      <Pagination pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}
