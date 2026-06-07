"use client";

import { useEffect, useState } from "react";

type ApartmentGalleryProps = {
  images: string[];
  name: string;
};

export default function ApartmentGallery({
  images,
  name,
}: ApartmentGalleryProps) {
  const safeImages = images.length > 0 ? images : ["/images/hero1.avif"];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = safeImages[activeIndex];

  function goToPrevious() {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  }

  function goToNext() {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isLightboxOpen) return;

      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, safeImages.length]);

  return (
    <>
      <div>
        <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="block w-full text-left"
            aria-label={`${name} Bild groß anzeigen`}
          >
            <div
              className="h-[280px] w-full bg-cover bg-center sm:h-[380px] lg:h-[500px]"
              style={{ backgroundImage: `url('${activeImage}')` }}
            />
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white backdrop-blur-sm transition hover:bg-black/50 md:flex"
                aria-label="Vorheriges Bild"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white backdrop-blur-sm transition hover:bg-black/50 md:flex"
                aria-label="Nächstes Bild"
              >
                ›
              </button>
            </>
          )}

          <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {safeImages.length}
          </div>
        </div>

        {safeImages.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-3 md:hidden">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-11 min-w-[110px] items-center justify-center rounded-full bg-[#66735f] px-4 text-lg text-white transition active:scale-95"
              aria-label="Vorheriges Bild"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="flex h-11 min-w-[110px] items-center justify-center rounded-full bg-[#66735f] px-4 text-lg text-white transition active:scale-95"
              aria-label="Nächstes Bild"
            >
              ›
            </button>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {safeImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-2xl border transition ${
                  isActive
                    ? "border-[#66735f] ring-2 ring-[#66735f]/25"
                    : "border-white/30 hover:border-[#d8c7af]"
                }`}
                aria-label={`Bild ${index + 1} auswählen`}
              >
                <div
                  className="h-24 w-full bg-cover bg-center sm:h-28"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 px-4 py-6">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Lightbox schließen"
          >
            ×
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-6"
                aria-label="Vorheriges Bild"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6"
                aria-label="Nächstes Bild"
              >
                ›
              </button>
            </>
          )}

          <div className="w-full max-w-6xl">
            <div className="overflow-hidden rounded-[2rem] bg-white/5 shadow-2xl backdrop-blur-sm">
              <div
                className="h-[55vh] w-full bg-contain bg-center bg-no-repeat sm:h-[70vh]"
                style={{ backgroundImage: `url('${activeImage}')` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-white/85">
              <span>{name}</span>
              <span>
                {activeIndex + 1} / {safeImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}