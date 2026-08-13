import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/api/proxyRequest";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const { id } = await params;
  return proxyRequest(request, `/users/${id}/articles`);
}
