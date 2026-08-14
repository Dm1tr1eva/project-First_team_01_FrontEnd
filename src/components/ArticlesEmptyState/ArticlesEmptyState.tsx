import Link from "next/link";
import css from "./ArticlesEmptyState.module.css";

export default function ArticlesEmptyState() {
  return (
    <div className={css.emptyState} role="status">
      <svg className={css.icon} aria-hidden="true" focusable="false">
        <use href="/sprite.svg#icon-Genericalert-circle" />
      </svg>

      <div className={css.copy}>
        <p className={css.title}>Nothing found.</p>
        <p className={css.description}>Be the first, who create an article</p>
      </div>

      <Link href="/articles/create" className={css.link}>
        Create an article
      </Link>
    </div>
  );
}
