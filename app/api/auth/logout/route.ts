import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { refreshTokensRevogados } from "@/db/schema";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (refreshToken) {
    await db.insert(refreshTokensRevogados).values({ token: refreshToken });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
