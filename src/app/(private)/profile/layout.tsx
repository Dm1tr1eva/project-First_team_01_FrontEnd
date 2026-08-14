"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import AuthorInfo from "@/components/AuthorInfo/AuthorInfo";
import { getUserInfo } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./layout.module.css";

type ProfileTab = "myArticles" | "savedArticles";

type ProfileLayoutProps = {
  children: ReactNode;
  myArticles: ReactNode;
  savedArticles: ReactNode;
};

// Наша частина по ТЗ ProfilePage: шапка (AuthorInfo — перевикористана з AuthorPage,
// той самий User: name/avatarUrl/articlesAmount), перемикач табів My Articles /
// Saved Articles та власне перемикання паралельних слотів @myArticles/@savedArticles.
// Кожен слот — окремий незалежний "маршрут" зі своїм станом пагінації: перемикання
// табу розмонтовує неактивний слот, тож при поверненні на нього пагінація завжди
// починається з першої сторінки (узгоджено окремо).
//
// Примітка: (private)/layout.tsx (спільний, не наш) поки що нічого не захищає від
// гостей, тож ми додали власну перевірку тут — на рівні саме цієї сторінки.
export default function ProfileLayout({ children, myArticles, savedArticles }: ProfileLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("myArticles");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  const { data: profile } = useQuery({
    queryKey: ["userInfo", currentUser?.id],
    queryFn: () => getUserInfo(currentUser!.id),
    enabled: Boolean(currentUser?.id),
  });

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <div className={css.page}>
      <div className="container">
        {profile && <AuthorInfo user={profile} />}

        <div className={css.tabs} role="tablist" aria-label="Profile articles">
          <button
            type="button"
            role="tab"
            id="tab-myArticles"
            aria-selected={activeTab === "myArticles"}
            aria-controls="tabpanel-myArticles"
            className={`${css.tab} ${activeTab === "myArticles" ? css.tabActive : ""}`}
            onClick={() => setActiveTab("myArticles")}
          >
            My Articles
          </button>
          <button
            type="button"
            role="tab"
            id="tab-savedArticles"
            aria-selected={activeTab === "savedArticles"}
            aria-controls="tabpanel-savedArticles"
            className={`${css.tab} ${activeTab === "savedArticles" ? css.tabActive : ""}`}
            onClick={() => setActiveTab("savedArticles")}
          >
            Saved Articles
          </button>
        </div>

        <div
          id="tabpanel-myArticles"
          role="tabpanel"
          aria-labelledby="tab-myArticles"
          hidden={activeTab !== "myArticles"}
        >
          {activeTab === "myArticles" && myArticles}
        </div>

        <div
          id="tabpanel-savedArticles"
          role="tabpanel"
          aria-labelledby="tab-savedArticles"
          hidden={activeTab !== "savedArticles"}
        >
          {activeTab === "savedArticles" && savedArticles}
        </div>

        {children}
      </div>
    </div>
  );
}
