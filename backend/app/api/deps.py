from fastapi import Depends, HTTPException, Cookie, Header, Request
from jose import JWTError
from app.core.jwt import decode_token
from app.core.csrf import verify_csrf_token
from app.db.session import get_db
from app.models.token_blacklist import TokenBlacklist
from sqlalchemy.orm import Session

# ── cookie-based extraction (no more Bearer header) ──────────────────────────

def get_current_admin(
    access_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # check token not revoked
    jti = payload.get("jti")
    if jti and db.query(TokenBlacklist).filter_by(jti=jti).first():
        raise HTTPException(status_code=401, detail="Token revoked")

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Wrong token type")

    return payload


# ── CSRF double-submit cookie check ──────────────────────────────────────────

def require_csrf(
    csrf_cookie: str | None = Cookie(default=None, alias="csrf_token"),
    x_csrf_token: str | None = Header(default=None, alias="x-csrf-token"),
) -> None:
    if not csrf_cookie or not x_csrf_token:
        raise HTTPException(status_code=403, detail="CSRF token missing")
    if not verify_csrf_token(csrf_cookie, x_csrf_token):
        raise HTTPException(status_code=403, detail="CSRF token invalid")


# ── extract admin email from token payload ────────────────────────────────────

def get_admin_email(payload: dict = Depends(get_current_admin)) -> str:
    return payload.get("sub", "unknown")