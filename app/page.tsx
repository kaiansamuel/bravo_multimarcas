import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PriceTagDiagram from "@/components/PriceTagDiagram";

const modules = [
  {
    title: "Estoque Multi-Loja",
    description:
      "Posição em tempo real de cada SKU em cada loja. Saiba onde está o produto sem ligar pro balcão.",
    stat: "6 lojas",
  },
  {
    title: "Financeiro",
    description:
      "Contas a pagar e a receber centralizadas. Saiba quanto está em atraso antes de fechar o mês.",
    stat: "Pagar & receber",
  },
  {
    title: "Visão Única",
    description:
      "Um painel pra gestor, um painel por loja. Cada um vê o que precisa, sem planilha paralela.",
    stat: "Tempo real",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="bg-charcoal-950 px-6 py-20 md:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight text-paper md:text-5xl">
                Estoque e caixa de 6 lojas.
                <br />
                <span className="text-gold">Uma tela.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-muted">
                Sistema de gestão interna que substitui 6 planilhas por uma visão
                única de estoque e financeiro entre todas as lojas da rede.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-block rounded bg-gold px-8 py-3 font-display text-sm font-semibold uppercase tracking-wide text-charcoal-950 transition-colors hover:bg-gold-dim"
              >
                Acessar sistema
              </Link>
            </div>
            <PriceTagDiagram />
          </div>
        </section>

        {/* Módulos */}
        <section className="bg-charcoal-900 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-paper">
              O que o sistema resolve
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {modules.map((mod) => (
                <div
                  key={mod.title}
                  className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
                >
                  <span className="font-mono text-xs tracking-widest text-gold">
                    {mod.stat}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold uppercase text-paper">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                    {mod.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section className="bg-charcoal-950 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-paper">
              Projetos entregues
            </h2>
            <p className="mt-2 text-sm text-paper-muted">
              Cases reais de sistemas sob medida para operações de varejo.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Gestão de Estoque Multi-Loja",
                  description:
                    "Visão unificada do estoque de 6 lojas em tempo real. Alertas automáticos de ruptura, filtros por categoria e loja.",
                  tags: ["Next.js", "Postgres", "Drizzle"],
                  status: "Entregue",
                },
                {
                  title: "Financeiro Centralizado",
                  description:
                    "Contas a pagar e receber de toda a rede em um painel. Identificação instantânea de atrasos e pendências.",
                  tags: ["JWT Auth", "Multi-tenant", "API REST"],
                  status: "Entregue",
                },
              ].map((proj) => (
                <div
                  key={proj.title}
                  className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold uppercase text-paper">
                      {proj.title}
                    </h3>
                    <span className="rounded bg-gold/20 px-2 py-0.5 text-xs font-semibold uppercase text-gold">
                      {proj.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-paper-muted">
                    {proj.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-charcoal-700 px-2 py-0.5 font-mono text-xs text-paper-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="bg-charcoal-900 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-paper">
              Depoimentos
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  nome: "Carlos Mendes",
                  cargo: "Gestor Regional",
                  texto:
                    "Antes eu ligava pra cada loja pra saber o estoque. Agora abro o painel e tá tudo lá. Economizo 2 horas por dia.",
                },
                {
                  nome: "Maria Souza",
                  cargo: "Operadora — Shopping Flamboyant",
                  texto:
                    "O financeiro ficou muito mais claro. Sei exatamente o que tá pendente e o que tá atrasado sem precisar de planilha.",
                },
                {
                  nome: "Roberto Lima",
                  cargo: "Gerente — Bravo Anápolis",
                  texto:
                    "Sistema simples e direto. Minha equipe aprendeu a usar no primeiro dia. Sem enrolação.",
                },
              ].map((dep) => (
                <div
                  key={dep.nome}
                  className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
                >
                  <p className="text-sm leading-relaxed text-paper-muted italic">
                    &ldquo;{dep.texto}&rdquo;
                  </p>
                  <div className="mt-4 border-t border-charcoal-700 pt-4">
                    <p className="text-sm font-medium text-paper">{dep.nome}</p>
                    <p className="text-xs text-paper-muted">{dep.cargo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contato */}
        <section className="bg-charcoal-950 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-paper">
                Contato
              </h2>
              <p className="mt-2 text-sm text-paper-muted">
                Quer um sistema sob medida para a sua operação? Fale com a gente.
              </p>
              <div className="mt-8 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6 text-left">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-paper-muted">Email</p>
                    <p className="mt-1 font-mono text-sm text-gold">contato@evolux.dev</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-paper-muted">Telefone</p>
                    <p className="mt-1 font-mono text-sm text-paper">(62) 99999-0000</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-paper-muted">Localização</p>
                    <p className="mt-1 font-mono text-sm text-paper">Goiânia — GO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-charcoal-900 px-6 py-16 text-center">
          <h2 className="font-display text-2xl font-semibold uppercase text-paper">
            Pronto pra sair da planilha?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-paper-muted">
            Acesse o painel e tenha visão em tempo real do estoque e financeiro
            de todas as lojas.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded bg-gold px-8 py-3 font-display text-sm font-semibold uppercase tracking-wide text-charcoal-950 transition-colors hover:bg-gold-dim"
          >
            Entrar no sistema
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
