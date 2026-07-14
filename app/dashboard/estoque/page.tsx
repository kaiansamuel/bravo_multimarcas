import { redirect } from "next/navigation";
import { db } from "@/db";
import { estoque, produtos, lojas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

const ESTOQUE_MINIMO = 5;

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ loja?: string; categoria?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { loja, categoria } = await searchParams;

  const lojaFiltro =
    session.papel === "operador" ? session.lojaId : loja || null;

  const conditions = [];
  if (lojaFiltro) conditions.push(eq(estoque.lojaId, lojaFiltro));
  if (categoria) conditions.push(eq(produtos.categoria, categoria));

  const rows = await db
    .select({
      id: estoque.id,
      quantidade: estoque.quantidade,
      sku: produtos.sku,
      produtoNome: produtos.nome,
      categoria: produtos.categoria,
      preco: produtos.preco,
      lojaNome: lojas.nome,
    })
    .from(estoque)
    .innerJoin(produtos, eq(estoque.produtoId, produtos.id))
    .innerJoin(lojas, eq(estoque.lojaId, lojas.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(produtos.sku);

  // Categorias únicas para filtro
  const categorias = [...new Set(rows.map((r) => r.categoria).filter(Boolean))];

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-paper">
            Estoque
          </h1>
          <p className="mt-1 text-sm text-paper-muted">
            {rows.length} registro{rows.length !== 1 ? "s" : ""}
            {lojaFiltro ? " — loja filtrada" : " — todas as lojas"}
          </p>
        </div>

        {categorias.length > 0 && (
          <div className="flex gap-2">
            <a
              href="/dashboard/estoque"
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                !categoria
                  ? "bg-gold text-charcoal-950"
                  : "border border-charcoal-700 text-paper-muted hover:text-paper"
              }`}
            >
              Todas
            </a>
            {categorias.map((cat) => (
              <a
                key={cat}
                href={`/dashboard/estoque?categoria=${encodeURIComponent(cat!)}`}
                className={`rounded px-3 py-1.5 text-sm transition-colors ${
                  categoria === cat
                    ? "bg-gold text-charcoal-950"
                    : "border border-charcoal-700 text-paper-muted hover:text-paper"
                }`}
              >
                {cat}
              </a>
            ))}
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-paper-muted">Nenhum produto em estoque.</p>
          <p className="mt-2 text-sm text-paper-muted">
            Os produtos aparecerão aqui quando forem cadastrados no sistema.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal-700 text-paper-muted">
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Loja</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 text-right font-medium">Qtd</th>
                <th className="px-4 py-3 text-right font-medium">Preço</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-charcoal-700/50 transition-colors hover:bg-charcoal-800"
                >
                  <td className="px-4 py-3 font-mono text-xs text-paper-muted">
                    {row.sku}
                  </td>
                  <td className="px-4 py-3 text-paper">{row.produtoNome}</td>
                  <td className="px-4 py-3 text-paper-muted">{row.lojaNome}</td>
                  <td className="px-4 py-3 text-paper-muted">{row.categoria}</td>
                  <td className="px-4 py-3 text-right font-mono text-paper">
                    {row.quantidade}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-paper-muted">
                    R$ {Number(row.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                        row.quantidade < ESTOQUE_MINIMO
                          ? "bg-wine/20 text-wine"
                          : "bg-gold/20 text-gold"
                      }`}
                    >
                      {row.quantidade < ESTOQUE_MINIMO ? "Baixo" : "Ok"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
