"use client";

import { useEffect, useRef } from "react";

type Props = {
  wohnung?: string;
  anreise?: string;
  abreise?: string;
  personen?: string;
  bettwaesche?: string;
  handtuch?: string;
  preis?: string;
};

const WOHNUNG_MAP: Record<string, string> = {
  seerobbe: "Seerobbe",
  leuchtturm: "Leuchtturm",
};

export default function AnfrageForm({ wohnung, anreise, abreise, personen, bettwaesche, handtuch, preis }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const wohnungLabel = wohnung ? (WOHNUNG_MAP[wohnung.toLowerCase()] ?? wohnung) : "";

  const hasPrefill = !!(anreise || abreise || personen || preis);

  // Build a summary of extras
  const extraParts: string[] = [];
  if (bettwaesche === "ja") extraParts.push("Bettwäsche-Paket");
  if (handtuch === "ja") extraParts.push("Handtuch-Paket");
  const extrasStr = extraParts.length > 0 ? extraParts.join(", ") : "Keine";

  const nachrichtDefault = hasPrefill
    ? [
        preis ? `Berechneter Gesamtpreis: ${preis}` : "",
        `Extras: ${extrasStr}`,
        "",
        "Weitere Wünsche oder Fragen:",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-serif text-2xl text-[#1f1c19]">Deine Anfrage</h2>
      <p className="mt-1 text-sm text-stone-400">Felder mit * sind Pflichtfelder.</p>

      {/* Vorausgefüllte Buchungsdetails Banner */}
      {hasPrefill && (
        <div className="mt-4 rounded-2xl bg-[#66735f]/10 border border-[#66735f]/20 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#66735f]">Buchungsdetails aus dem Preisrechner</p>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-stone-600">
            {wohnungLabel && <div><span className="text-stone-400">Wohnung:</span> {wohnungLabel === "Seerobbe" ? "Ferienwohnung Seerobbe" : "Ferienwohnung Leuchtturm"}</div>}
            {anreise && <div><span className="text-stone-400">Anreise:</span> {new Date(anreise).toLocaleDateString("de-DE")}</div>}
            {abreise && <div><span className="text-stone-400">Abreise:</span> {new Date(abreise).toLocaleDateString("de-DE")}</div>}
            {personen && <div><span className="text-stone-400">Personen:</span> {personen}</div>}
            {extraParts.length > 0 && <div className="col-span-2"><span className="text-stone-400">Extras:</span> {extrasStr}</div>}
            {preis && <div className="col-span-2 mt-1 font-semibold text-[#1f1c19]">Gesamtpreis: {preis}</div>}
          </div>
          <p className="mt-2 text-xs text-stone-400">* Kurtaxe nicht enthalten</p>
        </div>
      )}

      <form
        action="https://formspree.io/f/placeholder"
        method="POST"
        ref={formRef}
        className="mt-6 space-y-4"
      >
        {/* Versteckte Felder mit Buchungsdetails */}
        {wohnung && <input type="hidden" name="wohnung_slug" value={wohnung} />}
        {preis && <input type="hidden" name="berechneter_preis" value={preis} />}
        {bettwaesche && <input type="hidden" name="bettwaesche_paket" value={bettwaesche} />}
        {handtuch && <input type="hidden" name="handtuch_paket" value={handtuch} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Vorname *</label>
            <input name="vorname" required type="text"
              className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Nachname *</label>
            <input name="nachname" required type="text"
              className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">E-Mail *</label>
            <input name="email" required type="email"
              className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Telefon</label>
            <input name="telefon" type="tel"
              className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Gewünschte Wohnung</label>
          <select name="wohnung" defaultValue={wohnungLabel}
            className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition">
            <option value="">Bitte wählen</option>
            <option value="Seerobbe">Ferienwohnung Seerobbe</option>
            <option value="Leuchtturm">Ferienwohnung Leuchtturm</option>
            <option value="Beide">Beide / egal</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Anreise *</label>
            <input name="anreise" required type="date" defaultValue={anreise}
              className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Abreise *</label>
            <input name="abreise" required type="date" defaultValue={abreise}
              className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Anzahl Personen *</label>
          <input name="personen" required type="text"
            defaultValue={personen ? `${personen} Person${Number(personen) !== 1 ? "en" : ""}` : ""}
            placeholder="z. B. 2 Erwachsene, 2 Kinder"
            className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Nachricht</label>
          <textarea name="nachricht" rows={5}
            placeholder="Weitere Wünsche oder Fragen..."
            defaultValue={nachrichtDefault}
            className="w-full rounded-xl border border-stone-200 bg-[#f7f3ec] px-4 py-3 text-sm text-[#1f1c19] outline-none focus:border-[#66735f] focus:ring-2 focus:ring-[#66735f]/20 transition resize-none" />
        </div>

        <button type="submit"
          className="w-full rounded-full bg-[#1f1c19] py-3.5 text-sm font-semibold text-white transition hover:bg-[#66735f]">
          Anfrage absenden →
        </button>
        <p className="text-center text-xs text-stone-400">Wir melden uns innerhalb von 24 Stunden.</p>
      </form>
    </div>
  );
}
