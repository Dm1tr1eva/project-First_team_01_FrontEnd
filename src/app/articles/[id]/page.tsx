import Link from "next/link";

import {
  getArticleById,
  getArticles,
  getUserInfo,
} from "@/lib/api/serverApi";

import styles from "./page.module.css";

type ArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ArticleOwner = {
  _id: string;
  name: string;
  avatarUrl: string | null;
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}.${month}.${year}`;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  const article = await getArticleById(id);

  const owner = article.ownerId as string | ArticleOwner | null;

  let author: ArticleOwner | null = null;

  if (typeof owner === "string") {
    try {
      author = await getUserInfo(owner);
    } catch {
      author = null;
    }
  } else if (owner) {
    author = owner;
  }

  const articlesResponse = await getArticles({
    page: 1,
    perPage: 20,
  });

  const recommendationArticles = articlesResponse.articles
    .filter((item) => item._id !== article._id)
    .slice(0, 3);

  const recommendations = await Promise.all(
    recommendationArticles.map(async (item) => {
      const recommendationOwner = item.ownerId as
        | string
        | ArticleOwner
        | null;

      let recommendationAuthor: ArticleOwner | null = null;

      if (typeof recommendationOwner === "string") {
        try {
          recommendationAuthor = await getUserInfo(recommendationOwner);
        } catch {
          recommendationAuthor = null;
        }
      } else if (recommendationOwner) {
        recommendationAuthor = recommendationOwner;
      }

      return {
        article: item,
        author: recommendationAuthor,
      };
    }),
  );

  const paragraphs = article.article
    .split(/(?:\/n|\\n|\n)/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{article.title}</h1>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.heroImage}
        src={article.img}
        alt={article.title}
        width={1226}
        height={624}
      />

      <div className={styles.content}>
        <div className={styles.articleText}>
          {paragraphs.map((paragraph, index) => (
            <p key={`${article._id}-${index}`}>
              {paragraph}
            </p>
          ))}
        </div>

        <aside className={styles.sidebarWrapper}>
          <div className={styles.sidebar}>
            <p className={styles.metaRow}>
              <strong>Author:</strong>{" "}
              {author ? (
                <Link
                  href={`/authors/${author._id}`}
                  className={styles.authorLink}
                >
                  {author.name}
                </Link>
              ) : (
                <span>Unknown author</span>
              )}
            </p>

            <p className={styles.metaRow}>
              <strong>Publication date:</strong>{" "}
              {formatDate(article.date)}
            </p>

            <h2 className={styles.recommendationsTitle}>
              You can also interested
            </h2>

            <div className={styles.recommendations}>
              {recommendations.map(({ article: item, author: itemAuthor }) => (
                <article
                  key={item._id}
                  className={styles.recommendationCard}
                >
                  <div className={styles.recommendationContent}>
                    <h3 className={styles.recommendationTitle}>
                      {item.title}
                    </h3>

                    <p className={styles.recommendationAuthor}>
                      {itemAuthor?.name ?? "Unknown author"}
                    </p>
                  </div>

                  <Link
                    href={`/articles/${item._id}`}
                    className={styles.arrowButton}
                    aria-label={`Open article ${item.title}`}
                  >
                    ↗
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.saveButton}
          >
            <span>Save</span>
            <span aria-hidden="true">♡</span>
          </button>
        </aside>
      </div>
    </main>
  );
}