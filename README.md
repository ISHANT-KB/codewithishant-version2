# CodeWithIshant v2

Monorepo for learning/content platform with:

- `frontend/`: Next.js 16 + React 19 public site and admin UI
- `backend/`: FastAPI + SQLAlchemy API for topics, notes, and admin auth
- PostgreSQL as primary database

Public side shows topics and notes. Admin side manages topics and notes behind JWT-based login.

## Features

- Public topic listing
- Topic detail page with note list
- Admin login with bearer token
- Topic CRUD
- Note CRUD
- Auto-generated topic slugs
- Parent-topic validation to prevent invalid nesting
- Tables auto-created on backend startup

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Pydantic, bcrypt, python-jose
- Database: PostgreSQL

## Project Structure

```text
codewithishant-v2/
|- frontend/   # Next.js app
|- backend/    # FastAPI app
`- README.md
```

Important backend areas:

- `backend/app/main.py`: FastAPI app, CORS, router registration
- `backend/app/routes/`: auth, topics, notes
- `backend/app/models/`: SQLAlchemy models
- `backend/scripts/create_admin.py`: one-off admin bootstrap script

Important frontend areas:

- `frontend/app/page.tsx`: public home page
- `frontend/app/topics/[slug]/page.tsx`: topic detail page
- `frontend/app/admin/`: admin dashboard, login, notes, topics
- `frontend/lib/api.ts`: public API client

## Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL

## Environment Variables

### Backend

Create `backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME
JWT_SECRET=replace-with-strong-secret
```

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Run Locally

### 1. Start backend

From `backend/`:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary python-dotenv "python-jose[cryptography]" bcrypt email-validator
uvicorn app.main:app --reload
```

Backend default URL:

```text
http://localhost:8000
```

### 2. Start frontend

From `frontend/`:

```powershell
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:3000
```

## Admin Bootstrap

**Warning:** `backend/scripts/create_admin.py` currently contains hardcoded credentials. Change them before running this script, or refactor the script to read from environment variables.

After updating credentials, run:

```powershell
cd backend
.venv\Scripts\activate
python scripts/create_admin.py
```

Then open:

```text
http://localhost:3000/admin/login
```

## API Overview

Auth:

- `POST /api/auth/admin-login`

Topics:

- `GET /topics`
- `POST /topics`
- `GET /topics/{slug}`
- `GET /topics/{slug}/notes`
- `GET /topics/{slug}/full`
- `PUT /topics/{topic_id}`
- `DELETE /topics/{topic_id}`

Notes:

- `GET /notes`
- `POST /notes`
- `PUT /notes/{note_id}`
- `DELETE /notes/{note_id}`

Admin-only routes require:

```text
Authorization: Bearer <token>
```

## Current Behavior / Caveats

- Backend creates tables on startup via `Base.metadata.create_all(...)`. No migration system yet.
- `backend/requirements.txt` is not populated with real dependencies right now.
- Some admin frontend pages use hardcoded backend URLs like `http://127.0.0.1:8000` instead of shared env config.
- CORS currently allows all origins.
- Admin dashboard has placeholder routes for blogs and cheatsheets.

## Suggested Next Improvements

- Add proper `backend/requirements.txt`
- Add Alembic migrations
- Move admin bootstrap credentials to env vars
- Replace hardcoded frontend API URLs with shared config
- Tighten CORS for production
- Add tests for auth, topic tree validation, and note CRUD
