import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ferienwohnungen Lojdl · Nordsee",
  description:
    "Zwei liebevoll eingerichtete Ferienwohnungen in Altfunnixsiel an der Nordsee – familienfreundlich, ruhig gelegen, ca. 5 km vom Strand.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏖️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${geist.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
