"use client";

import { useState } from "react";
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

const APARTMENTS = [
  { slug: "seerobbe", name: "Seerobbe" },
  { slug: "leuchtturm", name: "Leuchtturm" },
];

const TABS = [
  { id: "buchungen", label: "📅 Buchungen" },
  { id: "texte", label: "✏️ Texte & Infos" },
  { id: "preise", label: "💶 Preise" },
  { id: "ausstattung", label: "✓ Ausstattung" },
  { id: "bilder", label: "🖼 Bilder" },
];

export default function AdminDashboard({ bookings: initial }: { bookings: Booking[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [activeApt, setActiveApt] = useState("seerobbe");
  const [activeTab, setActiveTab] = useState("buchungen");
  const [bookings, setBookings] = useState<Booking[]>(initial);

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
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/20 px-4 py-2 text-xs text-stone-300 transition hover:bg-white/10"
          >
            Abmelden
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

        {/* Wohnung wählen */}
        <div className="flex gap-3">
          {APARTMENTS.map((apt) => (
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
        </div>

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
