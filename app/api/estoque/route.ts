import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { estoque, produtos, lojas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const lojaParam = searchParams.get("loja");
  const categoriaParam = searchParams.get("categoria");

  // Determinar filtro de loja — operador só vê a própria
  const lojaFiltro =
    session.papel === "operador" ? session.lojaId : lojaParam || null;

  const conditions = [];
  if (lojaFiltro) conditions.push(eq(estoque.lojaId, lojaFiltro));
  if (categoriaParam) conditions.push(eq(produtos.categoria, categoriaParam));

  const rows = await db
    .select({
      id: estoque.id,
      quantidade: estoque.quantidade,
      atualizadoEm: estoque.atualizadoEm,
      sku: produtos.sku,
      produtoNome: produtos.nome,
      categoria: produtos.categoria,
      preco: produtos.preco,
      lojaNome: lojas.nome,
      lojaId: estoque.lojaId,
    })
    .from(estoque)
    .innerJoin(produtos, eq(estoque.produtoId, produtos.id))
    .innerJoin(lojas, eq(estoque.lojaId, lojas.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(produtos.sku);

  return NextResponse.json(rows);
}
