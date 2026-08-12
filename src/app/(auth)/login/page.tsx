import { LoginForm } from "@/components/LoginForm/LoginForm";
import css from "./page.module.css";

export default function LoginPage() {
  return (
    <main className={css.page}>
      <LoginForm />
    </main>
  );
}
