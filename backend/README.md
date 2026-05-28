# Backend (FastAPI)

FastAPI + SQLAlchemy backend for **CodeWithIshant v2**.

- Public APIs: `Topics`, `Notes`
- Admin APIs: `admin auth` (JWT) + CRUD for Topics/Notes (and other resources like Blogs/Cheatsheets)
- Security: input sanitization, JWT auth, CSRF protection for state-changing requests, rate limiting (optionally Redis)

---

## Local Development

### 1) Prerequisites

- Python 3.11+
- PostgreSQL
- (Optional) Redis for production-like rate limiting

### 2) Configure environment

Create `backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME
JWT_SECRET=replace-with-strong-secret
# optional
JWT_ALGORITHM=HS256
REDIS_URL=redis://localhost:6379
```

> Note: `JWT_SECRET` and `DATABASE_URL` are required. The backend reads them from `backend/.env` (via `pydantic_settings`).

### 3) Setup & run

From `backend/`:

```powershell
python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend default URL:

- `http://localhost:8000`

The backend auto-creates tables on startup via:

- `Base.metadata.create_all(bind=engine)`

So migrations are optional for dev.

---

## API Base Paths

FastAPI routers are mounted in `backend/app/main.py`.

- Topics router: mounted under `/topics`
- Notes router: mounted under `/notes`
- Cheatsheets router: mounted under `/cheatsheets`
- Auth routes: mounted under `/api/auth`
- Blogs & Audit: mounted under `/api`

Server root:

- `GET /` → `{ "message": "Backend running" }`


---

## Auth (Admin)

Admin authentication uses JWT.

- Admin-only routes require header:

```http
Authorization: Bearer <access_token>
```

Admin login route is mounted from `app/api/v1/auth.py` (prefix `/api/auth`).

If CSRF is enabled for write routes, requests also require a CSRF double-submit token (handled by `require_csrf` in `app/api/deps.py`).

---

## Rate Limiting

Implemented via `slowapi`.

- If `REDIS_URL` is set: Redis-backed limiter (prod-like)
- Otherwise: in-memory limiter (dev fallback)

Default:

- `200/minute`

---

## Security Notes

- **Input sanitization**:
  - markdown and plain text inputs are sanitized in resource routers (see `app/core/sanitize.py`).
- **CSRF protection**:
  - write operations use `dependencies=[Depends(require_csrf)]`.
- **JWT blacklist + cleanup**:
  - expired blacklisted tokens are purged every 24 hours (and once on startup).

---

## Database / Models

- SQLAlchemy ORM models live in `backend/app/models/`
- DB session lifecycle is handled in `backend/app/db/session.py` (`get_db()` yields a per-request session).

Migrations:

- Alembic is configured (`backend/alembic.ini`, `backend/alembic/env.py`), but the backend currently uses `create_all` on startup.

---

## Hosting Notes

Production deployment uses Nginx + (optionally) Redis.

Redis suggestion:

- Local: `redis://localhost:6379`
- Upstash example: `rediss://:<password>@<host>:6380`

---

## Useful Files

- `backend/app/main.py` — FastAPI app, CORS, middleware, router registration
- `backend/app/config.py` — required env vars
- `backend/app/api/` — API routers
- `backend/app/services/` — service-layer business logic
- `backend/app/core/` — JWT, sanitization, CSRF, security utilities
- `backend/app/db/` — engine + session

