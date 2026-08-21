"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import AdminBuchungen from "./tabs/AdminBuchungen";
import AdminTexte from "./tabs/AdminTexte";
import AdminPreise from "./tabs/AdminPreise";
import AdminAusstattung from "./tabs/AdminAusstattung";
import AdminBilder from "./tabs/AdminBilder";

type Booking = {
  id: string;
  apartment_slug: string;
  check_in: string;
  check_out: string;
  note: string | null;
};

type Apartment = { id: number; slug: string; name: string };

const TABS = [
  { id: "buchungen", label: "📅 Buchungen" },
  { id: "texte", label: "✏️ Texte & Infos" },
  { id: "preise", label: "💶 Preise" },
  { id: "ausstattung", label: "✓ Ausstattung" },
  { id: "bilder", label: "🖼 Bilder" },
];

const FALLBACK_APARTMENTS: Apartment[] = [
  { id: 1, slug: "seerobbe", name: "Seerobbe" },
  { id: 2, slug: "leuchtturm", name: "Leuchtturm" },
];

export default function AdminDashboard({ bookings: initial }: { bookings: Booking[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [apartments, setApartments] = useState<Apartment[]>(FALLBACK_APARTMENTS);
  const [activeApt, setActiveApt] = useState("seerobbe");
  const [activeTab, setActiveTab] = useState("buchungen");
  const [bookings, setBookings] = useState<Booking[]>(initial);

  // Wohnung hinzufügen
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    supabase
      .from("apartments")
      .select("id, slug, name")
      .order("id", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setApartments(data);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddApartment() {
    const slug = newSlug.trim().toLowerCase().replace(/\s+/g, "-");
    const name = newName.trim();
    if (!name || !slug) { setAddError("Name und Slug sind erforderlich."); return; }
    setAdding(true);
    setAddError("");
    const { data, error } = await supabase
      .from("apartments")
      .insert({ name, slug, short_description: "", guests: "Bis zu 5 Personen", size: 60 })
      .select("id, slug, name")
      .single();
    setAdding(false);
    if (error) { setAddError(error.message); return; }
    setApartments((prev) => [...prev, data]);
    setActiveApt(data.slug);
    setShowAddForm(false);
    setNewName(""); setNewSlug("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f7f3ec]">
      {/* Header */}
      <div className="bg-[#1f1c19] px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="font-serif text-xl italic text-white">Admin-Bereich</p>
            <p className="text-xs text-stone-400">Nordsee Ferienwohnungen Lojdl</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="rounded-full border border-white/20 px-4 py-2 text-xs text-stone-300 transition hover:bg-white/10">
              ← Zur Webseite
            </a>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/20 px-4 py-2 text-xs text-stone-300 transition hover:bg-white/10"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

        {/* Wohnung wählen */}
        <div className="flex flex-wrap gap-3">
          {apartments.map((apt) => (
            <button
              key={apt.slug}
              onClick={() => setActiveApt(apt.slug)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                activeApt === apt.slug
                  ? "bg-[#1f1c19] text-white shadow-md"
                  : "bg-white text-stone-600 shadow-sm hover:bg-stone-50"
              }`}
            >
              {apt.name}
            </button>
          ))}
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-full border-2 border-dashed border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-400 transition hover:border-[#66735f] hover:text-[#66735f]"
          >
            + Wohnung hinzufügen
          </button>
        </div>

        {/* Formular: neue Wohnung */}
        {showAddForm && (
          <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
            <p className="font-semibold text-[#1f1c19] mb-4">Neue Ferienwohnung anlegen</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-stone-500">Name (z.B. Seerobbe)</label>
                <input
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  placeholder="Seerobbe"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500">URL-Slug (automatisch)</label>
                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm font-mono"
                  placeholder="seerobbe"
                />
              </div>
            </div>
            {addError && <p className="mt-2 text-xs text-red-500">{addError}</p>}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAddApartment}
                disabled={adding}
                className="rounded-full bg-[#1f1c19] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#66735f] disabled:opacity-50"
              >
                {adding ? "Wird angelegt…" : "Anlegen"}
              </button>
              <button
                onClick={() => { setShowAddForm(false); setAddError(""); setNewName(""); setNewSlug(""); }}
                className="rounded-full border border-stone-200 px-6 py-2 text-sm font-semibold text-stone-500 transition hover:bg-stone-50"
              >
                Abbrechen
              </button>
            </div>
            <p className="mt-3 text-xs text-stone-400">
              Nach dem Anlegen kannst du Texte, Bilder, Ausstattung und Preise in den jeweiligen Tabs eintragen.
            </p>
          </div>
        )}

        {/* Tab-Leiste */}
        <div className="mt-4 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#1f1c19] text-white shadow-sm"
                  : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab-Inhalt */}
        <div className="mt-5">
          {activeTab === "buchungen" && (
            <AdminBuchungen bookings={bookings} setBookings={setBookings} activeApt={activeApt} />
          )}
          {activeTab === "texte" && <AdminTexte slug={activeApt} />}
          {activeTab === "preise" && <AdminPreise slug={activeApt} />}
          {activeTab === "ausstattung" && <AdminAusstattung slug={activeApt} />}
          {activeTab === "bilder" && <AdminBilder slug={activeApt} />}
        </div>
      </div>
    </div>
  );
}
