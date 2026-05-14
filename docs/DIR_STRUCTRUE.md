Directory structure:
└── ishant-kb-codewithishant-v2/
    ├── package.json
    ├── backend/
    │   ├── README.md
    │   ├── requirements.txt
    │   └── app/
    │       ├── config.py
    │       ├── main.py
    │       ├── api/
    │       │   ├── __init__.py
    │       │   ├── deps.py
    │       │   └── v1/
    │       │       ├── __init__.py
    │       │       ├── auth.py
    │       │       ├── note.py
    │       │       └── topic.py
    │       ├── core/
    │       │   ├── jwt.py
    │       │   ├── security.py
    │       │   └── utils.py
    │       ├── db/
    │       │   ├── __init__.py
    │       │   ├── base.py
    │       │   └── session.py
    │       ├── models/
    │       │   ├── __init__.py
    │       │   ├── admin.py
    │       │   ├── note.py
    │       │   └── topic.py
    │       ├── schemas/
    │       │   ├── admin.py
    │       │   ├── note.py
    │       │   ├── topic.py
    │       │   └── topic_full.py
    │       └── services/
    │           ├── __init__.py
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
    │   ├── next.config.ts
    │   ├── package.json
    │   ├── postcss.config.mjs
    │   ├── tailwind.config.ts
    │   ├── tsconfig.json
    │   ├── app/
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   ├── (admin)/
    │   │   │   ├── layout.tsx
    │   │   │   └── admin/
    │   │   │       ├── page.tsx
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
    │   │   │   ├── notes/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── [noteId]/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── test/
    │   │   │   │       └── page.tsx
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
    │   │           └── merge-sort/
    │   │               ├── constants.ts
    │   │               ├── MergeSortVisualizer.tsx
    │   │               └── page.tsx
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── BrandMark.tsx
    │   │   │   └── MarkdownRenderer.tsx
    │   │   ├── features/
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
    │   │   ├── useInViewOnce.ts
    │   │   └── useMouseParallax.ts
    │   ├── lib/
    │   │   ├── algorithms.ts
    │   │   ├── utils.ts
    │   │   └── api/
    │   │       ├── auth.ts
    │   │       ├── client.ts
    │   │       ├── index.ts
    │   │       ├── notes.ts
    │   │       └── topics.ts
    │   ├── store/
    │   │   ├── auth.ts
    │   │   └── ui.ts
    │   └── types/
    │       ├── note.ts
    │       └── topic.ts
    ├── scripts/
    │   ├── check_notes.py
    │   ├── create_admin.py
    │   └── test_api.py
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
