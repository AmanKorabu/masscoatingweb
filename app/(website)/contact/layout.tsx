import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Mass Coating Company for powder coating, shot blasting, industrial painting and surface finishing service inquiries.",
  keywords: [
    "Contact Mass Coating Company",
    "Mass Coating Contact",
    "Powder Coating Contact",
    "Shot Blasting Inquiry",
    "Industrial Coating Inquiry",
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}