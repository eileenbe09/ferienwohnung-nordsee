import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { path, is_visitor } = await req.json();
    if (!path || path.startsWith("/admin")) return NextResponse.json({ ok: true });
    await supabase.from("page_views").insert({ path, is_visitor: is_visitor ?? false });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
