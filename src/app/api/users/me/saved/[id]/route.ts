import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/api/proxyRequest";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  const { id } = await params;
  return proxyRequest(request, `/users/me/saved/${id}`);
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const { id } = await params;
  return proxyRequest(request, `/users/me/saved/${id}`);
}
