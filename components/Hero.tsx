import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.avif')" }}
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl items-center px-6">
        <div className="max-w-3xl text-white">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-stone-200">
            Nordsee · Ruhe · Stil
          </p>

          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Stilvolle Ferienwohnungen an der Nordsee
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100">
            Ankommen, durchatmen und die Küste genießen – mit hochwertigem
            Ambiente, natürlichem Design und echter Urlaubsatmosphäre.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/wohnungen"
              className="rounded-full bg-[#d8cbb8] px-6 py-3 text-sm font-medium text-[#1f1f1c] transition hover:opacity-90"
            >
              Wohnungen entdecken
            </Link>

            <Link
              href="/anfrage"
              className="rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-[#1f1f1c]"
            >
              Anfrage senden
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}