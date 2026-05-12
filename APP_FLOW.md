# APP_FLOW.md

> **Project:** codewithishant-v2  
> **Stack:** Next.js 14 (App Router) · FastAPI · PostgreSQL (SQLAlchemy ORM) · JWT Auth  
> **Last updated:** 2026-05-12

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Data Models](#2-data-models)
3. [Backend: API Flows (FastAPI)](#3-backend-api-flows-fastapi)
4. [Frontend: Public Flows (Next.js)](#4-frontend-public-flows-nextjs)
5. [Frontend: Admin Flows (Next.js)](#5-frontend-admin-flows-nextjs)
6. [End-to-End Paths](#6-end-to-end-paths)
7. [Cross-Cutting Concerns](#7-cross-cutting-concerns)
8. [Placeholder / Planned Features](#8-placeholder--planned-features)
9. [Future Scope & Roadmap](#9-future-scope--roadmap)

---

## 1. System Overview

```
Browser
  │
  ├── Next.js Frontend  (port 3000)
  │     ├── Public pages   → server components, SSR data fetching
  │     └── Admin pages    → client components, JWT-gated
  │
  └── FastAPI Backend  (port 8000)
        ├── GET  /topics/**     → public read
        ├── GET  /notes/**      → public read
        ├── POST|PUT|DELETE /topics/** → admin-only (JWT)
        ├── POST|PUT|DELETE /notes/**  → admin-only (JWT)
        └── POST /api/auth/admin-login → issues JWT
              │
              └── PostgreSQL
                    ├── admins
                    ├── topics   (self-referential, hierarchical)
                    └── notes    (FK → topics)
```

**Environment variables:**

| Variable | Used by | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Frontend (`lib/api.ts`) | Backend base URL for public SSR fetches |
| `DATABASE_URL` | Backend (`app/db.py`) | PostgreSQL connection string |
| `JWT_SECRET` | Backend (`app/config.py`) | HMAC secret for signing JWTs |
| `JWT_ALGORITHM` | Backend (`app/config.py`) | JWT algorithm (e.g. `HS256`) |

---

## 2. Data Models

### 2.1 Topic

**Table:** `topics`

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` (PK) | Auto-generated via `uuid4` |
| `name` | `String` | Display name |
| `slug` | `String` (unique) | URL-safe identifier, auto-generated from name; de-duped with `-1`, `-2`… suffix |
| `description` | `Text` (nullable) | Optional description |
| `parent_id` | `UUID` (FK → `topics.id`, nullable) | Self-referential hierarchy; circular references are rejected |
| `position` | `Integer` | Default `0`; reserved for manual ordering |
| `notes` | relationship | One-to-many → `Note`; cascade delete |

### 2.2 Note

**Table:** `notes`

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` (PK) | Auto-generated via `uuid4` |
| `title` | `String` | Display title |
| `content` | `Text` | Raw Markdown content |
| `topic_id` | `UUID` (FK → `topics.id`) | Required; note cannot exist without a topic |
| `topic` | relationship | Many-to-one → `Topic` |

### 2.3 Admin

**Table:** `admins`

| Column | Notes |
|---|---|
| `email` | Unique identifier; used as JWT `sub` |
| `password` | bcrypt-hashed |

---

## 3. Backend: API Flows (FastAPI)

**Entry point:** `backend/app/main.py`  
**CORS:** All origins allowed (`allow_origins=["*"]`).  
**DB:** SQLAlchemy session injected per-request via `get_db()` dependency.

---

### 3.1 Authentication — `POST /api/auth/admin-login`

**File:** `backend/app/routes/auth.py`

```
Client                     FastAPI                     PostgreSQL
  │                           │                             │
  │── POST /api/auth/admin-login ──────────────────────────►│
  │   { email, password }     │── SELECT FROM admins ──────►│
  │                           │◄── admin row ───────────────│
  │                           │── bcrypt.verify(password) ──►
  │                           │── create_access_token({ sub: email, role: "admin" })
  │◄── { access_token, token_type: "bearer" } ─────────────│
```

**Error cases:**
- `403` — email not found in `admins` table
- `401` — password does not match hash

**JWT payload:**
```json
{ "sub": "admin@example.com", "role": "admin" }
```

---

### 3.2 Admin Guard — `get_current_admin` dependency

**File:** `backend/app/routes/deps.py`

All admin-only endpoints declare `_admin = Depends(get_current_admin)`.  
The dependency:
1. Extracts `Bearer <token>` from the `Authorization` header.
2. Decodes with `JWT_SECRET` + `JWT_ALGORITHM`.
3. Asserts `payload["role"] == "admin"`.
4. Returns decoded payload on success; raises `401`/`403` on failure.

---

### 3.3 Topics API — prefix `/topics`

**File:** `backend/app/routes/topic.py`

#### Public (no auth)

| Method | Path | Description |
|---|---|---|
| `GET` | `/topics/` | Return all topics (flat list) |
| `GET` | `/topics/{slug}` | Return single topic by slug |
| `GET` | `/topics/{slug}/notes` | Return all notes belonging to a topic |
| `GET` | `/topics/{slug}/full` | Return `{ topic, notes[] }` — used by frontend topic detail page |

> **Route ordering note:** `/topics/{slug}/notes` and `/topics/{slug}/full` are registered **before** `/topics/{slug}` in `topic.py` to prevent FastAPI from matching `notes`/`full` as slug values.

#### Admin-only (JWT required)

| Method | Path | Description |
|---|---|---|
| `POST` | `/topics/` | Create topic; auto-generates unique slug from `name` |
| `PUT` | `/topics/{topic_id}` | Update name, description, parent, slug |
| `DELETE` | `/topics/{topic_id}` | Delete topic; **blocked** if topic has child topics |

**Slug generation:** `lib/utils.py → generate_slug(name)` → lowercased, hyphenated. Uniqueness ensured by appending `-1`, `-2`… if collisions exist.

**Parent validation:**  
- A topic cannot be its own parent.  
- A topic cannot be reparented beneath one of its own descendants (circular hierarchy check).

---

### 3.4 Notes API — prefix `/notes`

**File:** `backend/app/routes/note.py`

#### Public (no auth)

| Method | Path | Description |
|---|---|---|
| `GET` | `/notes/` | Return all notes |
| `GET` | `/notes/{note_id}` | Return single note by UUID |

#### Admin-only (JWT required)

| Method | Path | Description |
|---|---|---|
| `POST` | `/notes/` | Create note; validates `topic_id` exists (`400` if not) |
| `PUT` | `/notes/{note_id}` | Update title, content, topic_id |
| `DELETE` | `/notes/{note_id}` | Hard delete |

---

## 4. Frontend: Public Flows (Next.js)

**Framework:** Next.js App Router (server components by default).  
**Data fetching:** `frontend/lib/api.ts` — all functions use plain `fetch()` against `NEXT_PUBLIC_API_URL` (falls back to `http://localhost:8000`).  
**Global layout:** `frontend/app/layout.tsx` — wraps all pages with `<Navbar />`, `<main>`, `<Footer />`.

---

### 4.1 Home Page — `GET /`

**File:** `frontend/app/page.tsx`

```
Browser → GET /
  └── Server component
        └── getTopics()  →  GET /topics/
              └── Renders:
                    ├── Hero section ("Explore Topics")
                    │     └── topic count badge
                    └── Topic grid
                          ├── <TopicCard /> × N  (→ /topics/[slug] on click)
                          └── <EmptyState /> if topics.length === 0
```

---

### 4.2 Topics Index — `GET /topics`

**File:** `frontend/app/topics/page.tsx`

```
Browser → GET /topics
  └── Server component
        └── getTopics()  →  GET /topics/
              └── Renders:
                    └── Topic listing (cards grid or EmptyState)
```

---

### 4.3 Topic Detail — `GET /topics/[slug]`

**File:** `frontend/app/topics/[slug]/page.tsx`

```
Browser → GET /topics/<slug>
  └── Server component (parallel data fetch)
        ├── getTopicFull(slug)
        │     └── tries GET /topics/<slug>/full first
        │           fallback → GET /topics/<slug>
        └── getTopics()  →  GET /topics/   (for sidebar)

  Renders:
    ├── <Sidebar topics={allTopics} currentSlug={slug} />
    ├── Topic header (name + description)
    └── Notes section
          ├── <NoteCard /> × N  (→ /notes/[noteId] on click)
          └── <EmptyState /> if notes.length === 0
```

---

### 4.4 Notes Index — `GET /notes`

**File:** `frontend/app/notes/page.tsx`

```
Browser → GET /notes
  └── Server component
        └── getNotes()  →  GET /notes/
              └── Renders:
                    ├── Notes count badge
                    ├── <NoteCard /> × N  (→ /notes/[noteId] on click)
                    └── <EmptyState /> if notes.length === 0
```

---

### 4.5 Note Detail — `GET /notes/[noteId]`

**File:** `frontend/app/notes/[noteId]/page.tsx`

```
Browser → GET /notes/<noteId>
  └── Server component (parallel data fetch)
        ├── getNote(noteId)    →  GET /notes/<noteId>
        └── getTopics()        →  GET /topics/   (for sidebar)

  Renders:
    ├── Back link → /notes
    ├── Note title + UUID label
    └── <MarkdownRenderer content={note.content} />
```

---

### 4.6 Markdown Rendering

**File:** `frontend/components/common/MarkdownRenderer.tsx`

```
note.content (raw Markdown string)
  └── <ReactMarkdown>
        ├── remark-gfm          → GitHub-Flavored Markdown (tables, strikethrough, etc.)
        ├── remark-math         → $…$ and $$…$$ math syntax
        ├── rehype-katex        → renders math to KaTeX HTML
        └── rehype-highlight    → syntax highlighting for fenced code blocks

  Output styled with Tailwind `prose` classes.
  KaTeX CSS loaded globally via layout.tsx: import "katex/dist/katex.min.css"
```

---

## 5. Frontend: Admin Flows (Next.js)

All admin pages are **client components** (`"use client"`). They read the JWT from `localStorage` under the key `token` and send it as `Authorization: Bearer <token>` on every mutating request.

---

### 5.1 Admin Login — `/admin/login`

**File:** `frontend/app/admin/login/page.tsx`

```
User → /admin/login
  └── Enters email + password
        └── POST /api/auth/admin-login
              ├── Success → localStorage.setItem("token", access_token)
              │             → navigate to /admin
              └── Failure → show error message
```

---

### 5.2 Admin Dashboard — `/admin`

**File:** `frontend/app/admin/page.tsx`

```
User → /admin
  └── Client component
        ├── Token check: if no token → redirect /admin/login
        └── Dashboard hub with navigation links:
              ├── /admin/notes      (active)
              ├── /admin/topic      (active)
              ├── /admin/blogs      (placeholder)
              └── /admin/cheatsheet (placeholder)
```

---

### 5.3 Manage Notes — `/admin/notes`

**File:** `frontend/app/admin/notes/page.tsx`

```
Mount:
  ├── Token check → redirect /admin/login if missing
  └── Parallel fetch:
        ├── GET /notes/     → notes list
        └── GET /topics/    → topic selector options

Create / Update Note:
  User fills: title, content (Markdown), topicId
    ├── New note  → POST /notes/        { title, content, topic_id }
    └── Edit mode → PUT  /notes/<id>    { title, content, topic_id }
  Both requests: Authorization: Bearer <token>

  On success:
    ├── Show success banner
    ├── Clear form
    └── Re-fetch notes list

Delete Note:
  User clicks Delete → confirm prompt
    └── DELETE /notes/<id>    Authorization: Bearer <token>
          └── On success → re-fetch notes list
```

---

### 5.4 Manage Topics — `/admin/topic`

**File:** `frontend/app/admin/topic/page.tsx`

```
Mount:
  ├── Token check → redirect /admin/login if missing
  └── Fetch topics list (with optional note counts)

Create / Update Topic:
  User fills: name, description, parent (optional)
    ├── New topic  → POST /topics/           { name, description, parent_id? }
    └── Edit mode  → PUT  /topics/<topic_id> { name, description, parent_id? }
  Both requests: Authorization: Bearer <token>

Delete Topic:
  └── DELETE /topics/<topic_id>   Authorization: Bearer <token>
        ├── Backend rejects (400) if topic has child topics
        └── On success → re-fetch topics list
```

---

## 6. End-to-End Paths

### 6.1 Public Reading Path

```
/  →  /topics/[slug]  →  /notes/[noteId]
```

| Step | Frontend call | Backend endpoint |
|---|---|---|
| Home | `getTopics()` | `GET /topics/` |
| Topic detail | `getTopicFull(slug)` | `GET /topics/<slug>/full` |
| Sidebar | `getTopics()` | `GET /topics/` |
| Note detail | `getNote(id)` | `GET /notes/<id>` |
| Sidebar | `getTopics()` | `GET /topics/` |

---

### 6.2 Admin Content Management Path

```
/admin/login  →  /admin  →  /admin/notes | /admin/topic
```

| Step | Frontend call | Backend endpoint |
|---|---|---|
| Login | `POST /api/auth/admin-login` | `POST /api/auth/admin-login` |
| List notes | `GET /notes/` | `GET /notes/` |
| List topics | `GET /topics/` | `GET /topics/` |
| Create note | `POST /notes/` + Bearer | `POST /notes/` |
| Edit note | `PUT /notes/<id>` + Bearer | `PUT /notes/<id>` |
| Delete note | `DELETE /notes/<id>` + Bearer | `DELETE /notes/<id>` |
| Create topic | `POST /topics/` + Bearer | `POST /topics/` |
| Edit topic | `PUT /topics/<id>` + Bearer | `PUT /topics/<id>` |
| Delete topic | `DELETE /topics/<id>` + Bearer | `DELETE /topics/<id>` |

---

## 7. Cross-Cutting Concerns

### 7.1 API Base URL Resolution

```ts
// frontend/lib/api.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
```

- Server-side (SSR pages): `NEXT_PUBLIC_API_URL` must be set in `.env.local`.
- Client-side (admin pages): same env var is baked in at build time.
- **Known issue:** Some admin pages still use hardcoded `http://127.0.0.1:8000`. This should be migrated to `API_BASE_URL`.

### 7.2 CORS

Backend allows all origins (`allow_origins=["*"]`). Suitable for development; should be locked down to the frontend domain in production.

### 7.3 Database Session Lifecycle

Each FastAPI request opens a new SQLAlchemy `Session` via `get_db()` and closes it in a `finally` block — no persistent connections leaking between requests.

### 7.4 Fonts & Styling

Global layout loads multiple Google Fonts via `next/font/google`:
- **Playfair Display** — headings (`--font-heading`, `--font-playfair`)
- **Noto Sans** — body (`--font-sans`)
- **DM Mono / Space Mono** — code
- **Syne** — display/accent

Tailwind CSS is used throughout. `prose` utility classes style Markdown output.

### 7.5 Sidebar

`<Sidebar />` is rendered on `/topics/[slug]` and `/notes/[noteId]` pages. It receives the full topics array (fetched in parallel with the main resource) and highlights the currently active topic by matching the current slug.

---

## 8. Placeholder / Planned Features

The following routes exist in the frontend directory structure but have **no page content yet**:

| Route | Directory | Status |
|---|---|---|
| `/blogs` | `frontend/app/blogs/` | Empty — planned |
| `/cheatsheets` | `frontend/app/cheatsheets/` | Empty — planned |
| `/mcqs` | `frontend/app/mcqs/` | Empty — planned |
| `/admin/blogs` | `frontend/app/admin/blogs/` | Placeholder link in admin dashboard |
| `/admin/cheatsheet` | `frontend/app/admin/cheatsheet/` | Placeholder link in admin dashboard |

These sections are visible as navigation links or dashboard tiles but will return 404 until implemented.

---

## 9. Future Scope & Roadmap

> This section outlines planned features, architectural evolutions, and scaling strategies for CodeWithIshant beyond the current MVP scope.

---

### 9.1 Content Expansion Modules

#### 9.1.1 Blogs System
**Frontend:** `/blogs`, `/blogs/[slug]`, `/admin/blogs`  
**Backend:** `GET|POST|PUT|DELETE /api/v1/blogs/**`

| Feature | Description | Data Model Additions |
|---|---|---|
| **Blog Posts** | Long-form articles with cover images, tags, and reading time | `blogs` table: `id`, `title`, `slug`, `content`, `cover_image`, `excerpt`, `tags[]`, `published_at`, `status` (draft/published), `view_count` |
| **Tags** | Categorization system for blogs | `tags` table + `blog_tags` junction table |
| **Series** | Group related blogs into series | `blog_series` table with `position` ordering |
| **Admin CRUD** | Full blog management in admin panel | Same pattern as notes/topics |
| **SEO** | Rich meta tags, Open Graph, structured data | Auto-generated from blog metadata |

**Flow:**
```
Public: /blogs → list all published blogs
         /blogs/[slug] → single blog with prev/next navigation
         /blogs?tag=python → filtered by tag
         /blogs?series=fastapi-series → series view

Admin: /admin/blogs → list, create, edit, publish/unpublish
```

---

#### 9.1.2 Cheatsheets System
**Frontend:** `/cheatsheets`, `/cheatsheets/[slug]`, `/admin/cheatsheets`  
**Backend:** `GET|POST|PUT|DELETE /api/v1/cheatsheets/**`

| Feature | Description | Data Model |
|---|---|---|
| **Cheat Sheets** | Quick-reference cards (e.g., "Git Commands", "Docker CLI") | `cheatsheets` table: `id`, `title`, `slug`, `description`, `language`, `category` |
| **Commands / Snippets** | Individual entries within a cheatsheet | `cheatsheet_items` table: `id`, `cheatsheet_id`, `command`, `description`, `example`, `tags[]`, `position` |
| **Copy-to-Clipboard** | One-click copy for any command | Frontend component with toast feedback |
| **Print View** | Optimized print stylesheet | CSS `@media print` rules |
| **Search** | Full-text search across commands | PostgreSQL GIN index on `command` + `description` |

**Flow:**
```
Public: /cheatsheets → grid of cheatsheet cards
         /cheatsheets/git-commands → list of commands with copy buttons
         /cheatsheets?lang=python → filter by programming language

Admin: /admin/cheatsheets → manage cheatsheets and their items
```

---

#### 9.1.3 MCQs / Quiz System
**Frontend:** `/mcqs`, `/mcqs/[topic]`, `/mcqs/practice`  
**Backend:** `GET|POST /api/v1/mcqs/**`, `POST /api/v1/quiz/submit`

| Feature | Description | Data Model |
|---|---|---|
| **Question Bank** | Multiple-choice questions per topic | `mcqs` table: `id`, `topic_id`, `question`, `options[]`, `correct_answer`, `explanation`, `difficulty` |
| **Practice Mode** | Timed/untimed practice sessions | Frontend state management for quiz session |
| **Scoring** | Immediate feedback + score tracking | `quiz_attempts` table: `id`, `user_id` (future), `score`, `total`, `time_taken`, `answers[]` |
| **Explanations** | Detailed explanation after each answer | Rendered via MarkdownRenderer |
| **Progress Tracking** | Per-topic accuracy stats | Aggregated from `quiz_attempts` |

**Flow:**
```
Public: /mcqs → browse MCQ categories/topics
         /mcqs/python → list Python MCQs
         /mcqs/practice?topic=python&count=10 → start practice session
         /mcqs/results → show score + review wrong answers

Admin: /admin/mcqs → CRUD for questions and explanations
```

---

### 9.2 User Authentication & Personalization

#### 9.2.1 Public User Accounts
Currently, only `admins` exist. Future scope includes public user registration.

| Feature | Description | Implementation |
|---|---|---|
| **User Registration** | Email + password signup | `users` table (extends current schema) |
| **Email Verification** | Verify email before activation | SendGrid / Resend integration |
| **OAuth Login** | GitHub, Google sign-in | OAuth2 providers via `authlib` |
| **User Profiles** | Avatar, bio, social links | Profile page at `/profile` |
| **Reading History** | Track recently viewed notes | `user_history` table |
| **Bookmarks** | Save favorite notes for quick access | `bookmarks` table (user_id + note_id) |
| **Progress Tracking** | Mark notes as "read" or "in-progress" | `user_progress` table |

**Flow:**
```
Public: /register → create account
         /login → authenticate
         /profile → view/edit profile
         /bookmarks → saved notes
         /history → recently viewed
```

---

### 9.3 Search & Discovery

#### 9.3.1 Global Search
| Feature | Description | Implementation |
|---|---|---|
| **Full-Text Search** | Search across notes, blogs, cheatsheets | PostgreSQL `tsvector` + GIN indexes |
| **Search Suggestions** | Auto-complete as user types | Debounced API call to `/api/v1/search/suggest?q=` |
| **Filters** | Filter by content type, topic, date | Query params: `?type=note&topic=python&sort=recent` |
| **Search Results Page** | `/search?q=async+await` | Unified results from all content types |
| **Highlighting** | Highlight matching terms in results | Backend returns match positions; frontend highlights |

**Flow:**
```
User types in navbar search → debounced GET /api/v1/search/suggest?q=...
User submits search → navigates to /search?q=...
  → Server fetches results from all content tables
  → Renders categorized results (Notes, Blogs, Cheatsheets)
```

---

### 9.4 AI-Powered Features

#### 9.4.1 AI Assistant / Chatbot
| Feature | Description | Implementation |
|---|---|---|
| **RAG Chatbot** | Answer questions using notes content as knowledge base | OpenAI / Claude API + vector embeddings |
| **Contextual Help** | "Ask about this note" button on note pages | Sends note content + user question to AI |
| **Code Explanation** | Explain code snippets in notes | AI generates human-readable explanations |
| **Quiz Generation** | Auto-generate MCQs from note content | AI creates questions + answers + explanations |

**Architecture:**
```
User Question
    ↓
Embedding Model (e.g., text-embedding-3-small)
    ↓
Vector Search (pgvector / Pinecone / Qdrant)
    ↓
Retrieve Top-K Relevant Notes
    ↓
LLM Prompt (system: "You are a coding tutor..." + context + question)
    ↓
Streamed Response to Frontend
```

**Data Model Additions:**
- `ai_conversations` table: `id`, `user_id`, `messages[]`, `created_at`
- `note_embeddings` table: `note_id`, `embedding_vector` (pgvector `vector(1536)`)

---

### 9.5 Community & Engagement

#### 9.5.1 Comments System
| Feature | Description | Data Model |
|---|---|---|
| **Nested Comments** | Threaded discussions on notes/blogs | `comments` table with `parent_id` (self-referential) |
| **Markdown Support** | Rich text comments with syntax highlighting | Same MarkdownRenderer component |
| **Moderation** | Admin approval for comments | `status` field: pending/approved/rejected |
| **Reactions** | Emoji reactions (👍 ❤️ 🎉 🔥) | `comment_reactions` table |

---

#### 9.5.2 Newsletter System
| Feature | Description | Implementation |
|---|---|---|
| **Subscription** | Email signup for weekly digest | `subscribers` table |
| **Auto-Digest** | Curated new content weekly | Cron job + email template |
| **Unsubscribe** | One-click unsubscribe | Token-based unsubscribe link |

---

### 9.6 Performance & Scalability

#### 9.6.1 Caching Layer
| Layer | Tool | Use Case |
|---|---|---|
| **API Response Cache** | Redis | Cache `GET /topics/`, `GET /notes/` for 5–15 min |
| **Page Cache** | Next.js ISR | Revalidate static pages every hour |
| **CDN** | Cloudflare / Vercel Edge | Static assets, images, fonts |
| **Database Query Cache** | SQLAlchemy + Redis | Cache expensive full-text search results |

#### 9.6.2 Background Tasks
| Task | Tool | Trigger |
|---|---|---|
| **Send Email** | Celery + Redis | User registration, newsletter, comment notifications |
| **Generate Embeddings** | Celery + OpenAI | After note/blog creation/update |
| **Sitemap Generation** | Cron job | Daily regeneration of `sitemap.xml` |
| **Analytics Aggregation** | Cron job | Daily rollup of view counts |

---

### 9.7 Analytics & Monitoring

#### 9.7.1 Content Analytics
| Metric | Source | Display |
|---|---|---|
| **View Count** | Increment on page load | Note/blog detail page |
| **Popular Content** | Aggregated views | Home page "Trending" section |
| **Search Analytics** | Log search queries | Admin dashboard insights |
| **User Engagement** | Time on page, scroll depth | Future: Google Analytics 4 / Plausible |

#### 9.7.2 System Monitoring
| Tool | Purpose |
|---|---|
| **Sentry** | Error tracking + performance monitoring |
| **Prometheus + Grafana** | Infrastructure metrics (CPU, memory, DB connections) |
| **UptimeRobot** | External uptime checks |
| **LogRocket / PostHog** | Session replay + product analytics (future) |

---

### 9.8 API Versioning & Evolution

#### 9.8.1 Version Strategy
```
Current: /api/v1/...
Future:  /api/v2/... (when breaking changes needed)
```

**Planned v2 Additions:**
- GraphQL endpoint (`/api/v2/graphql`) for flexible data fetching
- WebSocket support for real-time features (live comments, AI streaming)
- Bulk operations (`POST /api/v2/bulk/notes` for importing)

---

### 9.9 Mobile & PWA

#### 9.9.1 Progressive Web App
| Feature | Description |
|---|---|
| **Service Worker** | Offline reading of recently viewed notes |
| **App Manifest** | Installable on mobile home screens |
| **Push Notifications** | New content alerts (future) |
| **Offline Cache** | Cache visited notes via Workbox |

#### 9.9.2 Mobile App (Future)
- **React Native** or **Flutter** companion app
- Sync bookmarks and reading progress
- Push notifications for new content

---

### 9.10 Monetization & Sustainability

| Feature | Description | Implementation |
|---|---|---|
| **Sponsorship** | "Sponsor" button linking to GitHub Sponsors / Buy Me a Coffee | External link integration |
| **Premium Content** | Gated advanced tutorials | Stripe integration + `is_premium` flag on notes |
| **Ads (Optional)** | Ethical, developer-focused ads (Carbon Ads style) | Ad slot components |
| **Affiliate Links** | Recommended tools/books with affiliate tags | Markdown extension for affiliate links |

---

### 9.11 Development Roadmap Summary

| Phase | Timeline | Focus |
|---|---|---|
| **Phase 1: MVP** | Current | Notes, Topics, Admin panel, Basic auth |
| **Phase 2: Content** | Q3 2026 | Blogs, Cheatsheets, MCQs, Public user accounts |
| **Phase 3: Intelligence** | Q4 2026 | AI assistant, Search, Recommendations |
| **Phase 4: Community** | Q1 2027 | Comments, Newsletter, Social features |
| **Phase 5: Scale** | Q2 2027 | Redis caching, CDN, Background jobs, Monitoring |
| **Phase 6: Mobile** | Q3 2027 | PWA, Mobile app, Push notifications |

---

### 9.12 Architectural Evolution

```
Current (Monolith):
  Next.js Frontend ←→ FastAPI Backend ←→ PostgreSQL

Future (Scaled):
  Next.js Frontend
       ↓
  CDN (Vercel Edge / Cloudflare)
       ↓
  API Gateway (Rate limiting, Auth)
       ↓
  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │  FastAPI    │  │  AI Service │  │  Search     │
  │  (Core API) │  │  (Python)   │  │  Service    │
  └──────┬──────┘  └─────────────┘  └─────────────┘
         ↓
  ┌──────┴──────┐
  │  PostgreSQL │  ← Primary DB
  │  + pgvector │  ← Vector embeddings
  └─────────────┘
         ↓
  ┌─────────────┐
  │    Redis    │  ← Cache + Job Queue + Sessions
  └─────────────┘
         ↓
  ┌─────────────┐
  │   Celery    │  ← Background workers
  └─────────────┘
```

---

*End of Document*
