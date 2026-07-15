"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { apartments as staticApartments } from "@/data/apartments";

type Feature = { id: string; label: string; sort_order: number };

export default function AdminAusstattung({ slug }: { slug: string }) {
  const supabase = createClient();
  const staticApt = staticApartments.find((a) => a.slug === slug)!;

  const [aptId, setAptId] = useState<number | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data: apt } = await supabase.from("apartments").select("id").eq("slug", slug).single();
    if (apt) {
      setAptId(apt.id);
      const { data } = await supabase.from("apartment_features").select("*").eq("apartment_id", apt.id).order("sort_order");
      setFeatures((data ?? []) as Feature[]);
    } else {
      setFeatures(staticApt.features.map((label, i) => ({ id: `static-${i}`, label, sort_order: i })));
    }
    setLoading(false);
  }

  async function handleAdd() {
    if (!aptId || !newLabel.trim()) return;
    const nextOrder = features.length;
    const { data, error } = await supabase
      .from("apartment_features")
      .insert({ apartment_id: aptId, label: newLabel.trim(), sort_order: nextOrder })
      .select().single();
    if (!error && data) {
      setFeatures((prev) => [...prev, data as Feature]);
      setNewLabel("");
      flash("✓ Merkmal hinzugefügt.");
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("apartment_features").delete().eq("id", id);
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  }

  function flash(text: string) { setMsg(text); setTimeout(() => setMsg(""), 2000); }

  const isStatic = !aptId;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-serif text-2xl text-[#1f1c19]">Ausstattung</h2>

      {isStatic && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          ⚠️ Zeigt aktuell die einprogrammierten Ausstattungsmerkmale. Bitte zuerst das SQL-Setup ausführen.
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-stone-400">Laden…</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.id} className="group flex items-center justify-between rounded-xl border border-stone-100 bg-[#f7f3ec] px-4 py-2.5">
              <span className="text-sm text-stone-700">{f.label}</span>
              {!f.id.startsWith("static") && (
                <button onClick={() => handleDelete(f.id)}
                  className="ml-2 shrink-0 text-xs text-stone-300 transition hover:text-red-500 opacity-0 group-hover:opacity-100">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!isStatic && (
        <div className="mt-5 flex gap-3">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Neues Merkmal eingeben…"
            className="flex-1 rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition"
          />
          <button onClick={handleAdd} disabled={!newLabel.trim()}
            className="rounded-xl bg-[#1f1c19] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#66735f] disabled:opacity-40">
            + Hinzufügen
          </button>
        </div>
      )}

      {msg && <p className="mt-3 text-sm font-medium text-[#66735f]">{msg}</p>}
    </div>
  );
}
