import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://masscoatingweb.vercel.app"),

  title: {
    default: "Mass Coating Company | Powder Coating & Shot Blasting Services",
    template: "%s | Mass Coating Company",
  },

  description:
    "Mass Coating Company provides powder coating, shot blasting, industrial painting, surface finishing and industrial coating services for metal and fabrication parts with trusted quality.",

  keywords: [
    "Mass Coating Company",
    "Mass Coating",
    "Mass Coating Company Pune",
    "Mass Coating Pune",
    "Powder Coating",
    "Shot Blasting",
    "Industrial Painting",
    "Surface Finishing",
    "Industrial Coating",
    "Industrial Coating Services",
    "Powder Coating Services",
    "Shot Blasting Services",
    "Metal Coating Services",
    "Surface Treatment",
    "Metal Finishing",
    "Fabrication Part Coating",
  ],

  authors: [
    {
      name: "Mass Coating Company",
      url: "https://masscoatingweb.vercel.app",
    },
  ],

  creator: "Mass Coating Company",
  publisher: "Mass Coating Company",
  category: "Industrial Coating Services",

  openGraph: {
    title: "Mass Coating Company | Powder Coating & Shot Blasting Services",
    description:
      "Professional powder coating, shot blasting, industrial painting and surface finishing services for industrial metal parts.",
    url: "https://masscoatingweb.vercel.app",
    siteName: "Mass Coating Company",
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mass Coating Company | Industrial Coating Services",
    description:
      "Powder coating, shot blasting, industrial painting and surface finishing services for metal and fabrication parts.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google: "eDShFwXzt3s-T8K7vOFYfob2drwsNZ49SV7sAanpSHA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}