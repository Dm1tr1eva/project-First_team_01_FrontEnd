"use client";

import { useEffect } from "react";
import css from "./error.module.css";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={css.wrapper}>
      <p className={css.message}>Something went wrong.</p>
      <button type="button" className={css.button} onClick={() => retry()}>
        Try again
      </button>
    </div>
  );
}
