import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirill Karachev — Product Analyst & Builder",
  description:
    "Product analyst and technical product specialist in Vienna. Built an EdTech Mini App for 10,000+ users and works across product, data and code.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const themeScript = `
  try {
    document.documentElement.dataset.theme =
      localStorage.getItem("kk-theme") === "light" ? "light" : "dark";
  } catch (_) {
    document.documentElement.dataset.theme = "dark";
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
