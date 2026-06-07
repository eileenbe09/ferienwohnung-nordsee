import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-stone-200 bg-[#f8f5ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-wide text-[#1f1f1c]">
          Nordsee Ferienwohnungen
        </Link>

        <nav className="hidden gap-6 md:flex text-sm text-[#1f1f1c]">
          <Link href="/">Start</Link>
          <Link href="/wohnungen">Wohnungen</Link>
          <Link href="/belegung">Belegung</Link>
          <Link href="/anfrage">Anfrage</Link>
          <Link href="/kontakt">Kontakt</Link>
        </nav>
      </div>
    </header>
  );
}