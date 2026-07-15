"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-Mail oder Passwort falsch.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1f1c19] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-2xl italic text-white">Nordsee Ferienwohnungen</p>
          <p className="mt-1 text-sm text-stone-400">Admin-Bereich</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4 rounded-3xl bg-white p-8">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
              E-Mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
