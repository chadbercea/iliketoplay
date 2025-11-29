import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "I Like To Play",
  description: "Retro Game Collection Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

