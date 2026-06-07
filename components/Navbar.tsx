"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Start" },
  { href: "/wohnungen", label: "Wohnungen" },
  { href: "/anfrage", label: "Anfrage" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="px-4 pt-4 sm:px-6">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-3 sm:px-6 ${
          transparent
            ? "border border-white/20 bg-black/20 backdrop-blur-md"
            : "border border-stone-200 bg-white/95 shadow-sm backdrop-blur-md"
        }`}
      >
        <Link
          href="/"
          className={`text-sm font-semibold tracking-[0.18em] sm:text-base ${
            transparent ? "text-white" : "text-[#1f1c19]"
          }`}
        >
          NORDSEE FERIENWOHNUNGEN
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition ${
                  transparent
                    ? active
                      ? "font-semibold text-white"
                      : "text-white/80 hover:text-white"
                    : active
                    ? "font-semibold text-[#1f1c19]"
                    : "text-stone-500 hover:text-[#1f1c19]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/anfrage"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition md:hidden ${
            transparent
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-[#66735f] text-white hover:opacity-90"
          }`}
        >
          Anfragen
        </Link>
      </div>
    </header>
  );
}
