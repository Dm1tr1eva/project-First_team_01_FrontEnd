import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function proxyRequest(request: NextRequest, backendPath: string) {
  const targetUrl = new URL(`${BACKEND_URL}/api${backendPath}${request.nextUrl.search}`);
  const outgoingRequest = new Request(targetUrl, request);

  try {
    const backendResponse = await fetch(outgoingRequest);
    const headers = new Headers(backendResponse.headers);
    const setCookieHeaders = (
      backendResponse.headers as Headers & { getSetCookie?: () => string[] }
    ).getSetCookie?.();
    const hasNoBody = request.method === "HEAD" || [204, 205, 304].includes(backendResponse.status);
    const body = hasNoBody ? null : await backendResponse.arrayBuffer();

    headers.delete("content-encoding");
    headers.delete("content-length");

    if (setCookieHeaders?.length) {
      headers.delete("set-cookie");
      setCookieHeaders.forEach((cookie) => headers.append("set-cookie", cookie));
    }

    return new NextResponse(body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers,
    });
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
