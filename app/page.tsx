import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

type ApartmentRow = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  guests: string | null;
  size: number | null;
  coverImage: { image_url: string }[] | null;
};

const STATIC_COVER: Record<string, string> = {
  seerobbe: "/images/fewo1.1.avif",
  leuchtturm: "/images/fewo2.avif",
};

export default async function Home() {
  const { data: dbApartments } = await supabase
    .from("apartments")
    .select("id, name, slug, short_description, guests, size")
    .order("id", { ascending: true });

  const { data: dbImages } = await supabase
    .from("apartment_images")
    .select("apartment_id, image_url, sort_order")
    .order("sort_order", { ascending: true });

  const typedApartments =
    dbApartments && dbApartments.length > 0
      ? dbApartments.map((apt) => ({
          ...apt,
          coverImage:
            dbImages?.find((img) => img.apartment_id === apt.id)?.image_url ??
            STATIC_COVER[apt.slug] ??
            "/images/hero1.avif",
        }))
      : [
          { id: 1, name: "Ferienwohnung Seerobbe", slug: "seerobbe", short_description: "Ruhige, kinderfreundliche Ferienwohnung mit Terrasse und Spielwiese.", guests: "Bis zu 5 Personen", size: 60, coverImage: "/images/fewo1.1.avif" },
          { id: 2, name: "Ferienwohnung Leuchtturm", slug: "leuchtturm", short_description: "Gemütliche Wohnung mit kleinem Garten und voll ausgestatteter Küche.", guests: "Bis zu 5 Personen", size: 60, coverImage: "/images/fewo2.avif" },
        ];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <main className="relative min-h-screen overflow-hidden text-white">
        {/* Video-Hintergrund – lege die Datei unter public/videos/hero.mp4 ab */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover scale-105"
          poster="/images/hero.avif"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          {/* Fallback wenn kein Video vorhanden */}
        </video>
        {/* Fallback-Bild (sichtbar solange kein Video geladen) */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 -z-10"
          style={{ backgroundImage: "url('/images/hero.avif')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar transparent />

          <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-10 text-center sm:px-6">
            <p className="animate-fade-up text-xs uppercase tracking-[0.4em] text-[#d8c7af] sm:text-sm">
              Altfunnixsiel · Nordsee · Niedersachsen
            </p>

            <h1 className="animate-fade-up delay-100 mt-5 font-serif text-5xl font-normal italic leading-tight sm:text-6xl lg:text-8xl">
              Wo die Seele<br />
              <span className="not-italic font-semibold">durchatmet.</span>
            </h1>

            <p className="animate-fade-up delay-200 mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Zwei liebevoll eingerichtete Ferienwohnungen in ruhiger Feldrandlage –
              familienfreundlich, stilvoll und nur 5 km vom Strand entfernt.
            </p>

            <div className="animate-fade-up delay-300 mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/wohnungen"
                className="rounded-full bg-[#d8c7af] px-8 py-3.5 text-sm font-semibold text-[#1f1c19] shadow-lg transition hover:bg-white hover:scale-105"
              >
                Wohnungen entdecken
              </Link>
              <Link
                href="/anfrage"
                className="rounded-full border border-white/50 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Direkt anfragen
              </Link>
            </div>
          </div>

          {/* Scroll-Indikator */}
          <div className="animate-fade-in delay-500 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs uppercase tracking-[0.3em]">Entdecken</span>
            <div className="h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </div>
      </main>

      {/* ── STATS-LEISTE ──────────────────────────────────────── */}
      <section className="bg-[#1f1c19] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
          {[
            { value: "2", label: "Ferienwohnungen" },
            { value: "60 m²", label: "pro Wohnung" },
            { value: "5 km", label: "bis zum Strand" },
            { value: "5+", label: "Gäste je Wohnung" },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-8 text-center sm:px-10">
              <p className="font-serif text-3xl font-semibold text-[#d8c7af] sm:text-4xl">
                {value}
              </p>
              <p className="mt-1 text-sm text-white/55">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WOHNUNGEN ──────────────────────────────────────────── */}
      <section className="bg-[#f7f3ec] px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#66735f]">
              Unsere Ferienwohnungen
            </p>
            <h2 className="mt-3 font-serif text-4xl italic text-[#1f1c19] sm:text-5xl">
              Zwei Rückzugsorte
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-stone-500">
              Jede Wohnung bietet alles, was du für einen entspannten Familienurlaub
              an der Nordsee brauchst.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {typedApartments.length > 0
              ? typedApartments.map((apt) => {
                  const img = apt.coverImage || "/images/hero1.avif";
                  return (
                    <Link
                      key={apt.id}
                      href={`/wohnungen/${apt.slug}`}
                      className="group overflow-hidden rounded-[2.5rem] bg-white shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div className="relative h-72 overflow-hidden sm:h-80">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url('${img}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {apt.guests}
                        </div>
                      </div>
                      <div className="p-7">
                        <h3 className="font-serif text-2xl text-[#1f1c19]">{apt.name}</h3>
                        <p className="mt-3 leading-7 text-stone-500">{apt.short_description}</p>
                        <div className="mt-5 flex items-center justify-between">
                          <span className="text-sm text-stone-400">{apt.size} m²</span>
                          <span className="rounded-full bg-[#f7f3ec] px-4 py-2 text-sm font-semibold text-[#66735f] transition group-hover:bg-[#66735f] group-hover:text-white">
                            Mehr erfahren →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              : /* Fallback wenn Supabase leer */
                [
                  { name: "Ferienwohnung Seerobbe", slug: "seerobbe", img: "/images/fewo1.1.avif", desc: "Ruhige, kinderfreundliche Ferienwohnung mit Terrasse und Spielwiese." },
                  { name: "Ferienwohnung Leuchtturm", slug: "leuchtturm", img: "/images/fewo2.1.avif", desc: "Gemütliche Wohnung mit kleinem Garten und voll ausgestatteter Küche." },
                ].map((apt) => (
                  <Link
                    key={apt.slug}
                    href={`/wohnungen/${apt.slug}`}
                    className="group overflow-hidden rounded-[2.5rem] bg-white shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="relative h-72 overflow-hidden sm:h-80">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${apt.img}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-7">
                      <h3 className="font-serif text-2xl text-[#1f1c19]">{apt.name}</h3>
                      <p className="mt-3 leading-7 text-stone-500">{apt.desc}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm text-stone-400">60 m²</span>
                        <span className="rounded-full bg-[#f7f3ec] px-4 py-2 text-sm font-semibold text-[#66735f] transition group-hover:bg-[#66735f] group-hover:text-white">
                          Mehr erfahren →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── VORTEILE ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1f1c19] px-4 py-20 sm:px-6 sm:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/landschaft.avif')" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8c7af]">
              Warum bei uns?
            </p>
            <h2 className="mt-3 font-serif text-4xl italic sm:text-5xl">
              Urlaub, wie er sein soll
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🌿",
                title: "Ruhige Feldrandlage",
                desc: "Kein Trubel, kein Lärm – nur Weite, frische Luft und das Rauschen des Windes.",
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Familien willkommen",
                desc: "Babybett, Kinderhochstuhl, Spielwiese, Trampolin, Sandkasten – alles da.",
              },
              {
                icon: "🏖️",
                title: "Strand in 5 Minuten",
                desc: "Harlesiel und Carolinensiel sind mit dem Auto in ca. 5 km erreichbar.",
              },
              {
                icon: "🍳",
                title: "Voll ausgestattet",
                desc: "Küche, Spülmaschine, Waschmaschine, Trockner, WLAN, TV – alles inklusive.",
              },
              {
                icon: "✨",
                title: "Liebevoll eingerichtet",
                desc: "Warmes Design, hochwertige Materialien und eine persönliche Note.",
              },
              {
                icon: "📩",
                title: "Direkte Buchung",
                desc: "Kein Zwischenhändler, keine Gebühren – du buchst direkt bei uns.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10 sm:p-7"
              >
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UMGEBUNG ───────────────────────────────────────────── */}
      <section className="bg-[#f7f3ec] px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#66735f]">
                Die Umgebung
              </p>
              <h2 className="mt-3 font-serif text-4xl italic text-[#1f1c19] sm:text-5xl">
                Nordsee pur
              </h2>
              <p className="mt-5 leading-7 text-stone-500">
                Altfunnixsiel liegt im Herzen Ostfrieslands – umgeben von weiten
                Feldern, frischer Seeluft und der unverwechselbaren Stille der
                Küstenlandschaft.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Harlesiel & Carolinensiel: ca. 5 km",
                  "Nationalpark Wattenmeer direkt nebenan",
                  "Fahrradtouren durch die Marschenlandschaft",
                  "Krabben essen, Deichspaziergänge, Sonnenuntergänge",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-stone-600">
                    <span className="mt-0.5 text-[#66735f]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/anfrage"
                className="mt-8 inline-flex items-center rounded-full bg-[#66735f] px-7 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Jetzt anfragen
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="col-span-2 h-64 rounded-[2rem] bg-cover bg-center shadow-xl sm:h-72"
                style={{ backgroundImage: "url('/images/landschaft.avif')" }}
              />
              <div
                className="h-40 rounded-[2rem] bg-cover bg-center shadow-lg sm:h-48"
                style={{ backgroundImage: `url('${typedApartments.find(a => a.slug === "seerobbe")?.coverImage ?? "/images/fewo1.1.avif"}')` }}
              />
              <div
                className="h-40 rounded-[2rem] bg-cover bg-center shadow-lg sm:h-48"
                style={{ backgroundImage: `url('${typedApartments.find(a => a.slug === "leuchtturm")?.coverImage ?? "/images/fewo2.avif"}')` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero1.avif')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-2xl text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8c7af]">
              Bereit für Urlaub?
            </p>
            <h2 className="mt-3 font-serif text-4xl italic sm:text-5xl lg:text-6xl">
              Dein nächster Sommer<br />
              <span className="not-italic font-semibold">wartet auf dich.</span>
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-white/80">
              Schreib uns einfach – wir antworten schnell und persönlich.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/anfrage"
                className="inline-flex items-center justify-center rounded-full bg-[#d8c7af] px-8 py-4 text-sm font-semibold text-[#1f1c19] shadow-xl transition hover:bg-white hover:scale-105"
              >
                Jetzt Urlaub anfragen
              </Link>
              <Link
                href="/wohnungen"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Wohnungen ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

