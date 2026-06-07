import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("apartments")
    .select("*");

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Supabase Test</h1>

      {error && (
        <p className="mt-4 text-red-500">
          Fehler: {error.message}
        </p>
      )}

      <pre className="mt-6 text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}