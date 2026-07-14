"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`rounded px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-charcoal-800 font-medium text-paper"
          : "text-paper-muted hover:bg-charcoal-800 hover:text-paper"
      }`}
    >
      {label}
    </Link>
  );
}
