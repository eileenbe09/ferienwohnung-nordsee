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
      {/* HEADER */}
      <div className="relative overflow-hidden bg-[#1f1c19] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${galleryImages[0]}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f1c19]/80 to-[#1f1c19]" />
        <div className="relative z-10">
          <Navbar dark />
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
            <Link href="/wohnungen" className="inline-flex items-center gap-1 text-xs text-stone-400 transition hover:text-white">
              ← Alle Wohnungen
            </Link>
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Ferienwohnung</p>
            <h1 className="mt-3 font-serif text-4xl italic sm:text-5xl lg:text-6xl">{name}</h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/anfrage"
                className="rounded-full bg-[#d8c7af] px-6 py-2.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white">
                Jetzt anfragen
              </Link>
              <div className="flex items-center gap-4 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/70">
                <span>{size} m²</span>
                <span className="text-white/20">|</span>
                <span>{guests}</span>
                <span className="text-white/20">|</span>
                <span>5 km Strand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INHALT */}
      <div className="bg-[#f7f3ec]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">

          {/* Galerie */}
          <ApartmentGallery images={galleryImages} name={name} />

          {/* Beschreibung + Sidebar */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#66735f]">Über diese Wohnung</p>
                <p className="mt-3 text-base leading-8 text-stone-600">{description}</p>
              </div>

              {/* Ausstattung */}
              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-serif text-2xl text-[#1f1c19]">Ausstattung</h2>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {features.map((f) => (
                    <div key={f.id} className="flex items-center gap-2 rounded-xl bg-[#f7f3ec] px-3 py-2.5 text-sm text-stone-700">
                      <span className="text-[#66735f] font-bold">✓</span>
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preise */}
              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-serif text-2xl text-[#1f1c19]">Preise 2026</h2>
                <div className="mt-5 divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-100">
                  {prices.map((item, index) => (
                    <div key={item.id}
                      className={`flex items-center justify-between px-5 py-4 ${index % 2 === 0 ? "bg-[#f7f3ec]/40" : "bg-white"}`}>
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
                <p className="mt-3 text-xs text-stone-400">* Endreinigung 75,00 € einmalig, Kurbeitrag nicht enthalten</p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-7">
                <h2 className="font-serif text-xl text-[#1f1c19]">Auf einen Blick</h2>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Geeignet für", value: guests },
                    { label: "Größe", value: `${size} m²` },
                    { label: "Haustiere", value: pets },
                    { label: "Endreinigung", value: finalCleaning },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-2xl bg-[#f7f3ec] px-3 py-3">
                      <p className="text-xs text-stone-400">{label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-[#1f1c19]">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 border-t border-stone-100 pt-5 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Lage</p>
                    <p className="mt-1 leading-6 text-stone-600">{location}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Kurbeitrag</p>
                    <p className="mt-1 leading-6 text-stone-600">{spaTax}</p>
                  </div>
                  {optionalAddons && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Optional</p>
                      <p className="mt-1 leading-6 text-stone-600">{optionalAddons}</p>
                    </div>
                  )}
                </div>

                <Link href="/anfrage"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#1f1c19] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#66735f]">
                  Anfrage senden →
                </Link>
              </div>

              <div className="overflow-hidden rounded-3xl shadow-sm">
                <iframe
                  src="https://www.google.com/maps?q=Altfunnixsiel,+Niedersachsen&output=embed"
                  width="100%" height="220"
                  style={{ border: 0, display: "block" }}
                  loading="lazy" title="Karte"
                />
              </div>
            </aside>
          </div>

          {/* Kalender */}
          {staticApt && (
            <div className="mt-8">
              <AvailabilityCalendar prices={staticApt.prices} slug={slug} />
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-[#1f1c19] p-8 text-center text-white sm:p-10">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Interesse geweckt?</p>
            <h2 className="mt-3 font-serif text-2xl italic sm:text-3xl">
              Wir freuen uns auf deine Anfrage.
            </h2>
            <p className="mt-2 text-stone-400">Schnelle und persönliche Antwort garantiert.</p>
            <Link href="/anfrage"
              className="mt-6 inline-flex items-center rounded-full bg-[#d8c7af] px-8 py-3.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white">
              Jetzt anfragen →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
