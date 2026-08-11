import type { ChangeEvent } from "react";
import css from "./ArticleFilter.module.css";

export type ArticlesFilterValue = "popular" | "all";

interface ArticleFilterProps {
  value: ArticlesFilterValue;
  disabled?: boolean;
  onChange: (filter: ArticlesFilterValue) => void;
}

export default function ArticleFilter({ value, disabled = false, onChange }: ArticleFilterProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as ArticlesFilterValue);
  };

  return (
    <label className={css.control}>
      <span className={css.visuallyHidden}>Filter articles</span>
      <select
        className={css.select}
        value={value}
        disabled={disabled}
        aria-label="Filter articles"
        onChange={handleChange}
      >
        <option value="popular">Popular</option>
        <option value="all">All</option>
      </select>
      <span className={css.arrow} aria-hidden="true" />
    </label>
  );
}
