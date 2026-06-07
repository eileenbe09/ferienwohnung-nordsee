import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ferienwohnungen Lojdl · Nordsee",
  description:
    "Zwei liebevoll eingerichtete Ferienwohnungen in Altfunnixsiel an der Nordsee – familienfreundlich, ruhig gelegen, ca. 5 km vom Strand.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={geist.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
