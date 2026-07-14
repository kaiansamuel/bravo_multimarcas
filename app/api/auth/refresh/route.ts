import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usuarios, refreshTokensRevogados } from "@/db/schema";
import {
  verifyRefreshToken,
  generateAccessToken,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token ausente." },
      { status: 401 }
    );
  }

  try {
    // Verificar se o token foi revogado
    const [revogado] = await db
      .select()
      .from(refreshTokensRevogados)
      .where(eq(refreshTokensRevogados.token, refreshToken))
      .limit(1);

    if (revogado) {
      return NextResponse.json(
        { error: "Refresh token revogado." },
        { status: 401 }
      );
    }

    const { userId } = verifyRefreshToken(refreshToken);

    const [user] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      papel: user.papel as "gestor" | "operador",
      lojaId: user.lojaId,
    });

    const response = NextResponse.json({ ok: true });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Refresh token inválido." },
      { status: 401 }
    );
  }
}
