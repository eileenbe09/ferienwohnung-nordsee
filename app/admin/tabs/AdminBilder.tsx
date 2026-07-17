"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import { apartments as staticApartments } from "@/data/apartments";

type AptImage = { id: string; image_url: string; sort_order: number };

export default function AdminBilder({ slug }: { slug: string }) {
  const supabase = createClient();
  const staticApt = staticApartments.find((a) => a.slug === slug)!;
  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const dragIdRef = useRef<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const [aptId, setAptId] = useState<number | null>(null);
  const [images, setImages] = useState<AptImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const hasDBImages = images.some((i) => !i.id.startsWith("static"));

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
        setImages(staticApt.gallery.map((url, i) => ({ id: `static-${i}`, image_url: url, sort_order: i })));
      }
    } else {
      setImages(staticApt.gallery.map((url, i) => ({ id: `static-${i}`, image_url: url, sort_order: i })));
    }
    setLoading(false);
  }

  async function handleSeed() {
    if (!aptId) return;
    setSeeding(true);
    const rows = staticApt.gallery.map((url, i) => ({ apartment_id: aptId, image_url: url, sort_order: i }));
    const { data, error } = await supabase.from("apartment_images").insert(rows).select();
    if (!error && data) {
      setImages(data as AptImage[]);
      flash("✓ Bilder übertragen – du kannst sie jetzt neu anordnen, ersetzen oder löschen.");
    } else flash("Fehler beim Übertragen.");
    setSeeding(false);
  }

  async function uploadFile(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const filename = `${slug}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("apartment-images").upload(filename, file, { contentType: file.type });
    if (error) { flash("Upload-Fehler. Sind die Storage-Policies eingerichtet?"); return null; }
    const { data } = supabase.storage.from("apartment-images").getPublicUrl(filename);
    return data.publicUrl;
  }

  async function handleUploadNew(file: File) {
    if (!aptId) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      const nextOrder = images.length;
      const { data, error } = await supabase
        .from("apartment_images")
        .insert({ apartment_id: aptId, image_url: url, sort_order: nextOrder })
        .select().single();
      if (!error && data) {
        setImages((prev) => [...prev.filter((i) => !i.id.startsWith("static")), data as AptImage]);
        flash("✓ Bild hinzugefügt.");
      }
    }
    setUploading(false);
  }

  async function handleReplace(img: AptImage, file: File) {
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      if (img.image_url.includes("apartment-images/")) {
        const path = img.image_url.split("/apartment-images/")[1];
        if (path) await supabase.storage.from("apartment-images").remove([path]);
      }
      await supabase.from("apartment_images").update({ image_url: url }).eq("id", img.id);
      setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, image_url: url } : i)));
      flash("✓ Bild ersetzt.");
    }
    setReplacingId(null);
    setUploading(false);
  }

  async function handleDelete(img: AptImage) {
    if (!confirm("Bild löschen?")) return;
    if (img.image_url.includes("apartment-images/")) {
      const path = img.image_url.split("/apartment-images/")[1];
      if (path) await supabase.storage.from("apartment-images").remove([path]);
    }
    await supabase.from("apartment_images").delete().eq("id", img.id);
    const remaining = images.filter((i) => i.id !== img.id);
    // Reihenfolge neu durchnummerieren
    const reordered = remaining.map((img, idx) => ({ ...img, sort_order: idx }));
    await saveOrder(reordered);
    setImages(reordered);
  }

  // Drag & Drop
  function onDragStart(id: string) {
    dragIdRef.current = id;
  }

  function onDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    setDragOverId(id);
  }

  async function onDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    setDragOverId(null);
    const fromId = dragIdRef.current;
    if (!fromId || fromId === targetId) return;

    const fromIdx = images.findIndex((i) => i.id === fromId);
    const toIdx = images.findIndex((i) => i.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...images];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const withNewOrder = reordered.map((img, idx) => ({ ...img, sort_order: idx }));

    setImages(withNewOrder);
    await saveOrder(withNewOrder);
    flash("✓ Reihenfolge gespeichert.");
  }

  async function saveOrder(list: AptImage[]) {
    // Alle sort_order Werte in einem Batch updaten
    await Promise.all(
      list
        .filter((i) => !i.id.startsWith("static"))
        .map((img) => supabase.from("apartment_images").update({ sort_order: img.sort_order }).eq("id", img.id))
    );
  }

  function flash(text: string) { setMsg(text); setTimeout(() => setMsg(""), 4000); }
  const isStatic = !aptId;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-[#1f1c19]">Bilder</h2>
          <p className="mt-1 text-sm text-stone-400">
            {hasDBImages
              ? "Ziehen zum Anordnen · Hover → Ersetzen / Löschen · Bild #1 = Titelbild"
              : "Klicke 'Jetzt einrichten' um die aktuellen Bilder bearbeitbar zu machen."}
          </p>
        </div>
        <div className="flex gap-2">
          {aptId && !hasDBImages && (
            <button onClick={handleSeed} disabled={seeding}
              className="rounded-full bg-[#66735f] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
              {seeding ? "Übertragen…" : "Jetzt einrichten →"}
            </button>
          )}
          {hasDBImages && (
            <>
              <button onClick={() => uploadRef.current?.click()} disabled={uploading}
                className="rounded-full bg-[#1f1c19] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#66735f] disabled:opacity-50">
                {uploading ? "Lädt hoch…" : "+ Bild hinzufügen"}
              </button>
              <input ref={uploadRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadNew(f); e.target.value = ""; }} />
            </>
          )}
        </div>
      </div>

      <input ref={replaceRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          const img = images.find((i) => i.id === replacingId);
          if (f && img) handleReplace(img, f);
          e.target.value = "";
        }} />

      {isStatic && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          ⚠️ Bitte zuerst das SQL-Setup in Supabase ausführen – dann erscheint der „Jetzt einrichten"-Button.
        </div>
      )}
      {aptId && !hasDBImages && (
        <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
          Klicke „Jetzt einrichten" um die aktuellen Bilder in Supabase zu übertragen.
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
            <div
              key={img.id}
              draggable={!img.id.startsWith("static")}
              onDragStart={() => onDragStart(img.id)}
              onDragOver={(e) => onDragOver(e, img.id)}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => onDrop(e, img.id)}
              className={`group relative overflow-hidden rounded-2xl bg-[#f7f3ec] transition
                ${!img.id.startsWith("static") ? "cursor-grab active:cursor-grabbing" : ""}
                ${dragOverId === img.id ? "ring-2 ring-[#66735f] ring-offset-2 scale-95" : ""}
              `}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={img.image_url}
                  alt={`Bild ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition group-hover:brightness-50"
                  unoptimized={img.image_url.startsWith("http")}
                  draggable={false}
                />
              </div>

              {!img.id.startsWith("static") && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => { setReplacingId(img.id); replaceRef.current?.click(); }}
                    disabled={uploading}
                    className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#1f1c19] shadow transition hover:bg-[#d8c7af]"
                  >
                    Ersetzen
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-red-600"
                  >
                    Löschen
                  </button>
                </div>
              )}

              <div className="absolute bottom-1 left-2 flex items-center gap-1">
                <p className="text-[10px] font-semibold text-white/90 drop-shadow">#{idx + 1}</p>
                {idx === 0 && (
                  <span className="rounded bg-[#d8c7af] px-1 text-[8px] font-bold text-[#1f1c19]">TITEL</span>
                )}
              </div>

              {!img.id.startsWith("static") && (
                <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-0 text-white/60 text-xs select-none">
                  ⠿
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
