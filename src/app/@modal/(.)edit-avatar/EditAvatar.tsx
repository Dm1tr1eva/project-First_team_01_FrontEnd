"use client";

import { useRouter } from "next/navigation";
import LogoutModal from "../../../components/LogoutModal/LogoutModal";
import { logout } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import css from "./EditAvatar.module.css";

export default function EditAvatar() {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  return (
    <LogoutModal onClose={handleClose}>
      <>tatam</>
    </LogoutModal>
  );
}
