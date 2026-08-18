"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AuthorsItem from "@/components/AuthorsItem/AuthorsItem";
import Loader from "@/components/Loader/Loader";
import { getUsers } from "@/lib/api/clientApi";
import type { User } from "@/types/user";
import css from "./AuthorsList.module.css";

const USERS_PER_PAGE = 20;

export default function AuthorsList() {
  const [page, setPage] = useState(1);
  const [authors, setAuthors] = useState<User[]>([]);

  const { data, error, isError, isPending, isFetching } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers({ page, perPage: USERS_PER_PAGE }),
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setAuthors((prevAuthors) => {
      if (page === 1) {
        return data.users;
      }

      return [...prevAuthors, ...data.users];
    });
  }, [data, page]);

  if (isPending && page === 1) {
    return <Loader />;
  }

  if (isError && page === 1) {
    return <p>{error instanceof Error ? error.message : "Failed to load authors."}</p>;
  }

  if (!authors.length) {
    return <p>No authors found.</p>;
  }

  const hasMore = data ? page < data.totalPages : false;

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className={`container ${css.content}`}>
      <h2 className={css.title}>Authors</h2>

      <ul className={css.list}>
        {authors.map((user) => (
          <AuthorsItem key={user._id} author={user} />
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          className={css.load_button}
          disabled={isFetching}
        >
          {isFetching ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
