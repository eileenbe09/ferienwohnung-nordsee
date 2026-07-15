"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Booking = {
  id: string;
  apartment_slug: string;
  check_in: string;
  check_out: string;
  note: string | null;
};

type Props = {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  activeApt: string;
};

const MONTH_NAMES = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const DAY_NAMES = ["Mo","Di","Mi","Do","Fr","Sa","So"];

export default function AdminBuchungen({ bookings, setBookings, activeApt }: Props) {
  const supabase = createClient();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selecting, setSelecting] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
  function getFirstWeekday(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
  function toISO(y: number, m: number, d: number) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

  function bookingForDay(dateStr: string) {
    return bookings.find((b) => b.apartment_slug === activeApt && b.check_in <= dateStr && b.check_out > dateStr);
  }

  async function handleDayClick(dateStr: string) {
    const existing = bookingForDay(dateStr);
    if (existing) {
      if (!confirm("Buchung löschen?")) return;
      setLoading(true);
      await supabase.from("bookings").delete().eq("id", existing.id);
      setBookings((prev) => prev.filter((b) => b.id !== existing.id));
      setLoading(false);
      setMsg("Buchung gelöscht.");
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    if (!selecting) {
      setSelecting(dateStr);
      setMsg(`Anreise: ${dateStr} — jetzt Abreisetag klicken`);
    } else {
      const checkIn = selecting < dateStr ? selecting : dateStr;
      const checkOut = selecting < dateStr ? dateStr : selecting;
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .insert({ apartment_slug: activeApt, check_in: checkIn, check_out: checkOut, note: note || null })
        .select().single();
      if (!error && data) {
        setBookings((prev) => [...prev, data]);
        setMsg(`✓ ${checkIn} – ${checkOut} gespeichert`);
      } else { setMsg("Fehler beim Speichern."); }
      setSelecting(null); setNote(""); setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  }

  function prevMonth() { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
        <p className="text-sm font-semibold text-[#1f1c19]">So funktioniert es:</p>
        <p className="mt-1 text-sm text-stone-500">
          1. <strong>Anreisetag</strong> klicken → 2. <strong>Abreisetag</strong> klicken → gespeichert.<br />
          Auf gebuchten Tag klicken → Buchung löschen.
        </p>
        {selecting && <p className="mt-2 text-sm font-medium text-[#66735f]">Anreise: <strong>{selecting}</strong> — jetzt Abreisetag klicken</p>}
      </div>

      {selecting && (
        <input type="text" placeholder="Notiz (optional, z. B. Gästename)" value={note} onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
      )}
      {msg && <div className="rounded-xl bg-[#66735f]/10 px-4 py-3 text-sm text-[#66735f] font-medium">{msg}</div>}

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#1f1c19]">Belegungskalender</h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-100">‹</button>
            <span className="min-w-[140px] text-center text-sm font-medium">{MONTH_NAMES[month]} {year}</span>
            <button onClick={nextMonth} className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-100">›</button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-1.5">
          {DAY_NAMES.map((d) => <div key={d} className="py-1 text-center text-xs font-semibold uppercase tracking-wide text-stone-400">{d}</div>)}
          {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = toISO(year, month, day);
            const booking = bookingForDay(dateStr);
            const isToday = dateStr === todayStr;
            const isSelected = selecting === dateStr;
            const isPast = dateStr < todayStr;
            return (
              <button key={day} onClick={() => !isPast && handleDayClick(dateStr)} disabled={loading}
                className={`relative flex h-12 flex-col items-center justify-center rounded-xl text-sm transition
                  ${isPast ? "opacity-30 cursor-default" : "cursor-pointer hover:scale-105"}
                  ${booking ? "bg-red-500 text-white font-semibold" : "bg-[#f7f3ec] text-stone-700 hover:bg-[#66735f]/10"}
                  ${isSelected ? "ring-2 ring-[#66735f] ring-offset-1 bg-[#66735f]/20" : ""}
                  ${isToday ? "ring-2 ring-[#d8c7af] ring-offset-1" : ""}`}>
                <span>{day}</span>
                {booking?.note && <span className="text-[8px] leading-none opacity-80 truncate max-w-[90%]">{booking.note}</span>}
                {booking && !booking.note && <span className="text-[8px] leading-none opacity-80">Belegt</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-xl text-[#1f1c19]">Buchungsliste</h2>
        {bookings.filter(b => b.apartment_slug === activeApt).length === 0 ? (
          <p className="mt-4 text-sm text-stone-400">Noch keine Buchungen eingetragen.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {bookings.filter(b => b.apartment_slug === activeApt).sort((a, b) => a.check_in.localeCompare(b.check_in)).map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-2xl bg-[#f7f3ec] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[#1f1c19]">{new Date(b.check_in).toLocaleDateString("de-DE")} – {new Date(b.check_out).toLocaleDateString("de-DE")}</p>
                  {b.note && <p className="text-xs text-stone-400">{b.note}</p>}
                </div>
                <button onClick={async () => { if (!confirm("Löschen?")) return; await supabase.from("bookings").delete().eq("id", b.id); setBookings(prev => prev.filter(x => x.id !== b.id)); }}
                  className="text-xs text-red-400 hover:text-red-600 transition">Löschen</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
