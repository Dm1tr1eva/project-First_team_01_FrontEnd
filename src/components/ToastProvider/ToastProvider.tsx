"use client";

import { ToastContainer } from "react-toastify";

/**
 * Єдиний глобальний контейнер повідомлень. Монтується один раз у RootLayout;
 * компоненти можуть викликати `toast.error(...)` без власного ToastContainer.
 */
export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}
