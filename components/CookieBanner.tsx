"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-[#1f1c19] px-6 py-5 shadow-2xl text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#d8c7af]">🍪 Cookies & Datenschutz</p>
            <p className="mt-1 text-sm leading-6 text-stone-300">
              Diese Website verwendet nur technisch notwendige Cookies. Es werden keine
              Tracking- oder Werbe-Cookies gesetzt.{" "}
              <a href="/datenschutz" className="underline text-[#d8c7af] hover:text-white transition">
                Datenschutzerklärung
              </a>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              onClick={decline}
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Ablehnen
            </button>
            <button
              onClick={accept}
              className="rounded-full bg-[#d8c7af] px-5 py-2.5 text-sm font-semibold text-[#1f1c19] transition hover:bg-white"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
