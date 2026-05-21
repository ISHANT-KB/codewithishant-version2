import uuid
from fastapi import APIRouter, HTTPException, Depends, Response, Cookie, Request
from sqlalchemy.orm import Session
from jose import JWTError
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.session import get_db
from app.models.admin import Admin
from app.models.token_blacklist import TokenBlacklist
from app.core.security import verify_password
from app.core.csrf import generate_csrf_token
from app.core.jwt import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    decode_refresh_token,
)
from app.schemas.admin import AdminLogin
from app.config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# ── login — 5 attempts/minute per IP ─────────────────────────────────────────

@router.post("/admin-login")
@limiter.limit("5/minute")
def admin_login(request: Request, data: AdminLogin, response: Response, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == data.email).first()

    # same error both cases → no user enumeration
    if not admin or not verify_password(data.password, str(admin.password)):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not admin.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    jti = str(uuid.uuid4())
    access_token  = create_access_token({"sub": admin.email, "role": "admin", "jti": jti})
    refresh_token = create_refresh_token({"sub": admin.email, "role": "admin"})

    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=15 * 60,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=7 * 24 * 3600,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(
        key="csrf_token",
        value=generate_csrf_token(),
        max_age=15 * 60,
        httponly=False,                  # JS must read this
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    return {"message": "Login successful"}   # NO token in body


# ── refresh — 20/minute ───────────────────────────────────────────────────────

@router.post("/refresh")
@limiter.limit("20/minute")
def refresh(
    request: Request,
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    try:
        payload = decode_refresh_token(refresh_token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    jti = str(uuid.uuid4())
    new_access = create_access_token({
        "sub": payload["sub"], "role": payload["role"], "jti": jti
    })
    response.set_cookie(
        key="access_token",
        value=new_access,
        max_age=15 * 60,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(
        key="csrf_token",
        value=generate_csrf_token(),
        max_age=15 * 60,
        httponly=False,                  # JS must read this
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )
    return {"message": "Token refreshed"}


# ── logout ────────────────────────────────────────────────────────────────────

@router.post("/logout")
def logout(
    response: Response,
    access_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    if access_token:
        try:
            payload = decode_access_token(access_token)
            jti = payload.get("jti")
            if jti:
                db.add(TokenBlacklist(jti=jti))
                db.commit()
        except JWTError:
            pass  # already invalid, still clear cookies

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    response.delete_cookie("csrf_token")
    return {"message": "Logged out"}