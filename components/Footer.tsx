import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1f1c19] text-stone-300">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Nordsee Ferienwohnungen
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              Zwei liebevoll eingerichtete Ferienwohnungen in Altfunnixsiel –
              ruhig gelegen, ca. 5 km vom Strand.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Navigation
            </p>
            <ul className="mt-3 space-y-2 text-sm text-stone-400">
              <li><Link href="/" className="hover:text-white transition">Start</Link></li>
              <li><Link href="/wohnungen" className="hover:text-white transition">Wohnungen</Link></li>
              <li><Link href="/anfrage" className="hover:text-white transition">Anfrage</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Kontakt
            </p>
            <ul className="mt-3 space-y-2 text-sm text-stone-400">
              <li>Altfunnixsiel, Niedersachsen</li>
              <li>
                <a href="mailto:info@ferienwohnungen-lojdl.de" className="hover:text-white transition">
                  info@ferienwohnungen-lojdl.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-stone-500">
          © 2026 Nordsee Ferienwohnungen Lojdl ·{" "}
          <Link href="/kontakt" className="hover:text-stone-300 transition">
            Impressum
          </Link>
        </div>
      </div>
    </footer>
  );
}
