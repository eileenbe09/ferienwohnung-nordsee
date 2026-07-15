export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Buchungen laden
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("check_in", { ascending: true });

  return <AdminDashboard bookings={bookings ?? []} />;
}
