import Link from "next/link";
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

const fallback = [
  {
    id: 1,
    name: "Ferienwohnung Seerobbe",
    slug: "seerobbe",
    short_description:
      "Ruhige, kinderfreundliche Ferienwohnung mit Terrasse, Spielwiese und zwei Schlafzimmern.",
    guests: "Bis zu 5 Personen",
    size: 60,
    coverImage: [{ image_url: "/images/fewo1.1.avif" }],
  },
  {
    id: 2,
    name: "Ferienwohnung Leuchtturm",
    slug: "leuchtturm",
    short_description:
      "Gemütliche Wohnung mit kleinem Gartenstück und voll ausgestatteter Küche.",
    guests: "Bis zu 5 Personen",
    size: 60,
    coverImage: [{ image_url: "/images/fewo2.1.avif" }],
  },
];

export default async function WohnungenPage() {
  const { data: apartments } = await supabase
    .from("apartments")
    .select(`id, name, slug, short_description, guests, size,
      coverImage:apartment_images!apartment_id(image_url, is_cover)`)
    .eq("is_active", true)
    .eq("coverImage.is_cover", true)
    .order("name", { ascending: true });

  const typedApartments =
    (apartments as ApartmentRow[] | null)?.length
      ? (apartments as ApartmentRow[])
      : fallback;

  return (
    <>
      {/* HERO */}
      <div className="relative h-[50vh] min-h-[380px] overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero1.avif')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
        <div className="relative z-10 flex h-full flex-col">
          <Navbar transparent />
          <div className="flex flex-1 flex-col justify-center px-4 sm:px-6">
            <div className="mx-auto w-full max-w-6xl">
              <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">
                Unsere Ferienwohnungen
              </p>
              <h1 className="mt-4 font-serif text-4xl italic leading-tight sm:text-5xl lg:text-6xl">
                Zwei Rückzugsorte<br />
                <span className="not-italic font-semibold">an der Nordsee</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* EINLEITUNG */}
      <section className="bg-[#f7f3ec] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="max-w-2xl text-lg leading-8 text-stone-600">
            Beide Wohnungen liegen in ruhiger Feldrandlage in Altfunnixsiel,
            sind liebevoll eingerichtet und bieten alles, was Familien für einen
            entspannten Urlaub an der Nordsee brauchen.
          </p>

          {/* KACHELN */}
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {[
              { icon: "🏠", label: "2 Wohnungen" },
              { icon: "📐", label: "Je 60 m²" },
              { icon: "🏖️", label: "5 km Strand" },
              { icon: "👨‍👩‍👧", label: "Familien-freundlich" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-[#1f1c19]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WOHNUNGEN */}
      <section className="bg-[#f7f3ec] px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          {typedApartments.map((apt, i) => {
            const img = apt.coverImage?.[0]?.image_url || "/images/hero1.avif";
            const isEven = i % 2 === 0;
            return (
              <div
                key={apt.id}
                className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl"
              >
                <div className={`grid lg:grid-cols-2 ${isEven ? "" : "lg:[&>*:first-child]:order-2"}`}>
                  {/* Bild */}
                  <div className="relative h-72 overflow-hidden lg:h-auto lg:min-h-[420px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-105"
                      style={{ backgroundImage: `url('${img}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  {/* Infos */}
                  <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#66735f]">
                      Ferienwohnung
                    </p>
                    <h2 className="mt-2 font-serif text-3xl text-[#1f1c19] sm:text-4xl">
                      {apt.name}
                    </h2>
                    <p className="mt-4 leading-7 text-stone-500">
                      {apt.short_description}
                    </p>

                    <div className="mt-7 grid grid-cols-2 gap-3">
                      {[
                        { label: "Größe", value: `${apt.size} m²` },
                        { label: "Gäste", value: apt.guests ?? "–" },
                        { label: "Strand", value: "ca. 5 km" },
                        { label: "Haustiere", value: "Nicht erlaubt" },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-2xl bg-[#f7f3ec] px-4 py-3">
                          <p className="text-xs text-stone-400">{label}</p>
                          <p className="mt-0.5 text-sm font-medium text-[#1f1c19]">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/wohnungen/${apt.slug}`}
                        className="inline-flex items-center justify-center rounded-full bg-[#66735f] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Details & Galerie
                      </Link>
                      <Link
                        href="/anfrage"
                        className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-[#1f1c19] transition hover:bg-[#f7f3ec]"
                      >
                        Anfrage senden
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
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl italic sm:text-4xl">
            Noch Fragen? Wir helfen gerne.
          </h2>
          <p className="mt-4 text-stone-400">
            Schreib uns einfach – wir antworten schnell und persönlich.
          </p>
          <Link
            href="/anfrage"
            className="mt-8 inline-flex items-center rounded-full bg-[#d8c7af] px-8 py-3.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white"
          >
            Jetzt anfragen
          </Link>
        </div>
      </section>

    </>
  );
}

