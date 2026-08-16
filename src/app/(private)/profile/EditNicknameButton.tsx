"use client";

import toast from "react-hot-toast";
import EditArticleButton from "@/components/EditArticleButton/EditArticleButton";
import css from "./EditNicknameButton.module.css";

// Заглушка за домовленістю з тімлідом (обговорення в чаті, 15.08):
// UserModal (форма редагування профілю) ще не в main і має логіку, яку
// "не вийде перевикористати" в поточному вигляді — тімлід сказала зробити
// лише кнопку з іконкою редагування, яка поки веде на плейсхолдер, а
// підключення реальної модалки або зробить вона сама пізніше, або ми
// повернемось до цього окремим PR, коли з'явиться макет.
//
// Перевикористовуємо готовий EditArticleButton (той самий pencil-icon, що
// й у My Articles) через його публічний API — не редагуємо сам компонент,
// лише передаємо свій aria-label, бо семантика тут інша ("редагувати
// нікнейм", а не "редагувати статтю").
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
