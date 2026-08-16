"use client";

import toast from "react-hot-toast";
import EditArticleButton from "@/components/EditArticleButton/EditArticleButton";
import css from "./EditNicknameButton.module.css";

export default function EditNicknameButton() {
  const handleClick = () => {
    toast("Profile editing is coming soon");
  };

  return (
    <EditArticleButton
      aria-label="Edit nickname"
      className={css.button}
      onClick={handleClick}
    />
  );
}
