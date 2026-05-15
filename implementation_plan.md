# Cheatsheets Feature — Full End-to-End Implementation

## Overview

**CodeWithIshant (IshantLearn)** is an educational platform with Notes, Topics, and an Algorithm Visualizer already working. The PRD lists **Cheat Sheets** as a core MVP feature, but the public `/cheatsheets` route is an **empty directory** and the admin page is just a placeholder. This plan implements the complete Cheatsheets system — backend API, admin CRUD, and public-facing pages — following existing patterns exactly.

---

## Proposed Changes

### Backend — New Cheatsheet Resource

Follows the exact same pattern as `Note` / `Topic`.

#### [NEW] `backend/app/models/cheatsheet.py`
- SQLAlchemy model: `id` (UUID PK), `title` (String), `slug` (String unique), `category` (String), `description` (Text, nullable), `content` (Text — Markdown body of the cheatsheet)

#### [MODIFY] `backend/app/models/__init__.py`
- Import `Cheatsheet` so SQLAlchemy picks it up for `Base.metadata.create_all`

#### [NEW] `backend/app/schemas/cheatsheet.py`
- Pydantic schemas: `CheatsheetCreate`, `CheatsheetUpdate`, `CheatsheetResponse`

#### [NEW] `backend/app/services/cheatsheet.py`
- CRUD service functions: `create`, `get_all`, `get_by_slug`, `update`, `delete`

#### [NEW] `backend/app/api/v1/cheatsheet.py`
- FastAPI `APIRouter` with:
  - `GET /cheatsheets/` — public, list all
  - `GET /cheatsheets/{slug}` — public, get one
  - `POST /cheatsheets/` — admin only
  - `PUT /cheatsheets/{slug}` — admin only
  - `DELETE /cheatsheets/{slug}` — admin only

#### [MODIFY] `backend/app/main.py`
- Import and register `cheatsheet.router`

---

### Frontend — Types & API Utilities

#### [NEW] `frontend/types/cheatsheet.ts`
- `Cheatsheet` interface: `id`, `title`, `slug`, `category`, `description`, `content`

#### [NEW] `frontend/lib/api/cheatsheets.ts`
- `getCheatsheets()` — fetch all
- `getCheatsheet(slug)` — fetch one by slug

#### [MODIFY] `frontend/lib/api/index.ts`
- Re-export cheatsheet functions

---

### Frontend — Public Pages

#### [NEW] `frontend/app/(public)/cheatsheets/page.tsx`
- Server component: fetches all cheatsheets, renders a beautiful editorial grid with category badges, matching the existing `parchment/gold/ink` design system (same aesthetic as Topics/Notes pages)

#### [NEW] `frontend/app/(public)/cheatsheets/[slug]/page.tsx`
- Server component: fetches single cheatsheet, renders full Markdown content with syntax highlighting (already imported via `katex` in globals — project likely has a markdown renderer too)

#### [NEW] `frontend/components/features/cheatsheets/CheatsheetCard.tsx`
- Card component used on the listing page, following `TopicCard` pattern

---

### Frontend — Admin Page

#### [MODIFY] `frontend/app/(admin)/admin/cheatsheet/page.tsx`
- Replace the current placeholder with a **full CRUD admin page** matching the dark `admin-input` design from the Notes/Topics admin pages:
  - List all cheatsheets
  - Create form (title, slug, category, description, content textarea)
  - Edit in-place
  - Delete with confirmation

#### [MODIFY] `frontend/components/layout/Navbar.tsx`
- Add **Cheatsheets** link to the navbar nav links array

---

## Verification Plan

### Automated
- Restart the FastAPI backend — `Base.metadata.create_all` will auto-create the `cheatsheets` table
- Run `npm run dev` in the frontend and navigate to `/cheatsheets`

### Manual
1. Backend: `GET http://localhost:8000/cheatsheets/` returns `[]`
2. Admin: log in → `/admin/cheatsheet` → create a cheatsheet
3. Public: `/cheatsheets` shows the card; clicking navigates to `/cheatsheets/{slug}` with content rendered

> [!NOTE]
> No migration tooling is set up (the project uses `create_all`), so the new table will be created automatically on next backend restart.
