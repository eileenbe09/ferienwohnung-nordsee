"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function PasswortResetPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/admin/passwort-aendern`,
    });
    if (error) {
      setError("Fehler beim Senden der E-Mail.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1f1c19] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-2xl italic text-white">Passwort zurücksetzen</p>
          <p className="mt-1 text-sm text-stone-400">Wir schicken dir einen Link per E-Mail.</p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">✉️</div>
              <p className="text-sm text-stone-600">
                E-Mail wurde gesendet! Bitte prüfe dein Postfach und klicke auf den Link.
              </p>
              <Link href="/admin/login" className="block text-sm text-[#66735f] hover:underline">
                Zurück zum Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#1f1c19] py-3.5 text-sm font-semibold text-white transition hover:bg-[#66735f] disabled:opacity-60"
              >
                {loading ? "Senden…" : "Link senden"}
              </button>

              <Link href="/admin/login" className="block text-center text-xs text-stone-400 hover:text-stone-600 transition">
                Zurück zum Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
