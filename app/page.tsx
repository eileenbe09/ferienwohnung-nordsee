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

export default async function Home() {
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
        image_url,
        is_cover
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
        style={{ backgroundImage: "url('/images/hero.avif')" }}
      />
      <div className="fixed inset-0 bg-black/20" />

      <div className="relative z-10">
        <header className="px-4 pt-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/20 bg-black/20 px-4 py-3 backdrop-blur-md sm:px-6">
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

        <section className="px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:pt-20">
          <div className="mx-auto grid max-w-6xl items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.38em] text-white/80 sm:text-sm">
                Nordsee · Ruhe · Stil
              </p>

              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
                Ferienwohnungen mit ruhigem Küstencharme
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
                Zwei liebevoll eingerichtete Ferienwohnungen in Altfunnixsiel –
                familienfreundlich, ruhig gelegen und nur etwa 5 km vom Strand in
                Harlesiel und Carolinensiel entfernt.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/wohnungen"
                  className="inline-flex items-center justify-center rounded-full bg-[#d8c7af] px-6 py-3 text-sm font-semibold text-[#1f1c19] transition hover:opacity-90"
                >
                  Wohnungen ansehen
                </Link>

                <Link
                  href="/anfrage"
                  className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#1f1c19]"
                >
                  Direkt anfragen
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/88 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                Auf einen Blick
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f7f3ec] p-4">
                  <p className="text-sm text-stone-500">Lage</p>
                  <p className="mt-2 font-medium text-[#1f1c19]">Altfunnixsiel</p>
                </div>

                <div className="rounded-2xl bg-[#f7f3ec] p-4">
                  <p className="text-sm text-stone-500">Entfernung Strand</p>
                  <p className="mt-2 font-medium text-[#1f1c19]">ca. 5 km</p>
                </div>

                <div className="rounded-2xl bg-[#f7f3ec] p-4">
                  <p className="text-sm text-stone-500">Wohnungen</p>
                  <p className="mt-2 font-medium text-[#1f1c19]">
                    Seerobbe &amp; Leuchtturm
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f7f3ec] p-4">
                  <p className="text-sm text-stone-500">Ideal für</p>
                  <p className="mt-2 font-medium text-[#1f1c19]">
                    Familien mit Kindern
                  </p>
                </div>
              </div>

              <Link
                href="/wohnungen"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#66735f] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Zu den Wohnungen
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-10 sm:px-6 sm:pb-14">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#f7f3ec] p-6 shadow-2xl sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                Unsere Wohnungen
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#1f1c19] sm:text-4xl">
                Zwei Rückzugsorte an der Nordsee
              </h2>
              <p className="mt-4 leading-7 text-stone-600">
                Ruhige Lage am Feldrand, kinderfreundliche Ausstattung, zwei
                Schlafzimmer und viel Platz zum Entspannen.
              </p>
            </div>

            {error && (
              <p className="mt-6 text-red-600">
                Fehler beim Laden der Wohnungen: {error.message}
              </p>
            )}

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
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

        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/20 bg-black/25 p-6 text-white backdrop-blur-md sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Nordseegefühl
                </p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                  Natürlich, ruhig und hochwertig
                </h2>
                <p className="mt-4 max-w-3xl leading-7 text-white/85">
                  Ein warmes, zurückhaltendes Design mit Sandtönen, gedeckten
                  Farben und klaren Formen – inspiriert vom gehobenen Sansibar-Stil.
                </p>
              </div>

              <Link
                href="/anfrage"
                className="inline-flex items-center justify-center rounded-full bg-[#d8c7af] px-6 py-3 text-sm font-semibold text-[#1f1c19] transition hover:opacity-90"
              >
                Jetzt Urlaub anfragen
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}