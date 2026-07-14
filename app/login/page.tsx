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
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
            <div role="alert" className="mb-4 rounded bg-wine/20 px-4 py-2 text-sm text-wine">
              {erro}
            </div>
          )}

          <label htmlFor="email" className="mb-1 block text-sm text-paper-muted">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mb-4 w-full rounded border border-charcoal-700 bg-charcoal-950 px-3 py-2.5 text-paper placeholder:text-paper-muted/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="seu@email.com"
          />

          <label htmlFor="senha" className="mb-1 block text-sm text-paper-muted">Senha</label>
          <div className="relative mb-6">
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded border border-charcoal-700 bg-charcoal-950 px-3 py-2.5 pr-10 text-paper placeholder:text-paper-muted/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-paper-muted transition-colors hover:text-paper focus:outline-none focus:ring-2 focus:ring-gold/40 focus:rounded"
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-gold py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-charcoal-950 transition-colors hover:bg-gold-dim focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 focus:ring-offset-charcoal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
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
