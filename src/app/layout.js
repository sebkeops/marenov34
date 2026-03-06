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
  title: {
    default: "M.A Rénov — Portail & Menuiserie à Restinclières",
    template: "%s — M.A Rénov",
  },
  description: "Artisan menuisier aluminium / PVC depuis 2014. Portails sur mesure, clôtures, menuiseries, volets roulants. Restinclières et 50 km aux alentours. Devis gratuit.",
  metadataBase: new URL("https://marenov34.vercel.app"),
  openGraph: {
    siteName: "M.A Rénov",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "M.A Rénov — Artisan menuisier à Restinclières" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "M.A Rénov",
  "description": "Artisan menuisier aluminium / PVC depuis 2014. Portails sur mesure, clôtures, menuiseries, volets roulants.",
  "telephone": "+33659029028",
  "email": "ste.marenov@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Restinclières",
    "addressCountry": "FR",
  },
  "areaServed": "Restinclières et 50 km aux alentours",
  "priceRange": "€€",
  "url": "https://marenov34.vercel.app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
