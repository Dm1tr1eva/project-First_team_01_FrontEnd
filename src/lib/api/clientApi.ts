import type { User, AuthUser } from "@/types/user";
import type { Article, ArticlesListResponse, Category } from "@/types/article";
import client from "./client";

// --- auth ---

export type RegisterRequest = { name: string; email: string; password: string };
export type LoginRequest = { email: string; password: string };

export async function register(payload: RegisterRequest): Promise<AuthUser> {
  const { data } = await client.post<AuthUser>("/auth/register", payload);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthUser> {
  const { data } = await client.post<AuthUser>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await client.post("/auth/logout");
}

// --- users ---

export async function getUserInfo(id: string): Promise<User> {
  const { data } = await client.get<User>(`/users/${id}`);
  return data;
}

export async function updateUser(payload: { name?: string }): Promise<AuthUser> {
  const { data } = await client.patch<AuthUser>("/users/me", payload);
  return data;
}

export async function updateAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await client.patch<{ avatarUrl: string }>("/users/me/avatar", formData);
  return data;
}

type UserArticlesResponse = {
  status: number;
  message: string;
  data: ArticlesListResponse & { hasNextPage: boolean; hasPreviousPage: boolean };
};

export async function getUserArticles(
  id: string,
  params: { page?: number; perPage?: number } = {},
): Promise<UserArticlesResponse["data"]> {
  const { data } = await client.get<UserArticlesResponse>(`/users/${id}/articles`, { params });
  return data.data;
}

export async function getSavedArticles(): Promise<Article[]> {
  const { data } = await client.get<Article[]>("/users/me/saved");
  return data;
}

export async function addSavedArticle(articleId: string): Promise<{ savedArticles: string[] }> {
  const { data } = await client.post<{ savedArticles: string[] }>(`/users/me/saved/${articleId}`);
  return data;
}

export async function removeSavedArticle(articleId: string): Promise<{ savedArticles: string[] }> {
  const { data } = await client.delete<{ savedArticles: string[] }>(`/users/me/saved/${articleId}`);
  return data;
}

// --- articles ---

export async function getArticles(
  params: { page?: number; perPage?: number } = {},
): Promise<ArticlesListResponse> {
  const { data } = await client.get<ArticlesListResponse>("/articles", { params });
  return data;
}

export async function getArticlesFiltered(
  params: {
    page?: number;
    perPage?: number;
    category?: Category;
    search?: string;
    sortBy?: "createdAt" | "date" | "rate" | "title";
    order?: "asc" | "desc";
  } = {},
): Promise<ArticlesListResponse> {
  const { data } = await client.get<ArticlesListResponse>("/articles/filter", { params });
  return data;
}

export async function getArticleById(id: string): Promise<Article> {
  const { data } = await client.get<{ article: Article }>(`/articles/${id}`);
  return data.article;
}

export type CreateArticleRequest = {
  title: string;
  desc: string;
  article: string;
  category?: Category;
  img: File;
};

export async function createArticle(payload: CreateArticleRequest): Promise<Article> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("desc", payload.desc);
  formData.append("article", payload.article);
  if (payload.category) formData.append("category", payload.category);
  formData.append("img", payload.img);

  const { data } = await client.post<{ data: Article }>("/articles", formData);
  return data.data;
}

export type UpdateArticleRequest = Partial<Omit<CreateArticleRequest, "img">> & { img?: File };

export async function updateArticle(id: string, payload: UpdateArticleRequest): Promise<Article> {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.desc !== undefined) formData.append("desc", payload.desc);
  if (payload.article !== undefined) formData.append("article", payload.article);
  if (payload.category !== undefined) formData.append("category", payload.category);
  if (payload.img !== undefined) formData.append("img", payload.img);

  const { data } = await client.patch<{ data: Article }>(`/articles/${id}`, formData);
  return data.data;
}

export async function deleteArticle(id: string): Promise<void> {
  await client.delete(`/articles/${id}`);
}

// --- categories ---

export async function getCategories(): Promise<Category[]> {
  const { data } = await client.get<Category[]>("/categories");
  return data;
}
