import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Mass Coating Company, a trusted provider of powder coating, shot blasting, industrial painting and surface finishing services.",
  keywords: [
    "About Mass Coating Company",
    "Mass Coating Company",
    "Mass Coating Company Pune",
    "Industrial Coating Company",
    "Powder Coating Company",
    "Shot Blasting Company",
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}