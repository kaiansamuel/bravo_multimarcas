import { db } from "@/db";
import { financeiroLancamentos, lojas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ loja?: string }>;
}) {
  const session = await getSession();
  const { loja } = await searchParams;

  const lojaFiltro =
    session?.papel === "operador" ? session.lojaId : loja || null;

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

  // Calcular totais
  const totalPendente = rows
    .filter((r) => r.status === "pendente")
    .reduce((acc, r) => acc + Number(r.valor), 0);

  const totalAtrasado = rows
    .filter((r) => r.status === "atrasado")
    .reduce((acc, r) => acc + Number(r.valor), 0);

  const aPagar = rows.filter((r) => r.tipo === "pagar");
  const aReceber = rows.filter((r) => r.tipo === "receber");

  const formatCurrency = (v: number) =>
    `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pago: "bg-gold/20 text-gold",
      pendente: "bg-charcoal-700 text-paper-muted",
      atrasado: "bg-wine/20 text-wine",
    };
    return styles[status] || styles.pendente;
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-paper">
        Financeiro
      </h1>
      <p className="mt-1 text-sm text-paper-muted">
        {lojaFiltro ? "Filtrado por loja selecionada" : "Todas as lojas"}
      </p>

      {/* Totais */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6">
          <p className="text-sm text-paper-muted">Total pendente</p>
          <p className="mt-2 font-mono text-2xl font-bold text-gold">
            {formatCurrency(totalPendente)}
          </p>
        </div>
        <div className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6">
          <p className="text-sm text-paper-muted">Total em atraso</p>
          <p className="mt-2 font-mono text-2xl font-bold text-wine">
            {formatCurrency(totalAtrasado)}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-paper-muted">
            Nenhum lançamento financeiro.
          </p>
          <p className="mt-2 text-sm text-paper-muted">
            Os lançamentos aparecerão aqui quando forem registrados no sistema.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* A Pagar */}
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-paper">
              A Pagar
            </h2>
            {aPagar.length === 0 ? (
              <p className="text-sm text-paper-muted">
                Nenhuma conta a pagar registrada.
              </p>
            ) : (
              <div className="space-y-3">
                {aPagar.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-paper">
                          {item.descricao}
                        </p>
                        <p className="mt-1 text-xs text-paper-muted">
                          {item.lojaNome} &middot; Vence em{" "}
                          {new Date(item.vencimento + "T12:00:00").toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-medium text-paper">
                          {formatCurrency(Number(item.valor))}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${statusBadge(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* A Receber */}
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-paper">
              A Receber
            </h2>
            {aReceber.length === 0 ? (
              <p className="text-sm text-paper-muted">
                Nenhuma conta a receber registrada.
              </p>
            ) : (
              <div className="space-y-3">
                {aReceber.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-paper">
                          {item.descricao}
                        </p>
                        <p className="mt-1 text-xs text-paper-muted">
                          {item.lojaNome} &middot; Vence em{" "}
                          {new Date(item.vencimento + "T12:00:00").toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-medium text-paper">
                          {formatCurrency(Number(item.valor))}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${statusBadge(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
