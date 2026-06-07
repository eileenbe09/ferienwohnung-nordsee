"use client";

import { useEffect, useState } from "react";

type Props = { images: string[]; name: string };

export default function ApartmentGallery({ images, name }: Props) {
  const safeImages = images.length > 0 ? images : ["/images/hero1.avif"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = safeImages[activeIndex];

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, safeImages.length]);

  return (
    <>
      {/* Hauptbild */}
      <div className="relative overflow-hidden rounded-[2rem] bg-stone-100 shadow-xl">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full"
          aria-label="Bild vergrößern"
        >
          <div
            className="h-[260px] w-full bg-cover bg-center sm:h-[360px] lg:h-[420px]"
            style={{ backgroundImage: `url('${active}')` }}
          />
        </button>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white backdrop-blur-sm transition hover:bg-black/55"
              aria-label="Zurück"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white backdrop-blur-sm transition hover:bg-black/55"
              aria-label="Weiter"
            >
              ›
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-4 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {activeIndex + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails – kompakt */}
      {safeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === activeIndex
                  ? "border-[#66735f] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
              aria-label={`Bild ${i + 1}`}
            >
              <div
                className="h-14 w-20 bg-cover bg-center"
                style={{ backgroundImage: `url('${img}')` }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 px-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
            aria-label="Schließen"
          >
            ×
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
              >
                ›
              </button>
            </>
          )}

          <div className="w-full max-w-5xl">
            <div
              className="h-[65vh] w-full rounded-2xl bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${active}')` }}
            />
            <p className="mt-3 text-center text-sm text-white/60">
              {name} · {activeIndex + 1} / {safeImages.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
