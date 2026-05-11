from app.db import Base, SessionLocal, engine
from app.models.admin import Admin
from app.lib.security import hash_password

db = SessionLocal()

email = "codewithishant.work@gmail.com"
password = "Ishant@1968"

Base.metadata.create_all(bind=engine)

try:
    hashed_pwd = hash_password(password)
    admin = Admin(email=email, password=hashed_pwd)
    db.add(admin)
    db.commit()
    print("Admin created successfully")
finally:
    db.close()
