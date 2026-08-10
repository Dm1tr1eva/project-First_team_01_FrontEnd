import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/api/proxyRequest";

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, "/users/me");
}
