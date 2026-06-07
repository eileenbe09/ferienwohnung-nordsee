import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ApartmentGallery from "@/components/ApartmentGallery";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: apartment, error: apartmentError } = await supabase
    .from("apartments")
    .select("*")
    .eq("slug", slug)
    .single();

  if (apartmentError || !apartment) {
    notFound();
  }

  const { data: images, error: imagesError } = await supabase
    .from("apartment_images")
    .select("*")
    .eq("apartment_id", apartment.id)
    .order("sort_order", { ascending: true });

  const { data: features, error: featuresError } = await supabase
    .from("apartment_features")
    .select("*")
    .eq("apartment_id", apartment.id)
    .order("sort_order", { ascending: true });

  const { data: prices, error: pricesError } = await supabase
    .from("apartment_prices")
    .select("*")
    .eq("apartment_id", apartment.id)
    .order("start_date", { ascending: true });

  const galleryImages =
    images && images.length > 0
      ? images.map((image) => image.image_url)
      : apartment.image
      ? [apartment.image]
      : ["/images/hero1.avif"];

  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat("de-DE").format(new Date(dateString));
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${galleryImages[0] || "/images/hero1.avif"}')`,
        }}
      />
      <div className="fixed inset-0 bg-black/25" />

      <div className="relative z-10 px-4 pb-14 pt-4 sm:px-6 sm:pb-20">
        <header className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between rounded-full border border-white/20 bg-black/20 px-4 py-3 backdrop-blur-md sm:px-6">
            <Link
              href="/"
              className="text-sm font-semibold tracking-[0.18em] text-white sm:text-base"
            >
              NORDSEE FERIENWOHNUNGEN
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/" className="text-sm text-white/90 hover:text-white">
                Start
              </Link>
              <Link
                href="/wohnungen"
                className="text-sm text-white/90 hover:text-white"
              >
                Wohnungen
              </Link>
              <Link
                href="/anfrage"
                className="text-sm text-white/90 hover:text-white"
              >
                Anfrage
              </Link>
              <Link
                href="/kontakt"
                className="text-sm text-white/90 hover:text-white"
              >
                Kontakt
              </Link>
            </nav>
          </div>
        </header>

        <section className="mx-auto mt-10 max-w-6xl sm:mt-14 lg:mt-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/75 sm:text-sm">
              Ferienwohnung
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {apartment.name}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
              {apartment.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/anfrage"
                className="inline-flex items-center justify-center rounded-full bg-[#d8c7af] px-6 py-3 text-sm font-semibold text-[#1f1c19] transition hover:opacity-90"
              >
                Jetzt anfragen
              </Link>

              <Link
                href="/wohnungen"
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#1f1c19]"
              >
                Zurück zur Übersicht
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <ApartmentGallery
                images={galleryImages}
                name={apartment.name}
              />
            </div>

            <aside className="rounded-[2rem] bg-[#f7f3ec] p-6 text-[#1f1c19] shadow-2xl sm:p-8">
              <h2 className="text-2xl font-semibold">Wichtige Infos</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#efe6d9] p-4">
                  <p className="text-sm text-stone-500">Geeignet für</p>
                  <p className="mt-2 font-medium">{apartment.guests}</p>
                </div>

                <div className="rounded-2xl bg-[#efe6d9] p-4">
                  <p className="text-sm text-stone-500">Größe</p>
                  <p className="mt-2 font-medium">{apartment.size} m²</p>
                </div>

                <div className="rounded-2xl bg-[#efe6d9] p-4">
                  <p className="text-sm text-stone-500">Haustiere</p>
                  <p className="mt-2 font-medium">{apartment.pets}</p>
                </div>

                <div className="rounded-2xl bg-[#efe6d9] p-4">
                  <p className="text-sm text-stone-500">Endreinigung</p>
                  <p className="mt-2 font-medium">{apartment.final_cleaning}</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
                    Lage
                  </p>
                  <p className="mt-2 leading-7 text-stone-700">
                    {apartment.location}
                  </p>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                    <iframe
                      src="https://www.google.com/maps?q=Altfunnixsiel&output=embed"
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Karte von Altfunnixsiel"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
                    Kurbeitrag
                  </p>
                  <p className="mt-2 leading-7 text-stone-700">
                    {apartment.spa_tax}
                  </p>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
                    Optional zubuchbar
                  </p>
                  <p className="mt-2 leading-7 text-stone-700">
                    {apartment.optional_addons}
                  </p>
                </div>
              </div>

              <Link
                href="/anfrage"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#66735f] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Anfrage senden
              </Link>
            </aside>
          </div>

          <div className="mt-10 rounded-[2rem] bg-[#f7f3ec] p-6 text-[#1f1c19] shadow-2xl sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <h2 className="text-2xl font-semibold">Ausstattung</h2>

                {featuresError && (
                  <p className="mt-4 text-red-600">
                    Fehler beim Laden der Ausstattung: {featuresError.message}
                  </p>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {features?.map((feature) => (
                    <div
                      key={feature.id}
                      className="rounded-xl bg-white px-4 py-3 text-stone-700 shadow-sm"
                    >
                      {feature.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Preise 2026</h2>

                {pricesError && (
                  <p className="mt-4 text-red-600">
                    Fehler beim Laden der Preise: {pricesError.message}
                  </p>
                )}

                <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
                  {prices?.map((item, index) => (
                    <div
                      key={item.id}
                      className={`grid gap-2 px-5 py-4 sm:grid-cols-3 sm:px-6 ${
                        index !== prices.length - 1
                          ? "border-b border-stone-200"
                          : ""
                      }`}
                    >
                      <p className="text-stone-600">
                        {formatDate(item.start_date)}
                      </p>
                      <p className="text-stone-600">
                        bis {formatDate(item.end_date)}
                      </p>
                      <p className="font-semibold text-[#1f1c19]">
                        {formatPrice(Number(item.price_per_night))} / Nacht
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {(imagesError || apartmentError) && (
            <div className="mt-6 rounded-2xl bg-red-100 p-4 text-red-700">
              {imagesError && <p>Fehler Bilder: {imagesError.message}</p>}
              {apartmentError && <p>Fehler Wohnung: {apartmentError.message}</p>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}