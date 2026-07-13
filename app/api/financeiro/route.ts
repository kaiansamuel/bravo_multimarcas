import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { financeiroLancamentos, lojas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const lojaParam = searchParams.get("loja");

  // Operador só vê a própria loja
  const lojaFiltro =
    session.papel === "operador" ? session.lojaId : lojaParam || null;

  const conditions = [];
  if (lojaFiltro) conditions.push(eq(financeiroLancamentos.lojaId, lojaFiltro));

  const rows = await db
    .select({
      id: financeiroLancamentos.id,
      tipo: financeiroLancamentos.tipo,
      descricao: financeiroLancamentos.descricao,
      valor: financeiroLancamentos.valor,
      vencimento: financeiroLancamentos.vencimento,
      status: financeiroLancamentos.status,
      lojaNome: lojas.nome,
    })
    .from(financeiroLancamentos)
    .innerJoin(lojas, eq(financeiroLancamentos.lojaId, lojas.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(financeiroLancamentos.vencimento);

  return NextResponse.json(rows);
}
