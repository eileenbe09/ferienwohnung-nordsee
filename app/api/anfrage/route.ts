import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    vorname, nachname, email, telefon, wohnung,
    anreise, abreise, personen, nachricht,
    berechneter_preis, bettwaesche_paket, handtuch_paket, kinderalter,
  } = body;

  const transporter = nodemailer.createTransport({
    host: "smtp.strato.de",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const anreiseDatum = anreise ? new Date(anreise).toLocaleDateString("de-DE") : "–";
  const abreiseDatum = abreise ? new Date(abreise).toLocaleDateString("de-DE") : "–";

  const extras: string[] = [];
  if (bettwaesche_paket === "ja") extras.push("Bettwäsche-Paket");
  if (handtuch_paket === "ja") extras.push("Handtuch-Paket");

  const mailText = `
Neue Anfrage über die Webseite
================================

Name:        ${vorname} ${nachname}
E-Mail:      ${email}
Telefon:     ${telefon || "–"}

Wohnung:     ${wohnung || "–"}
Anreise:     ${anreiseDatum}
Abreise:     ${abreiseDatum}
Personen:    ${personen || "–"}
${berechneter_preis ? `Gesamtpreis: ${berechneter_preis}` : ""}
${kinderalter ? `Kinderalter: ${kinderalter}` : ""}
${extras.length > 0 ? `Extras:      ${extras.join(", ")}` : ""}

Nachricht:
${nachricht || "–"}

================================
Gesendet über altfunnixsiel-ferien.de
  `.trim();

  try {
    await transporter.sendMail({
      from: `"Anfrage Webseite" <${process.env.SMTP_USER}>`,
      to: "info@altfunnixsiel-ferien.de",
      replyTo: email,
      subject: `Neue Anfrage: ${wohnung || "Ferienwohnung"} – ${vorname} ${nachname}`,
      text: mailText,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("E-Mail-Fehler:", err);
    return NextResponse.json({ ok: false, error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
  }
}
