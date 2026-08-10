"use client";

import type { ButtonHTMLAttributes } from "react";
import css from "./EditArticleButton.module.css";

export interface EditArticleButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type"
> {
  /** Додає назву статті до доступного для screen reader підпису. */
  articleTitle?: string;
}

/**
 * Іконкова action-кнопка для власної статті.
 * ArticlesItem або сторінка профілю передає дію через `onClick`.
 */
export default function EditArticleButton({
  articleTitle,
  className,
  "aria-label": ariaLabel,
  ...buttonProps
}: EditArticleButtonProps) {
  const accessibleLabel =
    ariaLabel ?? (articleTitle ? `Edit article: ${articleTitle}` : "Edit article");
  const buttonClassName = className ? `${css.button} ${className}` : css.button;

  return (
    <button type="button" className={buttonClassName} aria-label={accessibleLabel} {...buttonProps}>
      <svg className={css.icon} aria-hidden="true" focusable="false">
        <use href="/sprite.svg#icon-Genericedit" />
      </svg>
    </button>
  );
}
