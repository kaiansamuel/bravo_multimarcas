import { db } from "@/db";
import { lojas, estoque, financeiroLancamentos } from "@/db/schema";
import { getSession } from "@/lib/session";
import { count, eq, lt, and, sql } from "drizzle-orm";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ loja?: string }>;
}) {
  const session = await getSession();
  const { loja } = await searchParams;

  // Determinar filtro de loja
  const lojaFiltro =
    session?.papel === "operador"
      ? session.lojaId
      : loja || null;

  // KPI 1: SKUs em risco de ruptura (estoque < 5)
  const estoqueConditions = [lt(estoque.quantidade, 5)];
  if (lojaFiltro) estoqueConditions.push(eq(estoque.lojaId, lojaFiltro));

  const [skusBaixos] = await db
    .select({ total: count() })
    .from(estoque)
    .where(and(...estoqueConditions));

  // KPI 2: Lançamentos em atraso
  const finConditions = [eq(financeiroLancamentos.status, "atrasado")];
  if (lojaFiltro) finConditions.push(eq(financeiroLancamentos.lojaId, lojaFiltro));

  const [emAtraso] = await db
    .select({
      total: count(),
      valor: sql<string>`COALESCE(SUM(${financeiroLancamentos.valor}), 0)`,
    })
    .from(financeiroLancamentos)
    .where(and(...finConditions));

  // KPI 3: Total de lojas
  const [totalLojas] = await db.select({ total: count() }).from(lojas);

  const kpis = [
    {
      label: "SKUs em risco de ruptura",
      value: skusBaixos.total,
      sub: "quantidade < 5",
      accent: skusBaixos.total > 0 ? "wine" : "gold",
    },
    {
      label: "Lançamentos em atraso",
      value: emAtraso.total,
      sub: `R$ ${Number(emAtraso.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      accent: emAtraso.total > 0 ? "wine" : "gold",
    },
    {
      label: "Lojas ativas",
      value: totalLojas.total,
      sub: "na rede",
      accent: "gold",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-paper">
        Visão Geral
      </h1>
      <p className="mt-1 text-sm text-paper-muted">
        {lojaFiltro ? "Filtrado por loja selecionada" : "Todas as lojas"}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
          >
            <p className="text-sm text-paper-muted">{kpi.label}</p>
            <p
              className={`mt-2 font-display text-4xl font-bold ${
                kpi.accent === "wine" ? "text-wine" : "text-gold"
              }`}
            >
              {kpi.value}
            </p>
            <p className="mt-1 font-mono text-xs text-paper-muted">{kpi.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
