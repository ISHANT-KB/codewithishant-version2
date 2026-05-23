from datetime import datetime, timezone, timedelta

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

from app.api.v1 import auth, note, topic, cheatsheet, blog, audit
from app.db.session import Base, engine, SessionLocal
from app.models.token_blacklist import TokenBlacklist
from app.config import settings
from app import models

# ── rate limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI()

app.state.limiter = limiter


def rate_limit_exception_handler(request: Request, exc: Exception) -> Response:
    if isinstance(exc, RateLimitExceeded):
        return _rate_limit_exceeded_handler(request, exc)
    raise exc


app.add_exception_handler(RateLimitExceeded, rate_limit_exception_handler)
app.add_middleware(SlowAPIMiddleware)

# ── request size limit ────────────────────────────────────────────────────────
MAX_UPLOAD_SIZE = 2 * 1024 * 1024  # 2 MB

class LimitRequestSizeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_UPLOAD_SIZE:
            return Response(
                content='{"detail": "Request body too large. Max 2MB."}',
                status_code=413,
                media_type="application/json",
            )
        return await call_next(request)

app.add_middleware(LimitRequestSizeMiddleware)

# ── CORS — strict, no wildcard ────────────────────────────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://codewithishant.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "x-csrf-token"],
)

# ── DB ────────────────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── routers ───────────────────────────────────────────────────────────────────
app.include_router(topic.router)
app.include_router(note.router)
app.include_router(cheatsheet.router)
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(blog.router, prefix="/api", tags=["Blogs"])
app.include_router(audit.router, prefix="/api", tags=["Audit"])


# ── blacklist cron ────────────────────────────────────────────────────────────
def purge_expired_jtis() -> None:
    """Delete blacklisted JTIs whose expires_at has passed."""
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        deleted = (
            db.query(TokenBlacklist)
            .filter(TokenBlacklist.expires_at < now)
            .delete(synchronize_session=False)
        )
        db.commit()
        if deleted:
            print(f"[cron] purged {deleted} expired JTI(s)")
    except Exception as e:
        db.rollback()
        print(f"[cron] purge failed: {e}")
    finally:
        db.close()


scheduler = BackgroundScheduler(timezone="UTC")
scheduler.add_job(purge_expired_jtis, trigger="interval", hours=24, id="purge_jtis")


@app.on_event("startup")
def startup() -> None:
    scheduler.start()
    purge_expired_jtis()  # run once immediately on boot


@app.on_event("shutdown")
def shutdown() -> None:
    scheduler.shutdown(wait=False)


@app.get("/")
def root():
    return {"message": "Backend running"}