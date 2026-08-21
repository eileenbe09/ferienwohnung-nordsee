import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <>
      <div className="bg-[#1f1c19]">
        <Navbar transparent={false} />
      </div>
      <div className="bg-[#f7f3ec] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl text-[#1f1c19]">Datenschutzerklärung</h1>
          <p className="mt-2 text-sm text-stone-400">Stand: August 2026</p>

          <div className="mt-10 space-y-10 text-sm leading-7 text-stone-600">

            <section>
              <h2 className="font-serif text-xl text-[#1f1c19]">1. Verantwortliche Person</h2>
              <p className="mt-3">
                Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:
              </p>
              <p className="mt-2">
                Manuela Lojdl<br />
                Smittshörn 16<br />
                26409 Wittmund<br />
                E-Mail: <a href="mailto:info@altfunnixsiel-ferien.de" className="text-[#66735f] hover:underline">info@altfunnixsiel-ferien.de</a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1f1c19]">2. Welche Daten wir erheben und warum</h2>
              <h3 className="mt-4 font-semibold text-[#1f1c19]">Kontaktanfragen per E-Mail</h3>
              <p className="mt-2">
                Wenn Sie uns per E-Mail kontaktieren, werden die von Ihnen angegebenen Daten (Name, E-Mail-Adresse, Nachricht und ggf. Telefonnummer) zur Bearbeitung Ihrer Anfrage gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
              </p>

              <h3 className="mt-4 font-semibold text-[#1f1c19]">Buchungsdaten</h3>
              <p className="mt-2">
                Im Rahmen einer Buchung erheben wir Name, Adresse, Telefonnummer und E-Mail-Adresse. Diese Daten werden ausschließlich zur Abwicklung des Mietverhältnisses verwendet und nach gesetzlicher Aufbewahrungsfrist gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
              </p>

              <h3 className="mt-4 font-semibold text-[#1f1c19]">Server-Logfiles</h3>
              <p className="mt-2">
                Beim Aufruf unserer Website werden automatisch technische Informationen (IP-Adresse, Browser, Uhrzeit) erfasst. Diese Daten werden zur Sicherstellung des Betriebs benötigt und nicht mit anderen Daten zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1f1c19]">3. Google Maps</h2>
              <p className="mt-3">
                Wir nutzen auf dieser Website den Kartendienst Google Maps der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Beim Laden der Karte stellt Ihr Browser eine direkte Verbindung zu den Servern von Google her. Dabei können Ihre IP-Adresse und der Standort Ihres Browsers an Google übermittelt werden, auch wenn Sie kein Google-Konto haben oder nicht eingeloggt sind.
              </p>
              <p className="mt-2">
                Die Nutzung von Google Maps erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der anschaulichen Darstellung unseres Standorts). Informationen zum Datenschutz bei Google finden Sie unter: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#66735f] hover:underline">policies.google.com/privacy</a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1f1c19]">4. Ihre Rechte</h2>
              <p className="mt-3">Sie haben jederzeit das Recht auf:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              </ul>
              <p className="mt-3">
                Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:info@altfunnixsiel-ferien.de" className="text-[#66735f] hover:underline">info@altfunnixsiel-ferien.de</a>
              </p>
              <p className="mt-3">
                Sie haben außerdem das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren. Für Niedersachsen ist das die Landesbeauftragte für den Datenschutz Niedersachsen (LfD Niedersachsen).
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1f1c19]">5. Datensicherheit</h2>
              <p className="mt-3">
                Diese Website verwendet HTTPS-Verschlüsselung (TLS), um Ihre Daten bei der Übertragung zu schützen.
              </p>
            </section>

          </div>

          <div className="mt-12 border-t border-stone-200 pt-6">
            <Link href="/kontakt" className="text-sm text-[#66735f] hover:underline">← Zurück zur Kontaktseite</Link>
          </div>
        </div>
      </div>
    </>
  );
}
