export type Category = "popular" | "general";

export type ArticleOwner =
  | string
  | null
  | {
      _id: string;
      name: string;
      avatarUrl?: string;
    };

export type Article = {
  _id: string;
  title: string;
  desc: string;
  article: string;
  img: string;
  rate: number;
  date: string;
  category: Category;
  ownerId: ArticleOwner;
  createdAt: string;
  updatedAt: string;
};

export type ArticlesListResponse = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  articles: Article[];
};
