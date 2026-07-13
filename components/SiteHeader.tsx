import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="w-full border-b border-charcoal-700">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-bravo-multimarcas.svg"
            alt="Bravo Multimarcas"
            width={200}
            height={46}
            priority
          />
        </Link>
        <Link
          href="/login"
          className="rounded bg-gold px-5 py-2 font-display text-sm font-semibold uppercase tracking-wide text-charcoal-950 transition-colors hover:bg-gold-dim"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
