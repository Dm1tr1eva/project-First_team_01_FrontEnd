import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "../../api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("/auth/register", body);
    const setCookie = apiRes.headers["set-cookie"];
    if (!setCookie) {
      return NextResponse.json({ error: "No authentication cookies received" }, { status: 500 });
    }
    const cookieStore = await cookies();
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
    for (const cookieStr of cookieArray) {
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
    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || error.response?.data?.error || error.message },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
