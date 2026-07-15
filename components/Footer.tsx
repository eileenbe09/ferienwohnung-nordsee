import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1f1c19] text-stone-300">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <p className="font-serif text-2xl italic text-white">
              Nordsee<br />
              <span className="not-italic font-semibold text-[#d8c7af]">Ferienwohnungen</span>
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-400">
              Zwei liebevoll eingerichtete Ferienwohnungen in Altfunnixsiel –
              direkt am Feldrand, nah am Meer.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Seiten
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-400">
              {[
                { href: "/", label: "Start" },
                { href: "/wohnungen", label: "Wohnungen" },
                { href: "/anfrage", label: "Anfrage" },
                { href: "/kontakt", label: "Kontakt" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Kontakt
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-400">
              <li>Altfunnixsiel, 26427 Niedersachsen</li>
              <li>
                <a
                  href="mailto:info@ferienwohnungen-lojdl.de"
                  className="hover:text-white transition"
                >
                  info@ferienwohnungen-lojdl.de
                </a>
              </li>
            </ul>

            <Link
              href="/anfrage"
              className="mt-6 inline-flex items-center rounded-full bg-[#66735f] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Jetzt anfragen
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-stone-500">
            © 2026 Nordsee Ferienwohnungen Lojdl
          </p>
          <div className="flex items-center gap-4">
            <Link href="/kontakt" className="text-xs text-stone-500 hover:text-stone-300 transition">
              Impressum
            </Link>
            <Link href="/admin/login" className="text-xs text-stone-600 hover:text-stone-400 transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
