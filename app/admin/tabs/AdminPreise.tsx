"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { apartments as staticApartments } from "@/data/apartments";

type PricePeriod = {
  id: string;
  from_date: string; // DD.MM.YYYY
  to_date: string;
  price_per_night: number;
};

function isoToDE(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function deToISO(de: string) {
  const [d, m, y] = de.split(".");
  return `${y}-${m}-${d}`;
}

function parsePriceStr(str: string): number {
  return parseInt(str.replace(/\D/g, "")) || 0;
}

export default function AdminPreise({ slug }: { slug: string }) {
  const supabase = createClient();
  const staticApt = staticApartments.find((a) => a.slug === slug)!;

  const [aptId, setAptId] = useState<number | null>(null);
  const [prices, setPrices] = useState<PricePeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [priceVal, setPriceVal] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data: apt } = await supabase.from("apartments").select("id").eq("slug", slug).single();
    if (apt) {
      setAptId(apt.id);
      const { data } = await supabase.from("apartment_prices").select("*").eq("apartment_id", apt.id).order("from_date");
      setPrices((data ?? []) as PricePeriod[]);
    } else {
      // Show static prices read-only
      setPrices(
        staticApt.prices.map((p, i) => ({
          id: `static-${i}`,
          from_date: p.from,
          to_date: p.to,
          price_per_night: parsePriceStr(p.price),
        }))
      );
    }
    setLoading(false);
  }

  async function handleAdd() {
    if (!aptId || !fromDate || !toDate || !priceVal) return;
    const { data, error } = await supabase
      .from("apartment_prices")
      .insert({ apartment_id: aptId, from_date: isoToDE(fromDate), to_date: isoToDE(toDate), price_per_night: parseInt(priceVal) })
      .select().single();
    if (!error && data) {
      setPrices((prev) => [...prev, data as PricePeriod].sort((a, b) => deToISO(a.from_date).localeCompare(deToISO(b.from_date))));
      setFromDate(""); setToDate(""); setPriceVal("");
      flash("✓ Zeitraum gespeichert.");
    } else flash("Fehler beim Speichern.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Zeitraum löschen?")) return;
    await supabase.from("apartment_prices").delete().eq("id", id);
    setPrices((prev) => prev.filter((p) => p.id !== id));
  }

  function flash(text: string) { setMsg(text); setTimeout(() => setMsg(""), 3000); }

  const isStatic = !aptId;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-[#1f1c19]">Preiszeiträume</h2>

        {!isStatic && (
          <p className="mt-1 text-sm text-stone-400">
            Klicke auf einen Zeitraum um ihn zu löschen und neu einzugeben.
          </p>
        )}

        {isStatic && (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            ⚠️ Zeigt aktuell die einprogrammierten Preise. Bitte zuerst das SQL-Setup in Supabase ausführen – dann kannst du Preise hier direkt bearbeiten.
          </div>
        )}

        {loading ? (
          <p className="mt-4 text-sm text-stone-400">Laden…</p>
        ) : prices.length === 0 ? (
          <p className="mt-4 text-sm text-stone-400">Noch keine Preiszeiträume eingetragen.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {prices.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-2xl bg-[#f7f3ec] px-5 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-[#1f1c19]">
                    {p.from_date} – {p.to_date}
                  </p>
                  <p className="text-sm text-stone-500">{p.price_per_night} € / Nacht</p>
                </div>
                {!p.id.startsWith("static") && (
                  <button onClick={() => handleDelete(p.id)}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-400 transition hover:bg-red-50 hover:text-red-600">
                    Löschen
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!isStatic && (
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-xl text-[#1f1c19]">Neuer Preiszeitraum</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Von</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Bis (exklusiv)</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Preis / Nacht (€)</label>
              <input type="number" min="1" value={priceVal} onChange={(e) => setPriceVal(e.target.value)} placeholder="z. B. 85"
                className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
            </div>
          </div>
          {msg && <p className={`mt-3 text-sm font-medium ${msg.startsWith("✓") ? "text-[#66735f]" : "text-red-500"}`}>{msg}</p>}
          <button onClick={handleAdd} disabled={!fromDate || !toDate || !priceVal}
            className="mt-4 rounded-full bg-[#1f1c19] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#66735f] disabled:opacity-40">
            Zeitraum hinzufügen
          </button>
        </div>
      )}
    </div>
  );
}
