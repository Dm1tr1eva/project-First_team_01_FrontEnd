"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import styles from "./UploadForm.module.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const validationSchema = Yup.object({
  photo: Yup.mixed<File>()
    .required("Please select a photo")
    .test(
      "fileType",
      "Please select an image file",
      (file) => {
        if (!file) return true;

        return file.type.startsWith("image/");
      }
    )
    .test(
      "fileSize",
      "Photo size must not exceed 5 MB",
      (file) => {
        if (!file) return true;

        return file.size <= MAX_FILE_SIZE;
      }
    ),
});

export default function UploadForm() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      photo: null as File | null,
    },

    validationSchema,

    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values) => {
      if (!values.photo) {
        formik.setFieldTouched("photo", true);
        return;
      }

      setIsLoading(true);

      try {
        const formData = new FormData();

        formData.append("avatar", values.photo);

        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Authorization required");
          return;
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

        const response = await fetch(`${apiUrl}/users/me/avatar`, {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMessage = "Failed to upload photo";

          try {
            const data = await response.json();

            if (data?.message) {
              errorMessage = data.message;
            }
          } catch {
            // Backend response is not JSON.
          }

          toast.error(errorMessage);

          return;
        }

        toast.success("Photo uploaded successfully");

        router.push("/");
      } catch {
        toast.error("Server connection error");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0] ?? null;

    formik.setFieldTouched("photo", true);
    formik.setFieldValue("photo", file);

    if (!file) {
      setPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleChoosePhoto = () => {
    if (isLoading) return;

    fileInputRef.current?.click();
  };

  const handleClose = () => {
    if (isLoading) return;

    router.back();
  };

  const photoError =
    formik.touched.photo && formik.errors.photo
      ? String(formik.errors.photo)
      : "";

  const hasPhoto = Boolean(formik.values.photo);

  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          disabled={isLoading}
          aria-label="Close"
        >
          <span />
          <span />
        </button>

        <h1 className={styles.title}>
          Upload your photo
        </h1>

        <form
          className={styles.form}
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <button
            type="button"
            className={`${styles.photoButton} ${
              hasPhoto ? styles.photoButtonWithPhoto : ""
            }`}
            onClick={handleChoosePhoto}
            disabled={isLoading}
            aria-label="Choose photo"
          >
            {preview ? (
              <span className={styles.preview}>
                <Image
                  src={preview}
                  alt="Selected photo"
                  fill
                  sizes="80px"
                  className={styles.previewImage}
                />
              </span>
            ) : (
              <svg
                className={styles.cameraIcon}
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14 14.5L17.2 10H30.8L34 14.5H38C40.2 14.5 42 16.3 42 18.5V34C42 36.2 40.2 38 38 38H10C7.8 38 6 36.2 6 34V18.5C6 16.3 7.8 14.5 10 14.5H14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx="24"
                  cy="26"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="34.5"
                  cy="19"
                  r="1.3"
                  fill="currentColor"
                />
              </svg>
            )}

            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </button>

          {photoError && (
            <p
              className={styles.error}
              role="alert"
            >
              {photoError}
            </p>
          )}

          <button
            type="submit"
            className={`${styles.saveButton} ${
              hasPhoto ? styles.saveButtonActive : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Save"}
          </button>
        </form>
      </div>
    </main>
  );
}