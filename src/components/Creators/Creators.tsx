"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/clientApi";
import css from "./Creators.module.css";

const TOP_CREATORS_COUNT = 6;

export default function Creators() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", "top-creators"],
    queryFn: () =>
      getUsers({
        page: 1,
        perPage: TOP_CREATORS_COUNT,
        sortBy: "articlesAmount",
        order: "desc",
      }),
  });

  const topCreators = data?.users ?? [];

  return (
    <section className={css.section}>
      <div className={css.header}>
        <h2 className={css.title}>Top Creators</h2>
        <Link href="/authors" className={css.link}>
          Go to all Creators
        </Link>
      </div>

      {isLoading && <p className={css.status}>Завантаження...</p>}
      {isError && <p className={css.status}>Не вдалося завантажити авторів.</p>}

      {!isLoading && !isError && (
        <ul className={css.list}>
          {topCreators.map(({ _id, name, avatarUrl }) => (
            <li key={_id} className={css.card}>
              <Image
                src={avatarUrl ?? "/default-avatar.png"}
                alt={`Фото автора ${name}`}
                width={104}
                height={104}
                className={css.avatar}
              />
              <p className={css.name}>{name}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
