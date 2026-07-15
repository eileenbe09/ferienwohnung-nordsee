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
  const [seeding, setSeeding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [msg, setMsg] = useState("");

  const hasDBFeatures = features.some((f) => !f.id.startsWith("static"));

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data: apt } = await supabase.from("apartments").select("id").eq("slug", slug).single();
    if (apt) {
      setAptId(apt.id);
      const { data } = await supabase
        .from("apartment_features")
        .select("*")
        .eq("apartment_id", apt.id)
        .order("sort_order");
      if (data && data.length > 0) {
        setFeatures(data as Feature[]);
      } else {
        setFeatures(staticApt.features.map((label, i) => ({ id: `static-${i}`, label, sort_order: i })));
      }
    } else {
      setFeatures(staticApt.features.map((label, i) => ({ id: `static-${i}`, label, sort_order: i })));
    }
    setLoading(false);
  }

  async function handleSeed() {
    if (!aptId) return;
    setSeeding(true);
    const rows = staticApt.features.map((label, i) => ({ apartment_id: aptId, label, sort_order: i }));
    const { data, error } = await supabase.from("apartment_features").insert(rows).select();
    if (!error && data) {
      setFeatures(data as Feature[]);
      flash("✓ Merkmale übertragen – du kannst sie jetzt bearbeiten.");
    } else flash("Fehler beim Übertragen.");
    setSeeding(false);
  }

  async function handleAdd() {
    if (!aptId || !newLabel.trim()) return;
    const nextOrder = features.filter((f) => !f.id.startsWith("static")).length;
    const { data, error } = await supabase
      .from("apartment_features")
      .insert({ apartment_id: aptId, label: newLabel.trim(), sort_order: nextOrder })
      .select().single();
    if (!error && data) {
      setFeatures((prev) => [...prev.filter((f) => !f.id.startsWith("static")), data as Feature]);
      setNewLabel("");
      flash("✓ Merkmal hinzugefügt.");
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("apartment_features").delete().eq("id", id);
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleSaveEdit(id: string) {
    await supabase.from("apartment_features").update({ label: editLabel }).eq("id", id);
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, label: editLabel } : f)));
    setEditingId(null);
    flash("✓ Gespeichert.");
  }

  function flash(text: string) { setMsg(text); setTimeout(() => setMsg(""), 3000); }

  const isStatic = !aptId;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#1f1c19]">Ausstattung</h2>
          <p className="mt-1 text-sm text-stone-400">Klicke auf ein Merkmal um es zu bearbeiten.</p>
        </div>
        {aptId && !hasDBFeatures && (
          <button onClick={handleSeed} disabled={seeding}
            className="shrink-0 rounded-full bg-[#66735f] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
            {seeding ? "Übertragen…" : "Jetzt einrichten →"}
          </button>
        )}
      </div>

      {isStatic && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          ⚠️ Bitte zuerst das SQL-Setup in Supabase ausführen – dann erscheint hier ein „Jetzt einrichten"-Button.
        </div>
      )}

      {aptId && !hasDBFeatures && (
        <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
          Klicke auf „Jetzt einrichten" um die aktuellen Merkmale in Supabase zu übertragen und sie danach bearbeitbar zu machen.
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-stone-400">Laden…</p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.id}>
              {editingId === f.id ? (
                <div className="flex gap-1">
                  <input
                    autoFocus
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(f.id); if (e.key === "Escape") setEditingId(null); }}
                    className="flex-1 rounded-xl border border-[#66735f] bg-white px-3 py-2 text-sm outline-none"
                  />
                  <button onClick={() => handleSaveEdit(f.id)}
                    className="rounded-xl bg-[#66735f] px-2 text-xs font-bold text-white">✓</button>
                  <button onClick={() => setEditingId(null)}
                    className="rounded-xl border border-stone-200 px-2 text-xs text-stone-400">✕</button>
                </div>
              ) : (
                <div className={`group flex items-center justify-between rounded-xl border px-4 py-2.5 transition
                  ${!f.id.startsWith("static") ? "border-stone-100 bg-[#f7f3ec] hover:border-[#66735f]/40 cursor-pointer" : "border-stone-100 bg-[#f7f3ec] opacity-70"}`}
                  onClick={() => {
                    if (f.id.startsWith("static")) return;
                    setEditingId(f.id);
                    setEditLabel(f.label);
                  }}
                >
                  <span className="text-sm text-stone-700">{f.label}</span>
                  {!f.id.startsWith("static") && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }}
                      className="ml-2 shrink-0 text-xs text-stone-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                    >✕</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {hasDBFeatures && (
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
