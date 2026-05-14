"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNotes, getTopics } from "@/lib/api";
import { algorithmRegistry, categories } from "@/lib/algorithms";
import { Note } from "@/types/note";
import { Topic } from "@/types/topic";

interface SidebarLink {
  href: string;
  label: string;
}

type SidebarSection = "home" | "notes" | "topics" | "visualizer" | "admin";

const HOME_LINKS: SidebarLink[] = [
  { href: "/", label: "Home" },
  { href: "/topics", label: "Topics" },
  { href: "/notes", label: "Notes" },
  { href: "/visualizer", label: "Visualizer" },
  { href: "/admin", label: "Admin" },
];

const ADMIN_LINKS: SidebarLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/notes", label: "Notes" },
  { href: "/admin/topic", label: "Topics" },
  { href: "/admin/cheatsheet", label: "Cheatsheets" },
  { href: "/admin/blogs", label: "Blogs" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getSectionFromPath(pathname: string): SidebarSection {
  if (pathname.startsWith("/notes")) return "notes";
  if (pathname.startsWith("/topics")) return "topics";
  if (pathname.startsWith("/visualizer")) return "visualizer";
  if (pathname.startsWith("/admin")) return "admin";
  return "home";
}

export default function Sidebar() {
  const pathname = usePathname();
  const section = useMemo(() => getSectionFromPath(pathname), [pathname]);

  const [notes, setNotes] = useState<Note[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [topicsLoaded, setTopicsLoaded] = useState(false);

  useEffect(() => {
    if (section !== "notes") return;
    let mounted = true;

    getNotes()
      .then((data) => {
        if (!mounted) return;
        setNotes(data);
        setNotesLoaded(true);
      })
      .catch(() => {
        if (!mounted) return;
        setNotes([]);
        setNotesLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, [section]);

  useEffect(() => {
    if (section !== "topics") return;
    let mounted = true;

    getTopics()
      .then((data) => {
        if (!mounted) return;
        setTopics(data);
        setTopicsLoaded(true);
      })
      .catch(() => {
        if (!mounted) return;
        setTopics([]);
        setTopicsLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, [section]);

  const visualizerLinks = useMemo(() => {
    const links: SidebarLink[] = [
      { href: "/visualizer", label: "All Visualizers" },
    ];

    for (const category of categories) {
      links.push({
        href: `/visualizer/${category.id}`,
        label: category.label,
      });

      for (const algorithm of algorithmRegistry) {
        if (algorithm.category === category.id) {
          links.push({
            href: algorithm.route,
            label: `- ${algorithm.name}`,
          });
        }
      }
    }

    return links;
  }, []);

  const sectionMeta = useMemo(() => {
    switch (section) {
      case "notes":
        return {
          eyebrow: "Directory",
          title: "Notes",
          footer: notesLoaded ? `${notes.length} notes` : "Loading notes",
        };
      case "topics":
        return {
          eyebrow: "Directory",
          title: "Topics",
          footer: topicsLoaded ? `${topics.length} topics` : "Loading topics",
        };
      case "visualizer":
        return {
          eyebrow: "Directory",
          title: "Visualizers",
          footer: `${algorithmRegistry.length} visualizers`,
        };
      case "admin":
        return { eyebrow: "Directory", title: "Admin", footer: `${ADMIN_LINKS.length} tools` };
      default:
        return { eyebrow: "Navigate", title: "Site", footer: "Global nav" };
    }
  }, [section, notes.length, notesLoaded, topics.length, topicsLoaded]);

  const links = useMemo(() => {
    if (section === "notes") {
      if (!notesLoaded) {
        return [{ href: "/notes", label: "Loading..." }];
      }

      return [
        { href: "/notes", label: "All Notes" },
        ...notes.map((note) => ({
          href: `/notes/${note.id}`,
          label: note.title,
        })),
      ];
    }

    if (section === "topics") {
      if (!topicsLoaded) {
        return [{ href: "/topics", label: "Loading..." }];
      }

      return [
        { href: "/topics", label: "All Topics" },
        ...topics.map((topic) => ({
          href: `/topics/${topic.slug}`,
          label: topic.name,
        })),
      ];
    }

    if (section === "visualizer") {
      return visualizerLinks;
    }

    if (section === "admin") {
      return ADMIN_LINKS;
    }

    return HOME_LINKS;
  }, [notes, notesLoaded, section, topics, topicsLoaded, visualizerLinks]);

  return (
    <aside
      className="w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] flex flex-col
                 bg-parchment border-r border-warm-border overflow-hidden"
    >
      <div
        className="relative px-6 pt-8 pb-5 border-b border-warm-border shrink-0
                   after:absolute after:-bottom-px after:left-6
                   after:w-10 after:h-0.5 after:bg-gold"
      >
        <p className="text-[9px] tracking-[0.3em] uppercase text-gold mb-1.5">
          {sectionMeta.eyebrow}
        </p>
        <h2 className="font-display text-xl font-bold text-ink tracking-[-0.02em]">
          {sectionMeta.title}
        </h2>
      </div>

      <ul className="flex-1 overflow-y-auto py-4">
        {links.map((link, i) => (
          <li key={link.href}>
            <Link href={link.href} className={`sb-link ${isActive(pathname, link.href) ? "active" : ""}`}>
              <span className="text-[9px] tracking-widest text-gold w-7 text-right shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div
        className="px-6 py-4 border-t border-warm-border shrink-0
                   text-[9px] tracking-[0.15em] uppercase text-ink-ghost"
      >
        {sectionMeta.footer}
      </div>
    </aside>
  );
}
