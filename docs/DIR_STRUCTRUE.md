Directory structure:
└── ishant-kb-codewithishant-v2/
    ├── README.md
    ├── APP_FLOW.md
    ├── ARCHITECTURE.md
    ├── FEATURE_LOG.md
    ├── PRD.md
    ├── TRD.md
    ├── backend/
    │   ├── README.md
    │   ├── requirements.txt
    │   ├── app/
    │   │   ├── config.py
    │   │   ├── db.py
    │   │   ├── main.py
    │   │   ├── lib/
    │   │   │   ├── jwt.py
    │   │   │   ├── security.py
    │   │   │   └── utils.py
    │   │   ├── models/
    │   │   │   ├── __init__.py
    │   │   │   ├── admin.py
    │   │   │   ├── note.py
    │   │   │   └── topic.py
    │   │   ├── routes/
    │   │   │   ├── auth.py
    │   │   │   ├── deps.py
    │   │   │   ├── note.py
    │   │   │   └── topic.py
    │   │   └── schemas/
    │   │       ├── admin.py
    │   │       ├── note.py
    │   │       ├── topic.py
    │   │       └── topic_full.py
    │   └── scripts/
    │       ├── check_notes.py
    │       ├── create_admin.py
    │       └── test_api.py
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
    │   │   ├── page.tsx
    │   │   ├── admin/
    │   │   │   ├── page.tsx
    │   │   │   ├── blogs/
    │   │   │   │   └── page.tsx
    │   │   │   ├── cheatsheet/
    │   │   │   │   └── page.tsx
    │   │   │   ├── login/
    │   │   │   │   └── page.tsx
    │   │   │   ├── notes/
    │   │   │   │   └── page.tsx
    │   │   │   └── topic/
    │   │   │       └── page.tsx
    │   │   ├── notes/
    │   │   │   ├── page.tsx
    │   │   │   ├── [noteId]/
    │   │   │   │   └── page.tsx
    │   │   │   └── test/
    │   │   │       └── page.tsx
    │   │   └── topics/
    │   │       ├── layout.tsx
    │   │       ├── page.tsx
    │   │       └── [slug]/
    │   │           └── page.tsx
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── BrandMark.tsx
    │   │   │   └── MarkdownRenderer.tsx
    │   │   ├── layout/
    │   │   │   ├── Footer.tsx
    │   │   │   ├── Navbar.tsx
    │   │   │   └── Sidebar.tsx
    │   │   ├── notes/
    │   │   │   └── NoteCard.tsx
    │   │   ├── sections/
    │   │   │   └── HeroSection.tsx
    │   │   ├── public/
    │   │   │   ├── NotePreviewCard.tsx
    │   │   │   ├── PublicEmptyState.tsx
    │   │   │   ├── PublicShell.tsx
    │   │   │   ├── SectionDivider.tsx
    │   │   │   ├── TopicCard.tsx
    │   │   │   └── TopicListRow.tsx
    │   │   ├── topics/
    │   │   │   ├── TopicCard.tsx
    │   │   │   └── TopicRow.tsx
    │   │   └── ui/
    │   │       ├── button.tsx
    │   │       ├── EmptyState.tsx
    │   │       ├── Eyebrow.tsx
    │   │       ├── IndexBadge.tsx
    │   │       └── SectionRule.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   └── utils.ts
    │   └── types/
    │       ├── note.ts
    │       └── topic.ts
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
