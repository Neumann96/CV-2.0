import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hero Cards",
  description: "Pixel-close hero cards inspired by hey.milo.gg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
