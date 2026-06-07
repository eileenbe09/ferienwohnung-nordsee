import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function KontaktPage() {
  return (
    <>
      <main className="relative min-h-screen overflow-hidden text-white">
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/landschaft.avif')" }}
        />
        <div className="fixed inset-0 bg-black/40" />

        <div className="relative z-10 pb-20">
          <Navbar transparent />

          <section className="mx-auto mt-10 max-w-6xl px-4 sm:mt-14 sm:px-6 lg:mt-20">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/75 sm:text-sm">
                Kontakt & Impressum
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                So erreichst du uns
              </h1>
              <p className="mt-5 text-base leading-7 text-white/85 sm:text-lg">
                Bei Fragen zu unseren Ferienwohnungen, Verfügbarkeiten oder
                Preisen stehen wir dir gerne zur Verfügung.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[2rem] border border-white/20 bg-black/25 p-6 backdrop-blur-md sm:p-8">
                <div className="text-3xl">📍</div>
                <h2 className="mt-4 text-lg font-semibold">Adresse</h2>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Altfunnixsiel<br />
                  26427 Neuharlingersiel<br />
                  Niedersachsen
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/20 bg-black/25 p-6 backdrop-blur-md sm:p-8">
                <div className="text-3xl">✉️</div>
                <h2 className="mt-4 text-lg font-semibold">E-Mail</h2>
                <a
                  href="mailto:info@ferienwohnungen-lojdl.de"
                  className="mt-2 block text-sm leading-6 text-white/80 hover:text-white transition"
                >
                  info@ferienwohnungen-lojdl.de
                </a>
                <p className="mt-3 text-xs text-white/55">
                  Antwort in der Regel innerhalb von 24 Stunden
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/20 bg-black/25 p-6 backdrop-blur-md sm:p-8">
                <div className="text-3xl">🏖️</div>
                <h2 className="mt-4 text-lg font-semibold">Lage</h2>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Ca. 5 km bis Harlesiel<br />
                  Ca. 5 km bis Carolinensiel<br />
                  Ruhige Feldrandlage
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[2rem] shadow-2xl">
              <iframe
                src="https://www.google.com/maps?q=Altfunnixsiel,+Niedersachsen&output=embed"
                width="100%"
                height="380"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                title="Karte von Altfunnixsiel"
              />
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/20 bg-black/25 p-6 backdrop-blur-md sm:p-8 lg:p-10">
              <h2 className="text-2xl font-semibold">Impressum</h2>
              <div className="mt-4 space-y-2 text-sm leading-7 text-white/80">
                <p className="font-medium text-white">
                  Ferienwohnungen Lojdl
                </p>
                <p>Altfunnixsiel, 26427 Niedersachsen</p>
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:info@ferienwohnungen-lojdl.de"
                    className="hover:text-white transition"
                  >
                    info@ferienwohnungen-lojdl.de
                  </a>
                </p>
                <p className="pt-2 text-white/55 text-xs">
                  Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV:
                  Ferienwohnungen Lojdl, Altfunnixsiel, 26427 Niedersachsen
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/anfrage"
                className="inline-flex items-center justify-center rounded-full bg-[#d8c7af] px-8 py-3.5 text-sm font-semibold text-[#1f1c19] transition hover:opacity-90"
              >
                Jetzt anfragen
              </Link>
            </div>
          </section>
        </div>
      </main>

    </>
  );
}

