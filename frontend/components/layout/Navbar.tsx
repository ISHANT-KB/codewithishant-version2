import Link from "next/link";

const NAV_LINKS = [
  { href: "/",       label: "Home" },
  { href: "/topics", label: "Topics" },
  { href: "/notes",  label: "Notes" },
  { href: "/visualizer", label: "Visualizer" },
];

export default function Navbar() {
  return (
    <nav className="navbar-accent sticky top-0 z-100 flex items-center justify-between
                    h-16 px-12 bg-parchment border-b border-warm-border
                    backdrop-blur-md animate-slide-down">

      {/* Logo */}
      <Link href="/" className="font-display text-[22px] font-bold text-ink
                                tracking-[-0.02em] hover:opacity-70 transition-opacity">
        Ishant<em className="not-italic text-gold text-[20px] font-normal">Learn</em>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-9">
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
    </nav>
  );
}
