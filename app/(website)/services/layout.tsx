import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Powder Coating, Shot Blasting & Industrial Painting Services",
  description:
    "Explore Mass Coating Company services including powder coating, shot blasting, industrial painting, surface treatment and metal finishing solutions.",
  keywords: [
    "Powder Coating Services",
    "Shot Blasting Services",
    "Industrial Painting Services",
    "Surface Finishing Services",
    "Metal Coating Services",
    "Mass Coating Company Services",
  ],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}