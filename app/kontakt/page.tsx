import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function KontaktPage() {
  return (
    <>
      {/* HEADER */}
      <div className="bg-[#1f1c19]">
        <Navbar dark />
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
          <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Kontakt & Impressum</p>
          <h1 className="mt-3 font-serif text-4xl italic text-white sm:text-5xl">
            So erreichst du uns
          </h1>
          <p className="mt-3 max-w-lg text-stone-400">
            Bei Fragen zu unseren Ferienwohnungen, Verfügbarkeiten oder Preisen stehen wir dir gerne zur Verfügung.
          </p>
        </div>
      </div>

      {/* KONTAKTKARTEN */}
      <section className="bg-[#f7f3ec] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: "📍",
                title: "Adresse",
                lines: ["Altfunnixsiel", "26409 Wittmund", "Niedersachsen"],
              },
              {
                icon: "✉️",
                title: "E-Mail",
                lines: ["info@altfunnixsiel-ferien.de"],
                href: "mailto:info@altfunnixsiel-ferien.de",
                sub: "Antwort innerhalb von 24 Stunden",
              },
              {
                icon: "🏖️",
                title: "Lage",
                lines: ["Ca. 5 km bis Harlesiel", "Ca. 5 km bis Carolinensiel", "Ruhige Feldrandlage"],
              },
            ].map(({ icon, title, lines, href, sub }) => (
              <div key={title} className="rounded-3xl bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f3ec] text-2xl">
                  {icon}
                </div>
                <h2 className="mt-4 font-serif text-xl text-[#1f1c19]">{title}</h2>
                <div className="mt-3 space-y-0.5">
                  {lines.map((l) =>
                    href ? (
                      <a key={l} href={href} className="block text-sm leading-6 text-stone-500 hover:text-[#66735f] transition">
                        {l}
                      </a>
                    ) : (
                      <p key={l} className="text-sm leading-6 text-stone-500">{l}</p>
                    )
                  )}
                  {sub && <p className="mt-2 text-xs text-stone-400">{sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* KARTE */}
          <div className="mt-8 overflow-hidden rounded-3xl shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=Altfunnixsiel,+Niedersachsen&output=embed"
              width="100%"
              height="360"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              title="Karte von Altfunnixsiel"
            />
          </div>

          {/* IMPRESSUM */}
          <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm sm:p-10">
            <h2 className="font-serif text-2xl text-[#1f1c19]">Impressum</h2>
            <div className="mt-4 space-y-1 text-sm leading-7 text-stone-500">
              <p className="font-semibold text-[#1f1c19]">Manuela Lojdl</p>
              <p>Fritz-Reuterstraße 13</p>
              <p>46244 Bottrop (Kirchhellen)</p>
              <p>
                E-Mail:{" "}
                <a href="mailto:info@altfunnixsiel-ferien.de" className="hover:text-[#66735f] transition">
                  info@altfunnixsiel-ferien.de
                </a>
              </p>
              <p className="pt-3 text-xs text-stone-400">
                Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV: Manuela Lojdl, Fritz-Reuterstraße 13, 46244 Bottrop
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/anfrage"
              className="inline-flex items-center rounded-full bg-[#1f1c19] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#66735f]"
            >
              Jetzt anfragen →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
