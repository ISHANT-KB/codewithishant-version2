"""
Manage admin account (create/delete) from one CLI flow.
Usage (from repo root):
    backend/.venv/Scripts/python.exe scripts/create_admin.py
"""
import sys
from getpass import getpass
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = PROJECT_ROOT / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.core.security import hash_password, verify_password
from app.db.session import SessionLocal
from app.models.admin import Admin


def prompt_operation() -> str:
    while True:
        operation = input("Choose operation (create/delete): ").strip().lower()
        if operation in {"create", "delete"}:
            return operation
        print("Invalid choice. Type 'create' or 'delete'.")


def create_admin(db, email: str, password: str) -> int:
    existing = db.query(Admin).filter(Admin.email == email).first()
    if existing:
        print(f"Admin already exists: {email}")
        return 0

    admin = Admin(email=email, password=hash_password(password))
    db.add(admin)
    db.commit()
    print(f"[OK] Admin created: {email}")
    return 0


def delete_admin(db, email: str, password: str) -> int:
    admin = db.query(Admin).filter(Admin.email == email).first()
    if not admin:
        print(f"Admin not found: {email}")
        return 0

    if not verify_password(password, admin.password):
        print("Password mismatch. Admin not deleted.")
        return 1

    db.delete(admin)
    db.commit()
    print(f"[OK] Admin deleted: {email}")
    return 0


def main() -> int:
    operation = prompt_operation()
    email = input("Email: ").strip()
    password = getpass("Password: ")

    if not email or not password:
        print("Email and password are required.")
        return 2

    db = SessionLocal()
    try:
        if operation == "create":
            return create_admin(db, email, password)
        return delete_admin(db, email, password)
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
