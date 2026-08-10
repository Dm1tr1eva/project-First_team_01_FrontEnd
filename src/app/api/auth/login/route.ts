import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

import api from "@/lib/api/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post("/auth/login", body);

    const setCookie = apiRes.headers["set-cookie"];

    if (!setCookie) {
      return NextResponse.json(
        {
          error: "No authentication cookies received",
        },
        {
          status: 500,
        },
      );
    }

    const cookieStore = await cookies();

    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

    for (const cookieStr of cookieArray) {
      const [cookiePair, ...attributes] = cookieStr.split(";");

      const [name, ...valueParts] = cookiePair.split("=");

      const value = valueParts.join("=");

      if (!name || !value) {
        continue;
      }

      const options: {
        httpOnly: boolean;
        secure: boolean;
        path: string;
        maxAge?: number;
      } = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      };

      for (const attribute of attributes) {
        const [key, attributeValue] = attribute.trim().split("=");

        if (key.toLowerCase() === "max-age" && attributeValue) {
          options.maxAge = Number(attributeValue);
        }

        if (key.toLowerCase() === "path" && attributeValue) {
          options.path = attributeValue;
        }
      }

      cookieStore.set(name, value, options);
    }

    return NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.message || error.response?.data?.error || error.message,
        },
        {
          status: error.response?.status || 500,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
