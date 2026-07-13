"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded border border-charcoal-700 px-3 py-1.5 text-sm text-paper-muted transition-colors hover:border-wine hover:text-wine"
    >
      Sair
    </button>
  );
}
