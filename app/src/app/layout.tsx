import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Megatrendikone – Miten megatrendit vaikuttavat organisaatioosi?",
  description: "Analysoi organisaatiosi megatrendien valossa. Saat visuaalisen tulevaisuuskortin.",
  keywords: ["megatrendit", "organisaatioanalyysi", "tulevaisuus", "strategia", "julkinen sektori"],
  openGraph: {
    title: "Megatrendikone – Miten megatrendit vaikuttavat organisaatioosi?",
    description: "Analysoi organisaatiosi megatrendien valossa.",
    url: "https://megatrendikone.vercel.app",
    siteName: "Megatrendikone",
    locale: "fi_FI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Megatrendikone",
    description: "Miten megatrendit vaikuttavat sinun organisaatioosi?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body
        className={`${sora.variable} ${dmSans.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
