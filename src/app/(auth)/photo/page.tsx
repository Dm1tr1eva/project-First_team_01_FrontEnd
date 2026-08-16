"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";

import styles from "./page.module.css";

const validationSchema = Yup.object({
  photo: Yup.mixed<File>()
    .required("Please select a photo")
    .test(
      "fileSize",
      "File is too large (max 1MB)",
      (value) => {
        if (!value) return true;

        return value.size <= 1024 * 1024;
      }
    )
    .test(
      "fileType",
      "Please select an image",
      (value) => {
        if (!value) return true;

        return value.type.startsWith("image/");
      }
    ),
});

export default function PhotoPage() {
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      photo: null as File | null,
    },

    validationSchema,

    onSubmit: async (values) => {
      if (!values.photo) {
        formik.setFieldTouched("photo", true);
        return;
      }

      setIsLoading(true);
      setServerError("");

      const formData = new FormData();

      formData.append("avatar", values.photo);

      try {
        const token = localStorage.getItem("token");

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:3000";

        const response = await fetch(
          `${apiUrl}/users/me/avatar`,
          {
            method: "PATCH",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          router.push("/");
        } else {
          const data = await response.json();

          setServerError(
            data.message || "Failed to upload photo"
          );
        }
      } catch {
        setServerError("Server connection error");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.currentTarget.files?.[0] || null;

    formik.setFieldValue("photo", file);

    if (!file) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>

        {/* CLOSE */}

        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close"
        >
          <Image
            src="/images/Icon.svg"
            alt=""
            width={24}
            height={24}
            className={styles.closeIcon}
          />
        </button>

        {/* TITLE */}

        <h1 className={styles.title}>
          Upload your photo
        </h1>

        {/* FORM */}

        <form
          onSubmit={formik.handleSubmit}
          className={styles.form}
        >

          {/* CAMERA */}

          <div className={styles.uploadArea}>

            {preview ? (
              <div className={styles.previewWrapper}>
                <img
                  src={preview}
                  alt="Avatar preview"
                  className={styles.previewImage}
                />
              </div>
            ) : (
              <div className={styles.cameraCircle}>
                <Image
                  src="/images/photo.svg"
                  alt="Upload photo"
                  width={116}
                  height={97}
                  className={styles.cameraIcon}
                />
              </div>
            )}

            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />

          </div>

          {/* VALIDATION ERROR */}

          {formik.errors.photo &&
            formik.touched.photo && (
              <p className={styles.error}>
                {String(formik.errors.photo)}
              </p>
            )}

          {/* SERVER ERROR */}

          {serverError && (
            <p className={styles.error}>
              {serverError}
            </p>
          )}

          {/* SAVE */}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Loading..." : "Save"}
          </button>

        </form>
      </section>
    </main>
  );
}