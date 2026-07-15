"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type PricePeriod = {
  from: string; // "DD.MM.YYYY"
  to: string;
  price: string; // "75,00 € / Nacht"
};

type Props = {
  slug: string;
  prices: PricePeriod[];
  finalCleaning?: string; // "75,00 € einmalig"
};

function parseDE(str: string): Date {
  const [d, m, y] = str.split(".").map(Number);
  return new Date(y, m - 1, d);
}

function parsePriceNum(str: string): number {
  const match = str.replace(",", ".").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function formatEUR(n: number) {
  return n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

function getPriceForDate(date: Date, periods: PricePeriod[]): number {
  for (const p of periods) {
    const from = parseDE(p.from);
    const to = parseDE(p.to);
    if (date >= from && date < to) return parsePriceNum(p.price);
  }
  return 0;
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

const PERSON_OPTIONS = [1, 2, 3, 4, 5];

export default function PriceCalculator({ slug, prices, finalCleaning }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState(2);
  const [wantsBettwaesche, setWantsBettwaesche] = useState(false);
  const [wantsHandtuch, setWantsHandtuch] = useState(false);

  const cleaning = parsePriceNum(finalCleaning ?? "75");
  const extraPerNight = persons >= 5 ? 10 : 0;

  const calc = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const from = new Date(checkIn);
    const to = new Date(checkOut);
    const nights = daysBetween(from, to);
    if (nights <= 0) return null;

    let baseTotal = 0;
    const breakdown: { label: string; nights: number; price: number }[] = [];

    // Nächte aufschlüsseln nach Saison
    const current = new Date(from);
    const periodGroups: Record<string, { nights: number; pricePerNight: number }> = {};
    for (let i = 0; i < nights; i++) {
      const ppn = getPriceForDate(current, prices);
      const key = ppn.toString();
      if (!periodGroups[key]) periodGroups[key] = { nights: 0, pricePerNight: ppn };
      periodGroups[key].nights++;
      baseTotal += ppn;
      current.setDate(current.getDate() + 1);
    }

    Object.entries(periodGroups).forEach(([, v]) => {
      if (v.pricePerNight > 0) {
        breakdown.push({ label: `${formatEUR(v.pricePerNight)} / Nacht`, nights: v.nights, price: v.nights * v.pricePerNight });
      }
    });

    const extraTotal = extraPerNight * nights;
    const bettwaescheTotal = wantsBettwaesche ? 9 * persons : 0;
    const handtuchTotal = wantsHandtuch ? 5 * persons : 0;
    const total = baseTotal + extraTotal + cleaning + bettwaescheTotal + handtuchTotal;

    return { nights, breakdown, baseTotal, extraTotal, bettwaescheTotal, handtuchTotal, total };
  }, [checkIn, checkOut, persons, wantsBettwaesche, wantsHandtuch, prices, cleaning, extraPerNight]);

  function handleAnfrage() {
    const params = new URLSearchParams({
      wohnung: slug,
      anreise: checkIn,
      abreise: checkOut,
      personen: persons.toString(),
      bettwaesche: wantsBettwaesche ? "ja" : "nein",
      handtuch: wantsHandtuch ? "ja" : "nein",
      preis: calc ? formatEUR(calc.total) : "",
    });
    router.push(`/anfrage?${params.toString()}`);
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-serif text-2xl text-[#1f1c19]">Preis berechnen</h2>
      <p className="mt-1 text-sm text-stone-400">Wähle deinen Zeitraum und wir zeigen dir den Gesamtpreis.</p>

      {/* Datum */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Anreise</label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(""); }}
            className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Abreise</label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition"
          />
        </div>
      </div>

      {/* Personen */}
      <div className="mt-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
          Personen (max. 5)
        </label>
        <div className="flex gap-2">
          {PERSON_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPersons(n)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
                persons === n
                  ? "bg-[#1f1c19] text-white"
                  : "bg-[#f7f3ec] text-stone-600 hover:bg-stone-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {persons >= 5 && (
          <p className="mt-1.5 text-xs text-[#66735f]">+ 10,00 € / Nacht für die 5. Person</p>
        )}
      </div>

      {/* Extras */}
      <div className="mt-4 space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500">Extras (optional)</label>
        <button
          type="button"
          onClick={() => setWantsBettwaesche(!wantsBettwaesche)}
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
            wantsBettwaesche
              ? "border-[#66735f] bg-[#66735f]/5 text-[#1f1c19]"
              : "border-stone-200 bg-[#f7f3ec] text-stone-600 hover:border-stone-300"
          }`}
        >
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs transition ${
            wantsBettwaesche ? "border-[#66735f] bg-[#66735f] text-white" : "border-stone-300"
          }`}>
            {wantsBettwaesche ? "✓" : ""}
          </span>
          <span className="flex-1">Bettwäsche-Paket</span>
          <span className="font-semibold text-[#1f1c19]">9,00 € / Person</span>
        </button>
        <button
          type="button"
          onClick={() => setWantsHandtuch(!wantsHandtuch)}
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
            wantsHandtuch
              ? "border-[#66735f] bg-[#66735f]/5 text-[#1f1c19]"
              : "border-stone-200 bg-[#f7f3ec] text-stone-600 hover:border-stone-300"
          }`}
        >
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs transition ${
            wantsHandtuch ? "border-[#66735f] bg-[#66735f] text-white" : "border-stone-300"
          }`}>
            {wantsHandtuch ? "✓" : ""}
          </span>
          <span className="flex-1">Handtuch-Paket</span>
          <span className="font-semibold text-[#1f1c19]">5,00 € / Person</span>
        </button>
      </div>

      {/* Preisaufstellung */}
      {calc ? (
        <div className="mt-5 rounded-2xl bg-[#f7f3ec] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Preisaufstellung</p>
          <div className="mt-3 space-y-1.5">
            {calc.breakdown.map((b) => (
              <div key={b.label} className="flex justify-between text-sm text-stone-600">
                <span>{b.nights} Nacht{b.nights !== 1 ? "e" : ""} × {b.label}</span>
                <span>{formatEUR(b.price)}</span>
              </div>
            ))}
            {calc.extraTotal > 0 && (
              <div className="flex justify-between text-sm text-stone-600">
                <span>{calc.nights} Nacht{calc.nights !== 1 ? "e" : ""} × 10,00 € (5. Person)</span>
                <span>{formatEUR(calc.extraTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-stone-600">
              <span>Endreinigung</span>
              <span>{formatEUR(cleaning)}</span>
            </div>
            {calc.bettwaescheTotal > 0 && (
              <div className="flex justify-between text-sm text-stone-600">
                <span>Bettwäsche ({persons} × 9,00 €)</span>
                <span>{formatEUR(calc.bettwaescheTotal)}</span>
              </div>
            )}
            {calc.handtuchTotal > 0 && (
              <div className="flex justify-between text-sm text-stone-600">
                <span>Handtücher ({persons} × 5,00 €)</span>
                <span>{formatEUR(calc.handtuchTotal)}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-between border-t border-stone-200 pt-3">
            <span className="font-bold text-[#1f1c19]">Gesamt</span>
            <span className="text-lg font-bold text-[#1f1c19]">{formatEUR(calc.total)}</span>
          </div>

          <p className="mt-2 text-xs text-stone-400">
            * Kurtaxe nicht enthalten: Erwachsene 2,50 € / Nacht, Kinder 4–15 J. 1,25 € / Nacht
          </p>
        </div>
      ) : (
        checkIn && checkOut && (
          <p className="mt-4 text-sm text-red-500">Bitte ein gültiges Datum wählen (Abreise nach Anreise).</p>
        )
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={handleAnfrage}
        disabled={!calc}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#1f1c19] py-3.5 text-sm font-semibold text-white transition hover:bg-[#66735f] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {calc ? `Anfrage stellen – ${formatEUR(calc.total)}` : "Anreise & Abreise wählen"}
      </button>
    </div>
  );
}
