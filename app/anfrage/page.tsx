import Navbar from "@/components/Navbar";

export default function AnfragePage() {
  return (
    <>
      {/* HEADER */}
      <div className="bg-[#1f1c19] pt-0">
        <Navbar dark />
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
          <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Kontakt</p>
          <h1 className="mt-3 font-serif text-4xl italic text-white sm:text-5xl">
            Anfrage senden
          </h1>
          <p className="mt-3 max-w-lg text-stone-400">
            Schreib uns deinen Wunschzeitraum – wir melden uns schnell und persönlich zurück.
          </p>
        </div>
      </div>

      {/* INHALT */}
      <div className="bg-[#f7f3ec] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">

            {/* Links: Infos */}
            <div className="space-y-6">
              {[
                {
                  icon: "📍",
                  title: "Adresse",
                  text: "Altfunnixsiel\n26427 Neuharlingersiel\nNiedersachsen",
                },
                {
                  icon: "✉️",
                  title: "E-Mail",
                  text: "info@ferienwohnungen-lojdl.de",
                  href: "mailto:info@ferienwohnungen-lojdl.de",
                },
                {
                  icon: "🏖️",
                  title: "Zum Strand",
                  text: "Ca. 5 km bis Harlesiel & Carolinensiel",
                },
                {
                  icon: "⏱️",
                  title: "Antwortzeit",
                  text: "Wir antworten in der Regel innerhalb von 24 Stunden.",
                },
              ].map(({ icon, title, text, href }) => (
                <div key={title} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7f3ec] text-xl">
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1f1c19]">{title}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-sm leading-6 text-stone-500 hover:text-[#66735f] transition">
                        {text}
                      </a>
                    ) : (
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-500">{text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Rechts: Formular */}
            <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
              <h2 className="font-serif text-2xl text-[#1f1c19]">Deine Anfrage</h2>
              <p className="mt-1 text-sm text-stone-400">Felder mit * sind Pflichtfelder.</p>

              <form
                action="https://formspree.io/f/placeholder"
                method="POST"
                className="mt-6 space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Vorname *</label>
                    <input name="vorname" required type="text"
                      className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Nachname *</label>
                    <input name="nachname" required type="text"
                      className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">E-Mail *</label>
                    <input name="email" required type="email"
                      className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Telefon</label>
                    <input name="telefon" type="tel"
                      className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Gewünschte Wohnung</label>
                  <select name="wohnung"
                    className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition">
                    <option value="">Bitte wählen</option>
                    <option value="Seerobbe">Ferienwohnung Seerobbe</option>
                    <option value="Leuchtturm">Ferienwohnung Leuchtturm</option>
                    <option value="Beide">Beide / egal</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Anreise *</label>
                    <input name="anreise" required type="date"
                      className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Abreise *</label>
                    <input name="abreise" required type="date"
                      className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Anzahl Personen *</label>
                  <input name="personen" required type="text" placeholder="z. B. 2 Erwachsene, 2 Kinder"
                    className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Nachricht</label>
                  <textarea name="nachricht" rows={4} placeholder="Weitere Wünsche oder Fragen..."
                    className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition resize-none" />
                </div>

                <button type="submit"
                  className="w-full rounded-full bg-[#1f1c19] py-3.5 text-sm font-semibold text-white transition hover:bg-[#66735f]">
                  Anfrage absenden →
                </button>
                <p className="text-center text-xs text-stone-400">Wir melden uns innerhalb von 24 Stunden.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
