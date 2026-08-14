"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore"; 
import { updateUser } from "@/lib/api/clientApi";
import css from "./UserModal.module.css";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const updateUserInStore = useAuthStore((state) => state.setUser || state.updateUser);

  const [name, setName] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("/default-avatar.png");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errorName, setErrorName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatarPreview(user.avatarUrl || user.avatar || "/default-avatar.png");
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorName("");

    if (!name.trim()) {
      setErrorName("Name is required");
      return;
    }
    if (name.trim().length < 2) {
      setErrorName("Name must be at least 2 characters long");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const updatedUser = await updateUser(formData);

      if (updateUserInStore && updatedUser) {
        updateUserInStore(updatedUser);
      }

      onClose();
      router.refresh();
    } catch (err: any) {
      setErrorName(err?.response?.data?.message || err?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.container}>

        <button type="button" className={css.closeButton} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h3 className={css.title}>Edit Profile</h3>

        <form onSubmit={handleSubmit} className={css.form}>

          <div className={css.avatarWrapper}>
            <img src={avatarPreview} alt="User Avatar" className={css.avatarImg} />
            <label className={css.avatarLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={css.fileInput}
              />
              <span className={css.uploadBadge}>+</span>
            </label>
          </div>

          <div className={css.inputGroup}>
            <label className={css.label}>User Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${css.input} ${errorName ? css.inputError : ""}`}
              placeholder="Enter your name"
            />

            {errorName && <span className={css.errorMessage}>{errorName}</span>}
          </div>

          <div className={css.containerButtons}>
            <button type="submit" className={css.buttonSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </button>
            <button type="button" className={css.buttonCancel} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}