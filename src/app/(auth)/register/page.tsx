import { RegisterForm } from "@/components/RegisterForm/RegisterForm";
import css from "./page.module.css";

export default function RegisterPage() {
  return (
    <main className={css.page}>
      <RegisterForm />
    </main>
  );
}
