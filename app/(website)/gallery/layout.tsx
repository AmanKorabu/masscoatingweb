import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View Mass Coating Company project gallery including powder coating, shot blasting, industrial painting and before-after surface finishing work.",
  keywords: [
    "Mass Coating Gallery",
    "Powder Coating Gallery",
    "Shot Blasting Work",
    "Industrial Painting Gallery",
    "Before After Coating Work",
  ],
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}