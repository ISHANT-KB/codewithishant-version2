from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.admin import Admin
from app.lib.security import verify_password
from app.lib.jwt import create_access_token
from app.schemas.admin import AdminLogin

router = APIRouter()

@router.post("/admin-login")


def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    email = data.email
    password = data.password

    admin = db.query(Admin).filter(Admin.email == email).first()

    if not admin:
        raise HTTPException(status_code=403, detail="Only admin login allowed")

    if not verify_password(password, str(admin.password)):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": admin.email,
        "role": "admin"
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }