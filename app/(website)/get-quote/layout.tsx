import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Quote",
  description:
    "Request a quote from Mass Coating Company for powder coating, shot blasting, industrial painting and surface finishing services.",
  keywords: [
    "Get Quote Mass Coating Company",
    "Powder Coating Quote",
    "Shot Blasting Quote",
    "Industrial Painting Quote",
    "Surface Finishing Quote",
  ],
};

export default function GetQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}