export type Category = "popular" | "general";

export type Article = {
  _id: string;
  title: string;
  desc: string;
  article: string;
  img: string;
  rate: number;
  date: string;
  category: Category;
  ownerId: string;
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
