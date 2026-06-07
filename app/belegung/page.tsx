import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function BelegungPage() {
  return (
    <>
      <main className="relative min-h-screen overflow-hidden text-white">
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero1.avif')" }}
        />
        <div className="fixed inset-0 bg-black/35" />

        <div className="relative z-10 pb-20">
          <Navbar transparent />

          <section className="mx-auto mt-10 max-w-6xl px-4 sm:mt-14 sm:px-6 lg:mt-20">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/75 sm:text-sm">
                Verfügbarkeit
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                Belegungsplan
              </h1>
              <p className="mt-5 text-base leading-7 text-white/85">
                Der Belegungskalender ist in Kürze verfügbar. Für aktuelle
                Verfügbarkeiten schreib uns direkt an.
              </p>
              <div className="mt-8">
                <Link
                  href="/anfrage"
                  className="inline-flex items-center justify-center rounded-full bg-[#d8c7af] px-6 py-3 text-sm font-semibold text-[#1f1c19] transition hover:opacity-90"
                >
                  Verfügbarkeit anfragen
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

    </>
  );
}

