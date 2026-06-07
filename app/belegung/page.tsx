import Navbar from "@/components/Navbar";
import Link from "next/link";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { apartments } from "@/data/apartments";

export default function BelegungPage() {
  return (
    <>
      {/* HEADER */}
      <div className="bg-[#1f1c19]">
        <Navbar dark />
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
          <p className="text-xs uppercase tracking-[0.4em] text-[#d8c7af]">Verfügbarkeit</p>
          <h1 className="mt-3 font-serif text-4xl italic text-white sm:text-5xl">
            Belegungskalender
          </h1>
          <p className="mt-3 max-w-lg text-stone-400">
            Hier siehst du die Preissaisons für unsere Wohnungen. Für konkrete Verfügbarkeiten schreib uns direkt an.
          </p>
        </div>
      </div>

      {/* KALENDER */}
      <section className="bg-[#f7f3ec] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          {apartments.map((apt) => (
            <div key={apt.slug}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#66735f]">
                {apt.name}
              </p>
              <AvailabilityCalendar prices={apt.prices} slug={apt.slug} />
            </div>
          ))}

          <div className="rounded-3xl bg-[#1f1c19] p-8 text-center text-white sm:p-10">
            <h2 className="font-serif text-2xl italic sm:text-3xl">
              Wunschtermin anfragen
            </h2>
            <p className="mt-2 text-stone-400">Wir prüfen die Verfügbarkeit und melden uns schnell zurück.</p>
            <Link
              href="/anfrage"
              className="mt-6 inline-flex items-center rounded-full bg-[#d8c7af] px-8 py-3.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white"
            >
              Jetzt anfragen →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
