"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/",            label: "Home" },
  { href: "/topics",      label: "Topics" },
  { href: "/notes",       label: "Notes" },
  { href: "/cheatsheets", label: "Cheatsheets" },
  { href: "/visualizer",  label: "Visualizer" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar-accent sticky top-0 z-100 bg-parchment border-b border-warm-border backdrop-blur-md animate-slide-down">
      <div className="flex items-center justify-between h-16 px-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="font-display text-[22px] font-bold text-ink
                                  tracking-[-0.02em] hover:opacity-70 transition-opacity">
          Ishant<em className="not-italic text-gold text-[20px] font-normal">Learn</em>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-[11px] tracking-[0.12em] uppercase text-ink-muted
                         pb-0.5 transition-colors duration-200 hover:text-ink
                         after:absolute after:-bottom-px after:left-0
                         after:h-px after:w-0 after:bg-gold
                         after:transition-all after:duration-250
                         hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="w-px h-4.5 bg-warm-border" />

          {/* Login */}
          <Link
            href="/admin"
            className="nb-top-fill relative overflow-hidden inline-block
                       px-5 py-2 border-[1.5px] border-ink
                       text-[11px] tracking-[0.18em] uppercase text-ink
                       transition-colors duration-250 hover:text-parchment"
          >
            <span className="relative z-10">Login</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 -mr-2 text-ink hover:text-gold transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-warm-border bg-parchment px-6 py-6 shadow-xl animate-fade-down">
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className="text-sm tracking-[0.15em] uppercase text-ink font-medium hover:text-gold transition-colors"
              >
                {l.label}
              </Link>
            ))}
            
            <div className="w-full h-px bg-warm-border my-2" />
            
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="inline-block text-center px-5 py-3 border-[1.5px] border-ink
                         text-[11px] tracking-[0.18em] uppercase text-ink font-semibold
                         hover:bg-ink hover:text-parchment transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
