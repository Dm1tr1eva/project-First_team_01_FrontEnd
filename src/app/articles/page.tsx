"use client";

import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import ArticleFilter, { type ArticlesFilterValue } from "@/components/ArticleFilter/ArticleFilter";
import ArticlesList from "@/components/ArticlesList/ArticlesList";
import Pagination from "@/components/Pagination/Pagination";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import {
  getArticles,
  getArticlesFiltered,
  getSavedArticles,
  getUserInfo,
} from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { ArticlesListResponse } from "@/types/article";
import css from "./page.module.css";

const ARTICLES_PER_PAGE = 12;
const FALLBACK_ERROR_MESSAGE = "We could not load the articles. Please try again.";

type ArticlesPageResponse = ArticlesListResponse & {
  authorNames: Record<string, string>;
};

type SavedArticleIdsOverride = {
  userId: string;
  articleIds: string[];
};

async function fetchArticlesPage(
  page: number,
  filter: ArticlesFilterValue,
): Promise<ArticlesPageResponse> {
  const response =
    filter === "popular"
      ? await getArticlesFiltered({ page, perPage: ARTICLES_PER_PAGE, category: "popular" })
      : await getArticles({ page, perPage: ARTICLES_PER_PAGE });

  const ownerIds = [...new Set(response.articles.map((article) => article.ownerId))];
  const authorEntries = await Promise.all(
    ownerIds.map(async (ownerId) => {
      try {
        const author = await getUserInfo(ownerId);
        return [ownerId, author.name] as const;
      } catch {
        return [ownerId, "Unknown author"] as const;
      }
    }),
  );

  return {
    ...response,
    authorNames: Object.fromEntries(authorEntries),
  };
}

export default function ArticlesPage() {
  const [filter, setFilter] = useState<ArticlesFilterValue>("popular");
  const [savedArticleIdsOverride, setSavedArticleIdsOverride] =
    useState<SavedArticleIdsOverride | null>(null);
  const [scrollTargetId, setScrollTargetId] = useState<string | null>(null);
  const firstNewArticleRef = useRef<HTMLLIElement>(null);
  const userId = useAuthStore((state) => state.user?.id);

  const { data: savedArticles } = useQuery({
    queryKey: ["saved-articles", userId],
    queryFn: getSavedArticles,
    enabled: Boolean(userId),
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isPending,
    isPlaceholderData,
  } = useInfiniteQuery({
    queryKey: ["articles", filter],
    queryFn: ({ pageParam }) => fetchArticlesPage(pageParam, filter),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });

  const articles = useMemo(() => data?.pages.flatMap((page) => page.articles) ?? [], [data?.pages]);
  const authorNames = useMemo(
    () =>
      data?.pages.reduce<Record<string, string>>(
        (names, page) => Object.assign(names, page.authorNames),
        {},
      ) ?? {},
    [data?.pages],
  );
  const totalArticles = data?.pages[0]?.totalItems ?? 0;
  const savedArticleIds = useMemo(() => {
    if (!userId) {
      return [];
    }

    if (savedArticleIdsOverride?.userId === userId) {
      return savedArticleIdsOverride.articleIds;
    }

    return savedArticles?.map((article) => article._id) ?? [];
  }, [savedArticleIdsOverride, savedArticles, userId]);

  useEffect(() => {
    if (!scrollTargetId || !firstNewArticleRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    firstNewArticleRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    setScrollTargetId(null);
  }, [scrollTargetId]);

  const handleFilterChange = (nextFilter: ArticlesFilterValue) => {
    if (nextFilter === filter) {
      return;
    }

    setScrollTargetId(null);
    setFilter(nextFilter);
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const previousArticleCount = articles.length;
    const result = await fetchNextPage();

    if (result.isError) {
      return;
    }

    const updatedArticles = result.data?.pages.flatMap((page) => page.articles) ?? [];
    const firstNewArticle = updatedArticles[previousArticleCount];

    if (firstNewArticle) {
      setScrollTargetId(firstNewArticle._id);
    }
  };

  const handleGuestSaveAttempt = () => {
    // TODO(integration): wire ModalErrorSave after Issue #22 publishes its component API.
  };

  const handleSavedArticlesChange = (articleIds: string[]) => {
    if (userId) {
      setSavedArticleIdsOverride({ userId, articleIds });
    }
  };

  const hasInitialError = isError && articles.length === 0;
  const errorMessage = error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE;

  return (
    <div className={css.page}>
      <section
        className={`container ${css.container}`}
        aria-labelledby="articles-title"
        aria-busy={isFetching}
      >
        <SectionTitle id="articles-title" as="h1">
          Articles
        </SectionTitle>

        <div className={css.toolbar}>
          <p className={css.count}>{totalArticles} articles</p>

          <ArticleFilter
            value={filter}
            disabled={isFetching && !isFetchingNextPage}
            onChange={handleFilterChange}
          />
        </div>

        {isPending && (
          <p className={css.message} role="status">
            Loading articles...
          </p>
        )}

        {hasInitialError && (
          <p className={css.error} role="alert">
            {errorMessage}
          </p>
        )}

        {!isPending && !hasInitialError && (
          <>
            <ArticlesList
              articles={articles}
              authorNames={authorNames}
              savedArticleIds={savedArticleIds}
              onGuestClick={handleGuestSaveAttempt}
              onSavedArticlesChange={handleSavedArticlesChange}
              scrollTargetId={scrollTargetId}
              scrollTargetRef={firstNewArticleRef}
            />

            {isError && articles.length > 0 && (
              <p className={css.error} role="alert">
                {errorMessage}
              </p>
            )}

            <Pagination
              hasMore={!isPlaceholderData && Boolean(hasNextPage)}
              isLoading={isFetchingNextPage}
              onLoadMore={handleLoadMore}
            />
          </>
        )}

        {isPlaceholderData && (
          <span className={css.visuallyHidden} role="status">
            Updating articles...
          </span>
        )}
      </section>
    </div>
  );
}
