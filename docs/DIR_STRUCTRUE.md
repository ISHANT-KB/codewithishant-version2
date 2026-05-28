Directory structure:
└── ishant-kb-codewithishant-version2/
    ├── implementation_plan.md
    ├── backend/
    │   ├── README.md
    │   ├── alembic.ini
    │   ├── requirements.txt
    │   ├── alembic/
    │   │   ├── README
    │   │   ├── env.py
    │   │   ├── script.py.mako
    │   │   └── versions/
    │   │       ├── 0ceb7de08226_add_token_blacklist.py
    │   │       ├── 4de2d858aa56_add_blogs_table.py
    │   │       ├── 642040635d04_add_audit_logs_table.py
    │   │       └── c168e50afc45_add_expires_at_to_token_blacklist.py
    │   └── app/
    │       ├── config.py
    │       ├── main.py
    │       ├── api/
    │       │   ├── __init__.py
    │       │   ├── deps.py
    │       │   └── v1/
    │       │       ├── __init__.py
    │       │       ├── audit.py
    │       │       ├── auth.py
    │       │       ├── blog.py
    │       │       ├── cheatsheet.py
    │       │       ├── note.py
    │       │       └── topic.py
    │       ├── core/
    │       │   ├── csrf.py
    │       │   ├── jwt.py
    │       │   ├── sanitize.py
    │       │   ├── security.py
    │       │   └── utils.py
    │       ├── db/
    │       │   ├── __init__.py
    │       │   ├── base.py
    │       │   └── session.py
    │       ├── models/
    │       │   ├── __init__.py
    │       │   ├── admin.py
    │       │   ├── audit_log.py
    │       │   ├── blog.py
    │       │   ├── cheatsheet.py
    │       │   ├── note.py
    │       │   ├── token_blacklist.py
    │       │   └── topic.py
    │       ├── schemas/
    │       │   ├── admin.py
    │       │   ├── blog.py
    │       │   ├── cheatsheet.py
    │       │   ├── note.py
    │       │   ├── topic.py
    │       │   └── topic_full.py
    │       └── services/
    │           ├── __init__.py
    │           ├── audit.py
    │           ├── blog.py
    │           ├── cheatsheet.py
    │           ├── note.py
    │           └── topic.py
    ├── docs/
    │   ├── README.md
    │   ├── APP_FLOW.md
    │   ├── ARCHITECTURE.md
    │   ├── DIR_STRUCTRUE.md
    │   ├── FEATURE_LOG.md
    │   ├── PRD.md
    │   ├── SUMMARY.md
    │   └── TRD.md
    ├── frontend/
    │   ├── README.md
    │   ├── components.json
    │   ├── eslint.config.mjs
    │   ├── middleware.ts
    │   ├── next.config.ts
    │   ├── package.json
    │   ├── postcss.config.mjs
    │   ├── tailwind.config.ts
    │   ├── tsconfig.json
    │   ├── app/
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   ├── robots.ts
    │   │   ├── sitemap.ts
    │   │   ├── (admin)/
    │   │   │   ├── layout.tsx
    │   │   │   └── admin/
    │   │   │       ├── page.tsx
    │   │   │       ├── audit/
    │   │   │       │   └── page.tsx
    │   │   │       ├── blogs/
    │   │   │       │   └── page.tsx
    │   │   │       ├── cheatsheet/
    │   │   │       │   └── page.tsx
    │   │   │       ├── login/
    │   │   │       │   └── page.tsx
    │   │   │       ├── notes/
    │   │   │       │   └── page.tsx
    │   │   │       └── topic/
    │   │   │           └── page.tsx
    │   │   ├── (public)/
    │   │   │   ├── layout.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── blogs/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── [slug]/
    │   │   │   │       └── page.tsx
    │   │   │   ├── cheatsheets/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── [slug]/
    │   │   │   │       └── page.tsx
    │   │   │   ├── notes/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── [noteId]/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── test/
    │   │   │   │       └── page.tsx
    │   │   │   ├── security-policy/
    │   │   │   │   └── page.tsx
    │   │   │   └── topics/
    │   │   │       ├── layout.tsx
    │   │   │       ├── page.tsx
    │   │   │       └── [slug]/
    │   │   │           └── page.tsx
    │   │   └── visualizer/
    │   │       ├── layout.tsx
    │   │       ├── page.tsx
    │   │       ├── _components/
    │   │       │   └── VisualizerCard.tsx
    │   │       ├── searching/
    │   │       │   ├── page.tsx
    │   │       │   └── binary-search/
    │   │       │       ├── BinarySearchVisualizer.tsx
    │   │       │       ├── constants.ts
    │   │       │       └── page.tsx
    │   │       └── sorting/
    │   │           ├── page.tsx
    │   │           ├── bubble-sort/
    │   │           │   ├── BubbleSortVisualizer.tsx
    │   │           │   ├── constants.ts
    │   │           │   └── page.tsx
    │   │           ├── insertion-sort/
    │   │           │   ├── constants.ts
    │   │           │   ├── InsertionSortVisualizer.tsx
    │   │           │   └── page.tsx
    │   │           ├── merge-sort/
    │   │           │   ├── constants.ts
    │   │           │   ├── MergeSortVisualizer.tsx
    │   │           │   └── page.tsx
    │   │           └── topological-sort/
    │   │               ├── constants.ts
    │   │               ├── page.tsx
    │   │               └── TopologicalSortVisualizer.tsx
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── BrandMark.tsx
    │   │   │   └── MarkdownRenderer.tsx
    │   │   ├── features/
    │   │   │   ├── blogs/
    │   │   │   │   └── BlogCard.tsx
    │   │   │   ├── cheatsheets/
    │   │   │   │   └── CheatsheetCard.tsx
    │   │   │   ├── notes/
    │   │   │   │   ├── NoteCard.tsx
    │   │   │   │   └── NotePreviewCard.tsx
    │   │   │   └── topics/
    │   │   │       ├── TopicCard.tsx
    │   │   │       ├── TopicListRow.tsx
    │   │   │       └── TopicRow.tsx
    │   │   ├── layout/
    │   │   │   ├── Footer.tsx
    │   │   │   ├── Navbar.tsx
    │   │   │   ├── PublicShell.tsx
    │   │   │   └── Sidebar.tsx
    │   │   ├── sections/
    │   │   │   ├── HeroSection.tsx
    │   │   │   └── hero/
    │   │   │       ├── AmbientGlow.tsx
    │   │   │       ├── AnimatedCounter.tsx
    │   │   │       ├── CursorGlow.tsx
    │   │   │       ├── DotGrid.tsx
    │   │   │       ├── FloatingOrbs.tsx
    │   │   │       ├── Particles.tsx
    │   │   │       └── variants.ts
    │   │   └── ui/
    │   │       ├── button.tsx
    │   │       ├── EmptyState.tsx
    │   │       ├── Eyebrow.tsx
    │   │       ├── IndexBadge.tsx
    │   │       └── SectionDivider.tsx
    │   ├── constants/
    │   │   └── index.ts
    │   ├── hooks/
    │   │   ├── useIdleTimeout.ts
    │   │   ├── useInViewOnce.ts
    │   │   └── useMouseParallax.ts
    │   ├── lib/
    │   │   ├── algorithms.ts
    │   │   ├── utils.ts
    │   │   └── api/
    │   │       ├── auth.ts
    │   │       ├── blogs.ts
    │   │       ├── cheatsheets.ts
    │   │       ├── client.ts
    │   │       ├── index.ts
    │   │       ├── notes.ts
    │   │       └── topics.ts
    │   ├── public/
    │   │   └── .well-known/
    │   │       └── security.txt
    │   ├── store/
    │   │   ├── auth.ts
    │   │   └── ui.ts
    │   └── types/
    │       ├── blog.ts
    │       ├── cheatsheet.ts
    │       ├── note.ts
    │       └── topic.ts
    ├── infra/
    │   └── nginx/
    │       └── codewithishant.com.nginx.conf
    ├── scripts/
    │   ├── check_notes.py
    │   ├── create_admin.py
    │   └── test_api.py
    ├── .github/
    │   └── workflows/
    │       ├── dep-scan.yml
    │       └── secrets-scan.yml
    └── .VSCodeCounter/
        └── 2026-05-11_18-53-23/
            ├── details.md
            ├── diff-details.md
            ├── diff.csv
            ├── diff.md
            ├── diff.txt
            ├── results.csv
            ├── results.json
            ├── results.md
            └── results.txt
