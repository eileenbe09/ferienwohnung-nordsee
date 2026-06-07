import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AnfragePage() {
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
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div className="max-w-lg">
                <p className="text-xs uppercase tracking-[0.35em] text-white/75 sm:text-sm">
                  Kontakt
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                  Anfrage senden
                </h1>
                <p className="mt-5 text-base leading-7 text-white/85 sm:text-lg">
                  Schreib uns deinen Wunschzeitraum und wir melden uns schnell
                  bei dir zurück.
                </p>

                <div className="mt-10 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg backdrop-blur-sm">
                      📍
                    </div>
                    <div>
                      <p className="font-medium">Lage</p>
                      <p className="mt-1 text-sm text-white/75">
                        Altfunnixsiel, 26427 Niedersachsen
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg backdrop-blur-sm">
                      🏖️
                    </div>
                    <div>
                      <p className="font-medium">Strand</p>
                      <p className="mt-1 text-sm text-white/75">
                        Ca. 5 km bis Harlesiel & Carolinensiel
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg backdrop-blur-sm">
                      ✉️
                    </div>
                    <div>
                      <p className="font-medium">E-Mail</p>
                      <a
                        href="mailto:info@ferienwohnungen-lojdl.de"
                        className="mt-1 block text-sm text-white/75 hover:text-white transition"
                      >
                        info@ferienwohnungen-lojdl.de
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#f7f3ec] p-6 text-[#1f1c19] shadow-2xl sm:p-8">
                <h2 className="text-xl font-semibold">Deine Anfrage</h2>
                <p className="mt-1 text-sm text-stone-500">
                  Alle Felder mit * sind Pflichtfelder.
                </p>

                <form
                  action="https://formspree.io/f/placeholder"
                  method="POST"
                  className="mt-6 grid gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Vorname *
                      </label>
                      <input
                        name="vorname"
                        required
                        type="text"
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Nachname *
                      </label>
                      <input
                        name="nachname"
                        required
                        type="text"
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      E-Mail *
                    </label>
                    <input
                      name="email"
                      required
                      type="email"
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Telefon
                    </label>
                    <input
                      name="telefon"
                      type="tel"
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Gewünschte Wohnung
                    </label>
                    <select
                      name="wohnung"
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                    >
                      <option value="">Bitte wählen</option>
                      <option value="Seerobbe">Ferienwohnung Seerobbe</option>
                      <option value="Leuchtturm">
                        Ferienwohnung Leuchtturm
                      </option>
                      <option value="Beide">Beide / egal</option>
                    </select>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Anreise *
                      </label>
                      <input
                        name="anreise"
                        required
                        type="date"
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Abreise *
                      </label>
                      <input
                        name="abreise"
                        required
                        type="date"
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Anzahl Personen *
                    </label>
                    <input
                      name="personen"
                      required
                      type="text"
                      placeholder="z. B. 2 Erwachsene, 2 Kinder"
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Nachricht
                    </label>
                    <textarea
                      name="nachricht"
                      rows={4}
                      placeholder="Weitere Wünsche oder Fragen..."
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-[#66735f] focus:ring-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#66735f] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Anfrage absenden
                  </button>

                  <p className="text-center text-xs text-stone-400">
                    Wir melden uns innerhalb von 24 Stunden bei dir.
                  </p>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
