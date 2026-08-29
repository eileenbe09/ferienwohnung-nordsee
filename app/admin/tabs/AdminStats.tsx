"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Row = { path: string; created_at: string };

const PAGE_LABELS: Record<string, string> = {
  "/": "Startseite",
  "/wohnungen": "Wohnungen",
  "/wohnungen/seerobbe": "Seerobbe",
  "/wohnungen/leuchtturm": "Leuchtturm",
  "/anfrage": "Anfrage",
  "/kontakt": "Kontakt",
};

export default function AdminStats() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("page_views")
      .select("path, created_at")
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data }) => {
        setRows(data ?? []);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

  const total = rows.length;
  const today = rows.filter((r) => r.created_at.startsWith(todayStr)).length;
  const week = rows.filter((r) => r.created_at >= weekAgo).length;

  const pageCounts: Record<string, number> = {};
  rows.forEach((r) => {
    pageCounts[r.path] = (pageCounts[r.path] ?? 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (loading) return <p className="text-sm text-stone-400">Statistiken laden…</p>;

  return (
    <div className="space-y-5">
      {/* Kennzahlen */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Besucher heute", value: today },
          { label: "Besucher diese Woche", value: week },
          { label: "Besucher gesamt", value: total },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-[#1f1c19]">{value.toLocaleString("de-DE")}</p>
            <p className="mt-1 text-xs text-stone-400 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Top-Seiten */}
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-xl text-[#1f1c19]">Einstiegsseiten</h2>
        <div className="mt-4 space-y-2">
          {topPages.map(([path, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={path}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-[#1f1c19]">{PAGE_LABELS[path] ?? path}</span>
                  <span className="text-stone-400">{count.toLocaleString("de-DE")} ({pct} %)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100">
                  <div
                    className="h-2 rounded-full bg-[#66735f] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {topPages.length === 0 && (
            <p className="text-sm text-stone-400">Noch keine Aufrufe erfasst.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-stone-400">* Jeder Besucher wird nur einmal gezählt (pro Browser-Sitzung). Admin-Besuche werden nicht erfasst.</p>
    </div>
  );
}
