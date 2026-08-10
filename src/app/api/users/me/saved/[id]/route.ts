import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import api from "@/lib/api/api";

interface SavedArticleRouteContext {
  params: Promise<{ id: string }>;
}

type RequestMethod = "POST" | "DELETE";
type SavedArticlesMutationResponse = { savedArticles: string[] };

const FALLBACK_ERROR_MESSAGE = "Unable to update saved articles";

/**
 * Same-origin proxy між клієнтським компонентом і backend API.
 * HttpOnly cookie недоступна в браузерному JavaScript, тому читаємо її на
 * сервері Next.js і явно передаємо в приватний backend-запит.
 */
async function updateSavedArticle(id: string, method: RequestMethod) {
  try {
    const cookieStore = await cookies();
    const response = await api.request<SavedArticlesMutationResponse>({
      url: `/users/me/saved/${encodeURIComponent(id)}`,
      method,
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message ?? FALLBACK_ERROR_MESSAGE },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json({ message: FALLBACK_ERROR_MESSAGE }, { status: 500 });
  }
}

export async function POST(_request: Request, { params }: SavedArticleRouteContext) {
  const { id } = await params;
  return updateSavedArticle(id, "POST");
}

export async function DELETE(_request: Request, { params }: SavedArticleRouteContext) {
  const { id } = await params;
  return updateSavedArticle(id, "DELETE");
}
