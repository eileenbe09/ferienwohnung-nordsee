"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { apartments as staticApartments } from "@/data/apartments";

type AptData = {
  id?: number;
  name: string;
  short_description: string;
  description: string;
  guests: string;
  size: number;
  pets: string;
  final_cleaning: string;
  location: string;
  spa_tax: string;
};

export default function AdminTexte({ slug }: { slug: string }) {
  const supabase = createClient();
  const staticApt = staticApartments.find((a) => a.slug === slug)!;

  const [data, setData] = useState<AptData>({
    name: staticApt.name,
    short_description: staticApt.shortDescription,
    description: staticApt.description,
    guests: staticApt.guests,
    size: staticApt.size,
    pets: staticApt.pets,
    final_cleaning: staticApt.finalCleaning,
    location: staticApt.location,
    spa_tax: staticApt.spaTax,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [isInDB, setIsInDB] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: apt } = await supabase.from("apartments").select("*").eq("slug", slug).single();
      if (apt) {
        setIsInDB(true);
        setData({
          id: apt.id,
          name: apt.name ?? staticApt.name,
          short_description: apt.short_description ?? staticApt.shortDescription,
          description: apt.description ?? staticApt.description,
          guests: apt.guests ?? staticApt.guests,
          size: apt.size ?? staticApt.size,
          pets: apt.pets ?? staticApt.pets,
          final_cleaning: apt.final_cleaning ?? staticApt.finalCleaning,
          location: apt.location ?? staticApt.location,
          spa_tax: apt.spa_tax ?? staticApt.spaTax,
        });
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  async function handleSave() {
    if (!isInDB) {
      setMsg("⚠️ Bitte zuerst das SQL-Setup in Supabase ausführen.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("apartments").update({
      name: data.name,
      short_description: data.short_description,
      description: data.description,
      guests: data.guests,
      size: data.size,
      pets: data.pets,
      final_cleaning: data.final_cleaning,
      location: data.location,
      spa_tax: data.spa_tax,
    }).eq("slug", slug);
    setSaving(false);
    setMsg(error ? "Fehler beim Speichern." : "✓ Gespeichert!");
    setTimeout(() => setMsg(""), 3000);
  }

  function field(label: string, key: keyof AptData, type: "text" | "textarea" | "number" = "text") {
    return (
      <div key={key}>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</label>
        {type === "textarea" ? (
          <textarea
            rows={4}
            value={data[key] as string}
            onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
            className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition resize-none"
          />
        ) : (
          <input
            type={type}
            value={data[key] as string | number}
            onChange={(e) => setData((d) => ({ ...d, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
            className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition"
          />
        )}
      </div>
    );
  }

  if (loading) return <div className="rounded-3xl bg-white p-8 shadow-sm text-sm text-stone-400">Laden…</div>;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-serif text-2xl text-[#1f1c19]">Texte & Infos bearbeiten</h2>
      {!isInDB && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          ⚠️ Wohnung noch nicht in Supabase. Bitte zuerst das SQL-Setup ausführen – dann kannst du hier Texte speichern.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {field("Name der Wohnung", "name")}
        {field("Kurzbeschreibung (Übersichtsseite)", "short_description")}
        {field("Ausführliche Beschreibung", "description", "textarea")}
        {field("Gäste", "guests")}
        {field("Größe (m²)", "size", "number")}
        {field("Haustiere", "pets")}
        {field("Endreinigung (z. B. 75,00 € einmalig)", "final_cleaning")}
        {field("Lage / Adresse", "location")}
        {field("Kurtaxe-Hinweis", "spa_tax")}
      </div>

      {msg && (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${msg.startsWith("✓") ? "bg-[#66735f]/10 text-[#66735f]" : "bg-red-50 text-red-600"}`}>
          {msg}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !isInDB}
        className="mt-5 rounded-full bg-[#1f1c19] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#66735f] disabled:opacity-40"
      >
        {saving ? "Speichern…" : "Speichern"}
      </button>
    </div>
  );
}
