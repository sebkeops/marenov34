import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "M.A Rénov — Portail & Menuiserie à Restinclières",
  description: "Artisan menuisier aluminium / PVC depuis 2014. Portails sur mesure, clôtures, menuiseries, volets roulants. Restinclières et 50 km aux alentours. Devis gratuit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
