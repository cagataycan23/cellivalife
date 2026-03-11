import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Celliva Life",
  description: "Precision longevity commerce powered by Omnisio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
