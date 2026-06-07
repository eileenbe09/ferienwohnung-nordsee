"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function updateApartment(id: string, formData: FormData) {
  const sizeValue = formData.get("size");
  const parsedSize =
    typeof sizeValue === "string" && sizeValue.trim() !== ""
      ? Number(sizeValue)
      : null;

  const { error } = await supabase
    .from("apartments")
    .update({
      name: formData.get("name"),
      slug: formData.get("slug"),
      short_description: formData.get("short_description"),
      description: formData.get("description"),
      guests: formData.get("guests"),
      size: Number.isNaN(parsedSize) ? null : parsedSize,
      location: formData.get("location"),
      pets: formData.get("pets"),
      final_cleaning: formData.get("final_cleaning"),
      spa_tax: formData.get("spa_tax"),
      optional_addons: formData.get("optional_addons"),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Fehler beim Speichern: ${error.message}`);
  }

  revalidatePath("/admin/wohnungen");
  revalidatePath(`/admin/wohnungen/${id}`);
}