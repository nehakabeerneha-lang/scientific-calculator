import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scientific Calculator",
  description: "A fast, mobile-friendly scientific calculator.",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#030712"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}

