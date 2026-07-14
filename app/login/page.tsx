"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao fazer login.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-bravo-multimarcas.svg"
            alt="Bravo Multimarcas"
            width={220}
            height={50}
            priority
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
        >
          <h1 className="mb-6 text-center font-display text-xl font-semibold uppercase tracking-wide text-paper">
            Entrar
          </h1>

          {erro && (
            <div className="mb-4 rounded bg-wine/20 px-4 py-2 text-sm text-wine">
              {erro}
            </div>
          )}

          <label className="mb-1 block text-sm text-paper-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 w-full rounded border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-paper placeholder:text-paper-muted/50 focus:border-gold focus:outline-none"
            placeholder="seu@email.com"
          />

          <label className="mb-1 block text-sm text-paper-muted">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="mb-6 w-full rounded border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-paper placeholder:text-paper-muted/50 focus:border-gold focus:outline-none"
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-gold py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-charcoal-950 transition-colors hover:bg-gold-dim disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-paper-muted">
          Acesso restrito a funcionários da rede Bravo Multimarcas.
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-paper-muted transition-colors hover:text-gold"
          >
            &larr; Voltar para a home
          </Link>
        </div>
      </div>
    </div>
  );
}
