from fastapi import Depends, HTTPException, Cookie
from jose import JWTError
from app.core.jwt import decode_token
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