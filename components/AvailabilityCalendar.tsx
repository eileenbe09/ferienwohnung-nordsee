"use client";

import { useState } from "react";
import Link from "next/link";

type PricePeriod = {
  from: string; // "DD.MM.YYYY"
  to: string;
  price: string;
};

type Props = { prices: PricePeriod[]; slug: string };

function parseDE(str: string): Date {
  const [d, m, y] = str.split(".").map(Number);
  return new Date(y, m - 1, d);
}

const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const DAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// Farbskala nach Preis: günstig=grün, teuer=orange
const SEASON_COLORS = [
  "bg-[#c8ddc0] text-[#2d4a24]",   // niedrig
  "bg-[#f5e0b0] text-[#7a5200]",   // mittel
  "bg-[#f5c0a0] text-[#7a2800]",   // hoch
];

export default function AvailabilityCalendar({ prices, slug }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // Alle Perioden vorverarbeiten
  const periods = prices.map((p) => ({
    from: parseDE(p.from),
    to: parseDE(p.to),
    price: p.price,
  }));

  // Eindeutige Preise sortieren für Legende
  const uniquePrices = [...new Set(prices.map((p) => p.price))].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ""));
    const numB = parseInt(b.replace(/\D/g, ""));
    return numA - numB;
  });

  function getPeriodIndex(date: Date): number {
    for (let i = 0; i < periods.length; i++) {
      if (date >= periods[i].from && date < periods[i].to) {
        const priceIdx = uniquePrices.indexOf(periods[i].price);
        return Math.min(priceIdx, SEASON_COLORS.length - 1);
      }
    }
    return -1; // außerhalb
  }

  function getDaysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
  }

  function getFirstWeekday(y: number, m: number) {
    // 0=So → wir wollen Mo=0
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-[#1f1c19]">Belegungskalender</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-100"
          >
            ‹
          </button>
          <span className="min-w-[140px] text-center text-sm font-medium text-[#1f1c19]">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-100"
          >
            ›
          </button>
        </div>
      </div>

      {/* Wochentage */}
      <div className="mt-5 grid grid-cols-7 gap-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-semibold uppercase tracking-wide text-stone-400">
            {d}
          </div>
        ))}

        {/* Leer-Zellen vor dem 1. */}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Tage */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const periodIdx = getPeriodIndex(date);
          const isToday = date.toDateString() === today.toDateString();

          let dayPrice: string | null = null;
          for (let p = 0; p < periods.length; p++) {
            if (date >= periods[p].from && date < periods[p].to) {
              const match = periods[p].price.match(/(\d+)/);
              dayPrice = match ? `${match[1]} €` : null;
              break;
            }
          }

          return (
            <div
              key={day}
              className={`relative flex flex-col items-center justify-center rounded-lg py-1.5 transition
                ${periodIdx >= 0 ? SEASON_COLORS[periodIdx] : "text-stone-300"}
                ${isToday ? "ring-2 ring-[#66735f] ring-offset-1" : ""}
              `}
            >
              <span className="text-sm font-semibold leading-none">{day}</span>
              {dayPrice && (
                <span className="mt-0.5 text-[9px] leading-none opacity-70">{dayPrice}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legende */}
      {uniquePrices.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-stone-100 pt-4">
          {uniquePrices.map((price, i) => (
            <div key={price} className="flex items-center gap-1.5">
              <div className={`h-3 w-3 rounded-sm ${SEASON_COLORS[Math.min(i, SEASON_COLORS.length - 1)].split(" ")[0]}`} />
              <span className="text-xs text-stone-500">{price}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-stone-100" />
            <span className="text-xs text-stone-400">Außerhalb Saison</span>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-stone-400">
        Der Kalender zeigt Preissaisons. Für aktuelle Verfügbarkeiten bitte anfragen.
      </p>

      <Link
        href={`/anfrage?wohnung=${slug}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#66735f] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Verfügbarkeit anfragen
      </Link>
    </div>
  );
}
