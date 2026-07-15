import Navbar from "@/components/Navbar";
import AnfrageForm from "./AnfrageForm";

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function AnfragePage({ searchParams }: PageProps) {
  const params = await searchParams;

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
            <AnfrageForm
              wohnung={params.wohnung}
              anreise={params.anreise}
              abreise={params.abreise}
              personen={params.personen}
              bettwaesche={params.bettwaesche}
              handtuch={params.handtuch}
              preis={params.preis}
            />
          </div>
        </div>
      </div>
    </>
  );
}
