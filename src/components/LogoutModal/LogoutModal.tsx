"use client";

import css from "./Modal.module.css";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const LogoutModal = ({ children, onClose }: ModalProps) => {
  const router = useRouter();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
  return (
    <div onClick={onClose} className={css.backdrop}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
        <button className={css.buttonClose} onClick={() => router.back()}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
