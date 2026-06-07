import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ApartmentRow = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  guests: string | null;
  size: number | null;
  coverImage: {
    image_url: string;
  }[] | null;
};

export default async function WohnungenPage() {
  const { data: apartments, error } = await supabase
    .from("apartments")
    .select(`
      id,
      name,
      slug,
      short_description,
      guests,
      size,
      coverImage:apartment_images!apartment_id (
        image_url
      )
    `)
    .eq("is_active", true)
    .eq("coverImage.is_cover", true)
    .order("name", { ascending: true });

  const typedApartments = (apartments ?? []) as ApartmentRow[];

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero1.avif')" }}
      />
      <div className="fixed inset-0 bg-black/20" />

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
                className="text-sm font-semibold text-white"
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
              Unsere Ferienwohnungen
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Zwei Rückzugsorte für entspannte Nordsee-Tage
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
              Entdecke unsere beiden familienfreundlichen Ferienwohnungen in
              ruhiger Lage in Altfunnixsiel – liebevoll eingerichtet, mit viel
              Platz für Erholung und nur wenige Kilometer vom Strand entfernt.
            </p>
          </div>

          <div className="mt-10 rounded-[2rem] bg-[#f7f3ec] p-6 shadow-2xl sm:p-8 lg:p-10">
            {error && (
              <p className="text-red-600">
                Fehler beim Laden der Wohnungen: {error.message}
              </p>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {typedApartments.map((apartment) => {
                const imageUrl =
                  apartment.coverImage?.[0]?.image_url || "/images/hero1.avif";

                return (
                  <div
                    key={apartment.id}
                    className="overflow-hidden rounded-[2rem] bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div
                      className="h-64 w-full bg-cover bg-center sm:h-72"
                      style={{ backgroundImage: `url('${imageUrl}')` }}
                    />

                    <div className="p-6 sm:p-7">
                      <h3 className="text-2xl font-semibold text-[#1f1c19]">
                        {apartment.name}
                      </h3>

                      <p className="mt-4 leading-7 text-stone-600">
                        {apartment.short_description}
                      </p>

                      <div className="mt-5 space-y-1 text-sm text-stone-700">
                        <p>{apartment.guests}</p>
                        <p>{apartment.size} m²</p>
                      </div>

                      <Link
                        href={`/wohnungen/${apartment.slug}`}
                        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#66735f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Mehr erfahren
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}