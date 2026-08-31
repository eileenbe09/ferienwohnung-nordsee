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
  if (/^\d{4}-\d{2}-\d{2}$/.test(de)) return de;
  const [d, m, y] = de.split(".");
  return `${y}-${m}-${d}`;
}

function formatDateDE(str: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-");
    return `${d}.${m}.${y}`;
  }
  return str;
}

function parsePriceStr(str: string): number {
  return parseInt(str.replace(/\D/g, "")) || 0;
}

export default function AdminPreise({ slug }: { slug: string }) {
  const supabase = createClient();
  const staticApt = staticApartments.find((a) => a.slug === slug);

  const [aptId, setAptId] = useState<number | null>(null);
  const [prices, setPrices] = useState<PricePeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [priceVal, setPriceVal] = useState("");
  const [msg, setMsg] = useState("");
  const [priceBedding, setPriceBedding] = useState<number>(9);
  const [priceTowels, setPriceTowels] = useState<number>(5);
  const [priceFinalCleaning, setPriceFinalCleaning] = useState<number>(75);
  const [extraMsg, setExtraMsg] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editFrom, setEditFrom] = useState("");
  const [editTo, setEditTo] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data: apt } = await supabase.from("apartments").select("id, price_bedding, price_towels, price_final_cleaning").eq("slug", slug).single();
    if (apt) {
      setAptId(apt.id);
      setPriceBedding(apt.price_bedding ?? 9);
      setPriceTowels(apt.price_towels ?? 5);
      setPriceFinalCleaning(apt.price_final_cleaning ?? 75);
      const { data } = await supabase.from("apartment_prices").select("*").eq("apartment_id", apt.id).order("from_date");
      setPrices((data ?? []) as PricePeriod[]);
    } else {
      // Show static prices read-only
      setPrices(
        (staticApt?.prices ?? []).map((p, i) => ({
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

  function startEdit(p: PricePeriod) {
    setEditId(p.id);
    setEditFrom(deToISO(p.from_date));
    setEditTo(deToISO(p.to_date));
    setEditPrice(String(p.price_per_night));
  }

  async function handleSaveEdit() {
    if (!editId || !editFrom || !editTo || !editPrice) return;
    const { error } = await supabase.from("apartment_prices").update({
      from_date: isoToDE(editFrom),
      to_date: isoToDE(editTo),
      price_per_night: parseInt(editPrice),
    }).eq("id", editId);
    if (!error) {
      setPrices((prev) => prev.map((p) => p.id === editId
        ? { ...p, from_date: isoToDE(editFrom), to_date: isoToDE(editTo), price_per_night: parseInt(editPrice) }
        : p
      ));
      setEditId(null);
      flash("✓ Zeitraum aktualisiert.");
    } else flash("Fehler beim Speichern.");
  }

  async function handleSaveExtras() {
    if (!aptId) return;
    const { error } = await supabase.from("apartments").update({
      price_bedding: priceBedding,
      price_towels: priceTowels,
      price_final_cleaning: priceFinalCleaning,
    }).eq("id", aptId);
    setExtraMsg(error ? "Fehler beim Speichern." : "✓ Gespeichert!");
    setTimeout(() => setExtraMsg(""), 3000);
  }

  async function handleCopyPeriodToAll(period: PricePeriod) {
    if (!aptId) return;
    if (!confirm(`Zeitraum ${formatDateDE(period.from_date)} – ${formatDateDE(period.to_date)} (${period.price_per_night} €/Nacht) auf alle anderen Wohnungen übertragen?`)) return;

    const { data: allApts } = await supabase.from("apartments").select("id").neq("id", aptId);
    if (!allApts || allApts.length === 0) { flash("Keine anderen Wohnungen gefunden."); return; }

    let hasError = false;
    for (const other of allApts) {
      const { data: existing } = await supabase
        .from("apartment_prices").select("id, from_date, to_date").eq("apartment_id", other.id);
      const overlapping = (existing ?? []).filter(
        (e) => e.from_date === period.from_date && e.to_date === period.to_date
      );
      for (const ov of overlapping) {
        await supabase.from("apartment_prices").delete().eq("id", ov.id);
      }
      const { error } = await supabase.from("apartment_prices").insert({
        apartment_id: other.id,
        from_date: period.from_date,
        to_date: period.to_date,
        price_per_night: period.price_per_night,
      });
      if (error) hasError = true;
    }
    setCopyMsg(hasError ? "Fehler beim Übertragen." : "✓ Zeitraum auf alle Wohnungen übertragen!");
    setTimeout(() => setCopyMsg(""), 4000);
  }

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

        {copyMsg && <p className={`mt-3 text-sm font-medium ${copyMsg.startsWith("✓") ? "text-[#66735f]" : "text-red-500"}`}>{copyMsg}</p>}

        {loading ? (
          <p className="mt-4 text-sm text-stone-400">Laden…</p>
        ) : prices.length === 0 ? (
          <p className="mt-4 text-sm text-stone-400">Noch keine Preiszeiträume eingetragen.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {prices.map((p) => (
              <div key={p.id} className="rounded-2xl bg-[#f7f3ec] px-5 py-3.5">
                {editId === p.id ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input type="date" value={editFrom} onChange={(e) => setEditFrom(e.target.value)}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#66735f]" />
                    <span className="text-stone-400">–</span>
                    <input type="date" value={editTo} onChange={(e) => setEditTo(e.target.value)}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#66735f]" />
                    <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                      className="w-24 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#66735f]"
                      placeholder="€/Nacht" />
                    <button onClick={handleSaveEdit}
                      className="rounded-full bg-[#1f1c19] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#66735f]">
                      Speichern
                    </button>
                    <button onClick={() => setEditId(null)}
                      className="rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-400 transition hover:bg-stone-100">
                      Abbrechen
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#1f1c19]">
                        {formatDateDE(p.from_date)} – {formatDateDE(p.to_date)}
                      </p>
                      <p className="text-sm text-stone-500">{p.price_per_night} € / Nacht</p>
                    </div>
                    {!p.id.startsWith("static") && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(p)}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-500 transition hover:bg-stone-100">
                          Bearbeiten
                        </button>
                        <button onClick={() => handleCopyPeriodToAll(p)}
                          className="rounded-full border border-[#66735f]/40 px-3 py-1 text-xs text-[#66735f] transition hover:bg-[#66735f]/10"
                          title="Diesen Zeitraum auf alle Wohnungen übertragen">
                          Für alle
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-400 transition hover:bg-red-50 hover:text-red-600">
                          Löschen
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!isStatic && (
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-xl text-[#1f1c19]">Extras (Preise pro Person)</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Bettwäsche-Paket (€ / Person)</label>
              <input type="number" min="0" value={priceBedding} onChange={(e) => setPriceBedding(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Handtuch-Paket (€ / Person)</label>
              <input type="number" min="0" value={priceTowels} onChange={(e) => setPriceTowels(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Endreinigung (€ einmalig)</label>
              <input type="number" min="0" value={priceFinalCleaning} onChange={(e) => setPriceFinalCleaning(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
            </div>
          </div>
          {extraMsg && <p className={`mt-2 text-sm font-medium ${extraMsg.startsWith("✓") ? "text-[#66735f]" : "text-red-500"}`}>{extraMsg}</p>}
          <button onClick={handleSaveExtras}
            className="mt-4 rounded-full bg-[#1f1c19] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#66735f]">
            Extras speichern
          </button>
        </div>
      )}

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
