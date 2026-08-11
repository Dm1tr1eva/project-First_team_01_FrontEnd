import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
const BACKEND_URL = process.env.BACKEND_API_URL;
export async function proxyRequest(request: NextRequest, backendPath: string) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: "BACKEND_API_URL is not configured" }, { status: 500 });
  }
  const targetUrl = new URL(`${BACKEND_URL}/api${backendPath}${request.nextUrl.search}`);
  try {
    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    }
    const cookie = request.headers.get("cookie");
    if (cookie) {
      headers.set("cookie", cookie);
    }
    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();
    const response = await fetch(targetUrl, { method: request.method, headers, body });
    const responseBody = await response.text();
    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
    });
    const setCookies = response.headers.getSetCookie();
    if (setCookies.length > 0) {
      const cookieStore = await cookies();
      for (const cookieStr of setCookies) {
        const parts = cookieStr.split(";").map((part) => part.trim());
        const [nameValue, ...attributes] = parts;
        const [name, ...valueParts] = nameValue.split("=");
        const value = valueParts.join("=");
        if (!name || !value) {
          continue;
        }
        const options: {
          expires?: Date;
          path?: string;
          maxAge?: number;
          httpOnly?: boolean;
          secure?: boolean;
          sameSite?: "lax" | "strict" | "none";
        } = {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        };
        for (const attribute of attributes) {
          const [key, attributeValue] = attribute.split("=");
          switch (key.toLowerCase()) {
            case "path":
              options.path = attributeValue || "/";
              break;
            case "max-age":
              if (attributeValue) {
                options.maxAge = Number(attributeValue);
              }
              break;
            case "expires":
              if (attributeValue) {
                options.expires = new Date(attributeValue);
              }
              break;
            case "httponly":
              options.httpOnly = true;
              break;
            case "secure":
              options.secure = true;
              break;
            case "samesite":
              if (
                attributeValue === "lax" ||
                attributeValue === "strict" ||
                attributeValue === "none"
              ) {
                options.sameSite = attributeValue;
              }
              break;
          }
        }
        cookieStore.set(name, value, options);
      }
    }
    return nextResponse;
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
