"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./ModalErrorSave.module.css";

type ModalErrorSaveProps = {
  onClose: () => void;
};

export default function ModalErrorSave({ onClose }: ModalErrorSaveProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-save-title"
        aria-describedby="error-save-description"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <use href="/sprite.svg#iconcontrolsclose" />
          </svg>
        </button>

        <h2 id="error-save-title" className={css.title}>
          Error while saving
        </h2>

        <p id="error-save-description" className={css.description}>
          To save this article, you need to
          <br />
          authorize first
        </p>

        <div className={css.buttons}>
          <button type="button" className={css.loginButton} onClick={handleLogin}>
            Login
          </button>

          <button type="button" className={css.registerButton} onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
