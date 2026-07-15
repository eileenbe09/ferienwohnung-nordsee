import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ApartmentGallery from "@/components/ApartmentGallery";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import PriceCalculator from "@/components/PriceCalculator";
import Navbar from "@/components/Navbar";
import { apartments as staticApartments } from "@/data/apartments";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const staticApt = staticApartments.find((a) => a.slug === slug);

  const { data: apartment } = await supabase
    .from("apartments")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!apartment && !staticApt) notFound();

  const { data: dbImages } = await supabase
    .from("apartment_images")
    .select("*")
    .eq("apartment_id", apartment?.id ?? 0)
    .order("sort_order", { ascending: true });

  const { data: dbFeatures } = await supabase
    .from("apartment_features")
    .select("*")
    .eq("apartment_id", apartment?.id ?? 0)
    .order("sort_order", { ascending: true });

  const { data: dbPrices } = await supabase
    .from("apartment_prices")
    .select("*")
    .eq("apartment_id", apartment?.id ?? 0)
    .order("start_date", { ascending: true });

  const galleryImages =
    dbImages && dbImages.length > 0
      ? dbImages.map((i) => i.image_url)
      : staticApt?.gallery && staticApt.gallery.length > 0
      ? staticApt.gallery
      : staticApt?.image
      ? [staticApt.image]
      : ["/images/hero1.avif"];

  const features =
    dbFeatures && dbFeatures.length > 0
      ? dbFeatures.map((f) => ({ id: f.id, label: f.label }))
      : (staticApt?.features ?? []).map((label, i) => ({ id: i, label }));

  const prices =
    dbPrices && dbPrices.length > 0
      ? dbPrices
      : (staticApt?.prices ?? []).map((p, i) => ({
          id: i,
          start_date: null,
          end_date: null,
          price_per_night: null,
          label: `${p.from} – ${p.to}`,
          price: p.price,
        }));

  const name = apartment?.name ?? staticApt?.name ?? "";
  const description = apartment?.description ?? staticApt?.description ?? "";
  const guests = apartment?.guests ?? staticApt?.guests ?? "";
  const size = apartment?.size ?? staticApt?.size ?? 60;
  const pets = apartment?.pets ?? staticApt?.pets ?? "Nicht erlaubt";
  const finalCleaning = apartment?.final_cleaning ?? staticApt?.finalCleaning ?? "75,00 € einmalig";
  const location = apartment?.location ?? staticApt?.location ?? "Altfunnixsiel, ca. 5 km bis Harlesiel";
  const spaTax = apartment?.spa_tax ?? staticApt?.spaTax ?? "Erwachsene 2,50 € / Nacht";
  const optionalAddons = apartment?.optional_addons ?? "Bettwäsche-Set, Handtücher auf Anfrage";

  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat("de-DE").format(new Date(dateString));
  }

  const highlights = [
    { icon: "🏠", label: `${size} m²` },
    { icon: "👨‍👩‍👧", label: guests },
    { icon: "🏖️", label: "5 km Strand" },
    { icon: "🐾", label: pets },
  ];

  return (
    <>
      {/* ── FULLSCREEN HERO ─────────────────────────────────── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] hover:scale-105"
          style={{ backgroundImage: `url('${galleryImages[0]}')` }}
        />
        {/* Dunkler Verlauf von unten */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <Navbar transparent />

          {/* Titel unten links */}
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14">
            <Link
              href="/wohnungen"
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition hover:bg-white/20"
            >
              ← Alle Wohnungen
            </Link>
            <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Ferienwohnung</p>
            <h1 className="mt-2 font-serif text-5xl italic leading-tight sm:text-6xl lg:text-7xl">
              {name}
            </h1>

            {/* Highlight-Pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {highlights.map(({ icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm"
                >
                  {icon} {label}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/anfrage"
                className="inline-flex items-center gap-2 rounded-full bg-[#d8c7af] px-7 py-3 text-sm font-semibold text-[#1f1c19] shadow-lg transition hover:bg-white hover:scale-105"
              >
                Jetzt anfragen →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── GALERIE ─────────────────────────────────────────── */}
      <div className="bg-[#1f1c19] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <ApartmentGallery images={galleryImages} name={name} />
        </div>
      </div>

      {/* ── BESCHREIBUNG + SIDEBAR ──────────────────────────── */}
      <div className="bg-[#f7f3ec]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">

            {/* LINKE SPALTE */}
            <div className="space-y-8">

              {/* Beschreibung */}
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#66735f]">Über diese Wohnung</p>
                <p className="mt-4 text-lg leading-8 text-stone-600">{description}</p>
              </div>

              {/* Ausstattung – Icon-Grid */}
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#66735f]">Ausstattung</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {features.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-white px-4 py-3 shadow-sm transition hover:border-[#66735f]/40 hover:shadow-md"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#66735f]/10 text-xs font-bold text-[#66735f]">✓</span>
                      <span className="text-sm text-stone-700">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preiskalkulator */}
              {staticApt && (
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#66735f]">Preis berechnen</p>
                  <div className="mt-4">
                    <PriceCalculator slug={slug} prices={staticApt.prices} finalCleaning={staticApt.finalCleaning} />
                  </div>
                </div>
              )}

              {/* Kalender mit Belegung */}
              {staticApt && (
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#66735f]">Belegung & Preissaisons</p>
                  <div className="mt-4">
                    <AvailabilityCalendar prices={staticApt.prices} slug={slug} />
                  </div>
                </div>
              )}
            </div>

            {/* RECHTE SPALTE – Sticky Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-6">

              {/* Buchungs-Card */}
              <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
                {/* Header mit Bild */}
                <div
                  className="h-36 bg-cover bg-center"
                  style={{ backgroundImage: `url('${galleryImages[1] ?? galleryImages[0]}')` }}
                />
                <div className="p-6">
                  <h2 className="font-serif text-xl text-[#1f1c19]">Auf einen Blick</h2>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      { icon: "📐", label: "Größe", value: `${size} m²` },
                      { icon: "👨‍👩‍👧", label: "Gäste", value: guests },
                      { icon: "🧹", label: "Endreinigung", value: finalCleaning },
                      { icon: "🐾", label: "Haustiere", value: pets },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="rounded-xl bg-[#f7f3ec] p-3">
                        <p className="text-lg">{icon}</p>
                        <p className="mt-1 text-xs text-stone-400">{label}</p>
                        <p className="text-sm font-semibold text-[#1f1c19]">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-3 border-t border-stone-100 pt-4 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-base">📍</span>
                      <p className="text-stone-500 leading-6">{location}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-base">💶</span>
                      <p className="text-stone-500 leading-6">{spaTax}</p>
                    </div>
                    {optionalAddons && (
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-base">➕</span>
                        <p className="text-stone-500 leading-6">{optionalAddons}</p>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/anfrage"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#1f1c19] py-3.5 text-sm font-semibold text-white transition hover:bg-[#66735f]"
                  >
                    Anfrage senden →
                  </Link>
                </div>
              </div>

              {/* Karte */}
              <div className="overflow-hidden rounded-3xl shadow-sm">
                <iframe
                  src="https://www.google.com/maps?q=Altfunnixsiel,+Niedersachsen&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  title="Karte"
                />
              </div>
            </aside>
          </div>

          {/* ── CTA BANNER ────────────────────────────────────── */}
          <div className="relative mt-10 overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${galleryImages[2] ?? galleryImages[0]}')` }}
            />
            <div className="absolute inset-0 bg-[#1f1c19]/80" />
            <div className="relative z-10 px-8 py-12 text-center text-white sm:px-12 sm:py-16">
              <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Interesse geweckt?</p>
              <h2 className="mt-3 font-serif text-3xl italic sm:text-4xl">
                Wir freuen uns auf deine Anfrage.
              </h2>
              <p className="mt-3 text-stone-300">
                Schnelle und persönliche Antwort garantiert.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <Link
                  href="/anfrage"
                  className="rounded-full bg-[#d8c7af] px-8 py-3.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white"
                >
                  Jetzt anfragen →
                </Link>
                <Link
                  href="/wohnungen"
                  className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Andere Wohnung ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
