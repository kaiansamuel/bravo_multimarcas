import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { lojas } from "@/db/schema";
import StoreSwitcher from "@/components/StoreSwitcher";
import LogoutButton from "@/components/LogoutButton";
import NavLink from "@/components/NavLink";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  const todasLojas = session?.papel === "gestor"
    ? await db.select().from(lojas)
    : [];

  const navLinks = [
    { href: "/dashboard", label: "Visão Geral" },
    { href: "/dashboard/estoque", label: "Estoque" },
    { href: "/dashboard/financeiro", label: "Financeiro" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-charcoal-950">
      {/* Top bar */}
      <header className="border-b border-charcoal-700 bg-charcoal-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <Image
                src="/logo-bravo-multimarcas.svg"
                alt="Bravo Multimarcas"
                width={160}
                height={36}
              />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {session?.papel === "gestor" && (
              <StoreSwitcher lojas={todasLojas} />
            )}
            <span className="hidden text-sm text-paper-muted md:block">
              {session?.papel === "gestor" ? "Gestor" : "Operador"}
            </span>
            <LogoutButton />
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-t border-charcoal-700 px-6 py-2 md:hidden">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
