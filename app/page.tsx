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

        {/* CTA final */}
        <section className="bg-charcoal-950 px-6 py-16 text-center">
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
