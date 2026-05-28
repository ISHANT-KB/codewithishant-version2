# Frontend (Next.js)

Next.js App Router frontend for **CodeWithIshant v2**.

- Public site: Topics, Notes, Blogs, Cheatsheets
- Admin UI: login + content management screens (JWT protected)

---

## Prerequisites

- Node.js 20+
- npm

---

## Setup

From `frontend/`:

```bash
npm install
```

### Environment variables

Create `frontend/.env.local` (used by Next.js build/runtime):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Run locally

```bash
npm run dev
```

Open:

- `http://localhost:3000`

---

## Admin Login

Admin login uses the backend JWT auth.

After login, API calls from admin screens include the access token in the `Authorization` header.

Admin UI routes are under:

- `frontend/app/(admin)/...`

---

## Key Frontend Files

- `frontend/app/layout.tsx` — root layout
- `frontend/middleware.ts` — route protection / redirects
- `frontend/lib/api/` — typed API client utilities (notes, topics, auth, etc.)
- `frontend/app/(public)/...` — public pages
- `frontend/app/(admin)/...` — admin pages

---

## Notes / Caveats

- Some admin pages may reference backend URLs directly if not using shared env helpers. Prefer `NEXT_PUBLIC_API_URL`.

