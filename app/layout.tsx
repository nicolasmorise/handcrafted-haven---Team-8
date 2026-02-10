// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./global.css"; // changed from "globals.css" in the file path
import HeaderShell from "./ui/HeaderShell";
import Footer from "./ui/Footer"


const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "A marketplace for unique handcrafted treasures.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-[var(--font-body)]">
        <HeaderShell />
        {children}
        <Footer />
      </body>
    </html>
  );
}

