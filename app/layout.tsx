import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mass Coating Company",
    template: "%s | Mass Coating Company",
  },
  description:
    "Professional industrial coating and surface finishing services with trusted quality and modern solutions.",
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