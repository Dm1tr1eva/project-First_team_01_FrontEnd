import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { refreshSession } from "@/lib/api/serverApi";

const PRIVATE_ROUTES = ["/profile", "/articles/create"];
const PUBLIC_ONLY_ROUTES = ["/login", "/register", "/photo"];

function applySessionCookies(response: NextResponse, setCookieHeaders: string[]) {
  for (const cookieStr of setCookieHeaders) {
    const { name, value, maxAge, path, httpOnly, secure, sameSite } = parseSetCookie(cookieStr);
    if (value === undefined) continue;
    response.cookies.set(name, value, { maxAge, path, httpOnly, secure, sameSite });
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const sessionId = cookieStore.get("sessionId")?.value;

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  let isAuthenticated = Boolean(accessToken);

  // accessToken живе лише 15 хв (див. services/session.js) — якщо він протух,
  // але сесія (refreshToken + sessionId) ще жива, тихо оновлюємо її до рендеру сторінки
  if (!isAuthenticated && refreshToken && sessionId) {
    try {
      const refreshResponse = await refreshSession();
      const setCookieHeaders = refreshResponse.headers["set-cookie"];

      if (setCookieHeaders) {
        isAuthenticated = true;
        const response = isPublicOnlyRoute
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next();
        applySessionCookies(response, setCookieHeaders);
        return response;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isAuthenticated) {
    return isPublicOnlyRoute
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/articles/create", "/login", "/register", "/photo"],
};
