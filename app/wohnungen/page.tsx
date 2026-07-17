import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const STATIC_FALLBACK = [
  {
    id: 1,
    name: "Ferienwohnung Seerobbe",
    slug: "seerobbe",
    short_description: "Ruhige, kinderfreundliche Ferienwohnung mit Terrasse, Spielwiese und zwei Schlafzimmern.",
    guests: "Bis zu 5 Personen",
    size: 60,
    coverImage: "/images/fewo1.1.avif",
  },
  {
    id: 2,
    name: "Ferienwohnung Leuchtturm",
    slug: "leuchtturm",
    short_description: "Gemütliche Wohnung mit kleinem Gartenstück und voll ausgestatteter Küche.",
    guests: "Bis zu 5 Personen",
    size: 60,
    coverImage: "/images/fewo2.avif",
  },
];

export default async function WohnungenPage() {
  // Wohnungsdaten aus Supabase laden
  const { data: dbApartments } = await supabase
    .from("apartments")
    .select("id, name, slug, short_description, guests, size")
    .order("id", { ascending: true });

  // Erstes Bild je Wohnung laden
  const { data: dbImages } = await supabase
    .from("apartment_images")
    .select("apartment_id, image_url, sort_order")
    .order("sort_order", { ascending: true });

  const apartments =
    dbApartments && dbApartments.length > 0
      ? dbApartments.map((apt) => ({
          ...apt,
          coverImage:
            dbImages?.find((img) => img.apartment_id === apt.id)?.image_url ??
            STATIC_FALLBACK.find((f) => f.slug === apt.slug)?.coverImage ??
            "/images/hero1.avif",
        }))
      : STATIC_FALLBACK;

  return (
    <>
      {/* HERO */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero1.avif')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 flex h-full flex-col">
          <Navbar transparent />
          <div className="flex flex-1 flex-col justify-end px-4 pb-10 sm:px-6">
            <div className="mx-auto w-full max-w-6xl">
              <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Unsere Ferienwohnungen</p>
              <h1 className="mt-3 font-serif text-4xl italic sm:text-5xl lg:text-6xl">
                Zwei Rückzugsorte<br />
                <span className="not-italic font-semibold">an der Nordsee</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-[#1f1c19] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
          {[
            { value: "2", label: "Ferienwohnungen" },
            { value: "60 m²", label: "je Wohnung" },
            { value: "5 km", label: "bis zum Strand" },
            { value: "5+", label: "Gäste je Wohnung" },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-7 text-center">
              <p className="font-serif text-2xl font-semibold text-[#d8c7af] sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs text-white/50">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WOHNUNGEN */}
      <section className="bg-[#f7f3ec] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-10">
          {apartments.map((apt, i) => {
            const img = apt.coverImage;
            const isEven = i % 2 === 0;
            return (
              <div key={apt.id} className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:shadow-xl">
                <div className={`grid lg:grid-cols-2 ${!isEven ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  {/* Bild */}
                  <div className="relative h-64 overflow-hidden lg:h-auto lg:min-h-[380px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${img}')` }}
                    />
                  </div>

                  {/* Infos */}
                  <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:p-12">
                    <div>
                      <span className="inline-block rounded-full bg-[#66735f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#66735f]">
                        Ferienwohnung
                      </span>
                      <h2 className="mt-3 font-serif text-3xl text-[#1f1c19] sm:text-4xl">{apt.name}</h2>
                      <p className="mt-3 leading-7 text-stone-500">{apt.short_description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Größe", value: `${apt.size} m²` },
                        { label: "Gäste", value: apt.guests ?? "–" },
                        { label: "Strand", value: "ca. 5 km" },
                        { label: "Haustiere", value: "Nicht erlaubt" },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-2xl bg-[#f7f3ec] px-4 py-3">
                          <p className="text-xs text-stone-400">{label}</p>
                          <p className="mt-0.5 text-sm font-semibold text-[#1f1c19]">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/wohnungen/${apt.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[#1f1c19] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#66735f]"
                      >
                        Details & Galerie →
                      </Link>
                      <Link
                        href="/anfrage"
                        className="inline-flex items-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-[#1f1c19] transition hover:border-[#66735f] hover:text-[#66735f]"
                      >
                        Anfragen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1f1c19] px-4 py-16 text-center text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Bereit für den Urlaub?</p>
          <h2 className="mt-4 font-serif text-3xl italic sm:text-4xl">Jetzt unverbindlich anfragen</h2>
          <p className="mt-4 text-stone-400">Schnelle und persönliche Antwort garantiert.</p>
          <Link
            href="/anfrage"
            className="mt-8 inline-flex items-center rounded-full bg-[#d8c7af] px-8 py-3.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white"
          >
            Anfrage senden
          </Link>
        </div>
      </section>
    </>
  );
}
