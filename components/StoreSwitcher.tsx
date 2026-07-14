"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Loja {
  id: string;
  nome: string;
}

export default function StoreSwitcher({ lojas }: { lojas: Loja[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lojaAtual = searchParams.get("loja") || "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("loja", e.target.value);
    } else {
      params.delete("loja");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={lojaAtual}
      onChange={handleChange}
      className="cursor-pointer rounded border border-charcoal-700 bg-charcoal-800 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
    >
      <option value="">Todas as lojas</option>
      {lojas.map((loja) => (
        <option key={loja.id} value={loja.id}>
          {loja.nome}
        </option>
      ))}
    </select>
  );
}
