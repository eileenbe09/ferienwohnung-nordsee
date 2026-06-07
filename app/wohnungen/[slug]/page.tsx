import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ApartmentGallery from "@/components/ApartmentGallery";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import Navbar from "@/components/Navbar";
import { apartments as staticApartments } from "@/data/apartments";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Statischer Fallback
  const staticApt = staticApartments.find((a) => a.slug === slug);

  // Supabase-Daten versuchen
  const { data: apartment } = await supabase
    .from("apartments")
    .select("*")
    .eq("slug", slug)
    .single();

  // Weder Supabase noch statisch → 404
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

  // Bilder: DB → lokale Gallery → lokales einzelnes Bild
  const galleryImages =
    dbImages && dbImages.length > 0
      ? dbImages.map((i) => i.image_url)
      : staticApt?.gallery && staticApt.gallery.length > 0
      ? staticApt.gallery
      : staticApt?.image
      ? [staticApt.image]
      : ["/images/hero1.avif"];

  // Features: DB → statisch
  const features =
    dbFeatures && dbFeatures.length > 0
      ? dbFeatures.map((f) => ({ id: f.id, label: f.label }))
      : (staticApt?.features ?? []).map((label, i) => ({ id: i, label }));

  // Preise: DB → statisch
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

  // Felder: DB > statisch
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

  return (
    <>
      {/* HERO */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${galleryImages[0]}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="relative z-10 flex h-full flex-col">
          <Navbar transparent />
          <div className="flex flex-1 flex-col justify-end px-4 pb-12 sm:px-6">
            <div className="mx-auto w-full max-w-6xl">
              <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">
                Ferienwohnung
              </p>
              <h1 className="mt-3 font-serif text-4xl italic sm:text-5xl lg:text-6xl">
                {name}
              </h1>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/anfrage"
                  className="rounded-full bg-[#d8c7af] px-6 py-2.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white"
                >
                  Jetzt anfragen
                </Link>
                <Link
                  href="/wohnungen"
                  className="rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  ← Alle Wohnungen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INHALT */}
      <div className="bg-[#f7f3ec]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

          {/* Galerie – volle Breite */}
          <ApartmentGallery images={galleryImages} name={name} />

          {/* Beschreibung + Sidebar */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#66735f]">
                Über diese Wohnung
              </p>
              <p className="mt-4 text-lg leading-8 text-stone-600">{description}</p>

              {/* Ausstattung direkt unter Beschreibung */}
              <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
                <h2 className="font-serif text-2xl text-[#1f1c19]">Ausstattung</h2>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {features.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 rounded-xl bg-[#f7f3ec] px-3 py-2.5 text-sm text-stone-700"
                    >
                      <span className="text-[#66735f]">✓</span>
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
              <h2 className="font-serif text-2xl text-[#1f1c19]">Auf einen Blick</h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Geeignet für", value: guests },
                  { label: "Größe", value: `${size} m²` },
                  { label: "Haustiere", value: pets },
                  { label: "Endreinigung", value: finalCleaning },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-[#f7f3ec] px-4 py-3">
                    <p className="text-xs text-stone-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-[#1f1c19]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-stone-100 pt-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Lage</p>
                  <p className="mt-1 leading-6 text-stone-600">{location}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Kurbeitrag</p>
                  <p className="mt-1 leading-6 text-stone-600">{spaTax}</p>
                </div>
                {optionalAddons && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Optional zubuchbar</p>
                    <p className="mt-1 leading-6 text-stone-600">{optionalAddons}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl">
                <iframe
                  src="https://www.google.com/maps?q=Altfunnixsiel,+Niedersachsen&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  title="Karte"
                />
              </div>

              <Link
                href="/anfrage"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#66735f] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Anfrage senden
              </Link>
            </aside>
          </div>

          {/* Preise */}
          <div className="mt-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
              <h2 className="font-serif text-2xl text-[#1f1c19]">Preise 2026</h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-stone-100">
                {prices.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-5 py-4 ${
                      index !== prices.length - 1 ? "border-b border-stone-100" : ""
                    } ${index % 2 === 0 ? "bg-[#f7f3ec]/50" : "bg-white"}`}
                  >
                    <p className="text-sm text-stone-500">
                      {"label" in item && item.label
                        ? item.label
                        : item.start_date
                        ? `${formatDate(item.start_date)} – ${formatDate(item.end_date)}`
                        : ""}
                    </p>
                    <p className="font-semibold text-[#1f1c19]">
                      {"price" in item && item.price
                        ? item.price
                        : item.price_per_night
                        ? `${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(item.price_per_night))} / Nacht`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-400">
                * Endreinigung 75,00 € einmalig, Kurbeitrag nicht enthalten
              </p>
            </div>
          </div>

          {/* Kalender */}

          {staticApt && (
            <div className="mt-8">
              <AvailabilityCalendar prices={staticApt.prices} slug={slug} />
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-[2rem] bg-[#1f1c19] p-8 text-center text-white sm:p-10">
            <h2 className="font-serif text-2xl italic sm:text-3xl">
              Interesse? Wir freuen uns auf deine Anfrage.
            </h2>
            <p className="mt-2 text-stone-400">Schnelle und persönliche Antwort garantiert.</p>
            <Link
              href="/anfrage"
              className="mt-6 inline-flex items-center rounded-full bg-[#d8c7af] px-8 py-3.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white"
            >
              Jetzt anfragen
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
