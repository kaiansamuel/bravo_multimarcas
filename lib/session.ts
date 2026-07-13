import { cookies } from "next/headers";
import { verifyAccessToken, type TokenPayload } from "./auth";

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<TokenPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Não autenticado");
  }
  return session;
}
