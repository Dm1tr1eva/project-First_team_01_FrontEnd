import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function proxyRequest(request: NextRequest, backendPath: string) {
  const targetUrl = new URL(`${BACKEND_URL}/api${backendPath}${request.nextUrl.search}`);
  const outgoingRequest = new Request(targetUrl, request);

  try {
    return await fetch(outgoingRequest);
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
