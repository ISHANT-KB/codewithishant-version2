import "./globals.css";
import "katex/dist/katex.min.css";
import {
  DM_Mono,
  Playfair_Display,
  Space_Mono,
  Syne, Noto_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(playfairDisplay.variable, dmMono.variable, spaceMono.variable, syne.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body className="bg-stone-100 text-slate-900 antialiased">
        <div className="min-h-screen bg-parchment">
          <Navbar />
          <div className="flex min-h-[calc(100vh-4rem)]">
            <Sidebar />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
