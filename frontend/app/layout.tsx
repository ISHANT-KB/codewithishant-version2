import "./globals.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import {
  DM_Mono,
  Playfair_Display,
  Space_Mono,
  Syne,
  Noto_Sans,
} from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

const playfairDisplayHeading = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });
const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });

export const metadata: Metadata = {
  metadataBase: new URL("https://codewithishant.com"),
  title: {
    default: "codewithishant — Programming, Notes & Visualizers",
    template: "%s | codewithishant",
  },
  description:
    "A personal knowledge base by Ishant — covering programming concepts, cheatsheets, notes, blog posts, and interactive algorithm visualizers.",
  keywords: ["programming", "algorithms", "data structures", "cheatsheets", "notes", "visualizer", "web development"],
  authors: [{ name: "Ishant", url: "https://codewithishant.com" }],
  creator: "Ishant",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codewithishant.com",
    siteName: "codewithishant",
    title: "codewithishant — Programming, Notes & Visualizers",
    description:
      "A personal knowledge base covering programming concepts, cheatsheets, notes, and interactive algorithm visualizers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "codewithishant",
    description: "Programming notes, cheatsheets, blogs, and algorithm visualizers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://codewithishant.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        playfairDisplay.variable,
        dmMono.variable,
        spaceMono.variable,
        syne.variable,
        notoSans.variable,
        playfairDisplayHeading.variable,
        "font-sans"
      )}
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