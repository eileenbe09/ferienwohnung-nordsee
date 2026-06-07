import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { updateApartment } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminWohnungDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data: apartment, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !apartment) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] p-6 text-[#1f1c19] sm:p-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-semibold">{apartment.name}</h1>
        <p className="mt-2 text-stone-600">Wohnung bearbeiten</p>

        <form action={updateApartment.bind(null, id)} className="mt-8 grid gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <input
              name="name"
              defaultValue={apartment.name ?? ""}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Slug</label>
            <input
              name="slug"
              defaultValue={apartment.slug ?? ""}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Kurzbeschreibung
            </label>
            <textarea
              name="short_description"
              defaultValue={apartment.short_description ?? ""}
              rows={3}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Beschreibung</label>
            <textarea
              name="description"
              defaultValue={apartment.description ?? ""}
              rows={6}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Geeignet für</label>
              <input
                name="guests"
                defaultValue={apartment.guests ?? ""}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Größe</label>
              <input
                name="size"
                type="number"
                defaultValue={apartment.size ?? ""}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Lage</label>
              <input
                name="location"
                defaultValue={apartment.location ?? ""}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Haustiere</label>
              <input
                name="pets"
                defaultValue={apartment.pets ?? ""}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Endreinigung
              </label>
              <input
                name="final_cleaning"
                defaultValue={apartment.final_cleaning ?? ""}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Kurbeitrag</label>
              <input
                name="spa_tax"
                defaultValue={apartment.spa_tax ?? ""}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Optional zubuchbar
            </label>
            <input
              name="optional_addons"
              defaultValue={apartment.optional_addons ?? ""}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#66735f] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Speichern
          </button>
        </form>
      </div>
    </main>
  );
}