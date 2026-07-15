"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import { apartments as staticApartments } from "@/data/apartments";

type AptImage = { id: string; image_url: string; sort_order: number };

export default function AdminBilder({ slug }: { slug: string }) {
  const supabase = createClient();
  const staticApt = staticApartments.find((a) => a.slug === slug)!;
  const fileRef = useRef<HTMLInputElement>(null);

  const [aptId, setAptId] = useState<number | null>(null);
  const [images, setImages] = useState<AptImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data: apt } = await supabase.from("apartments").select("id").eq("slug", slug).single();
    if (apt) {
      setAptId(apt.id);
      const { data } = await supabase.from("apartment_images").select("*").eq("apartment_id", apt.id).order("sort_order");
      if (data && data.length > 0) {
        setImages(data as AptImage[]);
      } else {
        // Seed static images into view (read-only, user can then add via upload)
        setImages(staticApt.gallery.map((url, i) => ({ id: `static-${i}`, image_url: url, sort_order: i })));
      }
    } else {
      setImages(staticApt.gallery.map((url, i) => ({ id: `static-${i}`, image_url: url, sort_order: i })));
    }
    setLoading(false);
  }

  async function handleUpload(file: File) {
    if (!aptId) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `${slug}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from("apartment-images").upload(filename, file, { contentType: file.type });
    if (upErr) {
      flash("Fehler beim Upload. Ist der Supabase-Speicher eingerichtet?");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("apartment-images").getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;
    const nextOrder = images.filter((i) => !i.id.startsWith("static")).length;

    const { data: row, error: dbErr } = await supabase
      .from("apartment_images")
      .insert({ apartment_id: aptId, image_url: publicUrl, sort_order: nextOrder })
      .select().single();

    if (!dbErr && row) {
      setImages((prev) => {
        // Replace static images with real ones on first upload
        const real = prev.filter((i) => !i.id.startsWith("static"));
        return [...real, row as AptImage];
      });
      flash("✓ Bild hochgeladen.");
    } else flash("Fehler beim Speichern der Bild-URL.");
    setUploading(false);
  }

  async function handleDelete(img: AptImage) {
    if (img.id.startsWith("static")) return;
    if (!confirm("Bild löschen?")) return;
    await supabase.from("apartment_images").delete().eq("id", img.id);
    // Try to remove from storage if it's a storage URL
    if (img.image_url.includes("apartment-images")) {
      const path = img.image_url.split("/apartment-images/")[1];
      if (path) await supabase.storage.from("apartment-images").remove([path]);
    }
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  }

  function flash(text: string) { setMsg(text); setTimeout(() => setMsg(""), 4000); }

  const isStatic = !aptId;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#1f1c19]">Bilder</h2>
          <p className="mt-1 text-sm text-stone-400">
            {isStatic
              ? "Aktuelle Bilder (einprogrammiert). SQL-Setup nötig zum Bearbeiten."
              : "Bilder hochladen, ersetzen oder löschen."}
          </p>
        </div>
        {!isStatic && (
          <>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="shrink-0 rounded-full bg-[#1f1c19] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#66735f] disabled:opacity-50"
            >
              {uploading ? "Hochladen…" : "+ Bild hochladen"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }}
            />
          </>
        )}
      </div>

      {isStatic && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          ⚠️ Bitte zuerst das SQL-Setup in Supabase und den Speicher-Bucket einrichten – dann kannst du Bilder direkt hochladen und austauschen.
        </div>
      )}

      {msg && (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${msg.startsWith("✓") ? "bg-[#66735f]/10 text-[#66735f]" : "bg-red-50 text-red-600"}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-stone-400">Laden…</p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, idx) => (
            <div key={img.id} className="group relative overflow-hidden rounded-2xl bg-[#f7f3ec]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={img.image_url}
                  alt={`Bild ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized={img.image_url.startsWith("http")}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                {!img.id.startsWith("static") && (
                  <button
                    onClick={() => handleDelete(img)}
                    className="scale-75 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100"
                  >
                    Löschen
                  </button>
                )}
              </div>
              <p className="absolute bottom-1 left-2 text-[10px] text-white/80 drop-shadow">#{idx + 1}</p>
            </div>
          ))}
        </div>
      )}

      {!isStatic && (
        <p className="mt-4 text-xs text-stone-400">
          Tipp: Das erste Bild wird als Hauptbild verwendet. Lösche Bilder und lade sie in der gewünschten Reihenfolge neu hoch.
        </p>
      )}
    </div>
  );
}
