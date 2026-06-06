import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mass-coating-company.vercel.app"),

  title: {
    default: "Mass Coating Company | Powder Coating & Shot Blasting Services",
    template: "%s | Mass Coating Company",
  },

  description:
    "Mass Coating Company provides powder coating, shot blasting, industrial painting, surface finishing and industrial coating services for metal, fabrication and industrial parts with trusted quality.",

  keywords: [
    "Mass Coating Company",
    "Mass Coating",
    "Mass Coating Company Pune",
    "Mass Coating Company Maharashtra",
    "Powder Coating",
    "Powder Coating Services",
    "Shot Blasting",
    "Shot Blasting Services",
    "Industrial Painting",
    "Industrial Painting Services",
    "Surface Finishing",
    "Surface Treatment",
    "Industrial Coating",
    "Industrial Coating Services",
    "Metal Coating Services",
    "Metal Finishing",
    "Fabrication Part Coating",
    "Coating Company",
    "Coating Services",
  ],

  applicationName: "Mass Coating Company",

  authors: [
    {
      name: "Mass Coating Company",
      url: "https://mass-coating-company.vercel.app",
    },
  ],

  creator: "Mass Coating Company",
  publisher: "Mass Coating Company",
  category: "Industrial Coating Services",

  alternates: {
    canonical: "https://mass-coating-company.vercel.app",
  },

  openGraph: {
    title: "Mass Coating Company | Powder Coating & Shot Blasting Services",
    description:
      "Professional powder coating, shot blasting, industrial painting and surface finishing services for metal and fabrication parts.",
    url: "https://mass-coating-company.vercel.app",
    siteName: "Mass Coating Company",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Mass Coating Company Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mass Coating Company | Industrial Coating Services",
    description:
      "Powder coating, shot blasting, industrial painting and surface finishing services for metal and fabrication parts.",
    images: ["/icon-512.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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