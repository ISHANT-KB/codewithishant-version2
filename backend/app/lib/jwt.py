from jose import jwt
from datetime import datetime, timedelta
from app.config import JWT_SECRET, JWT_ALGORITHM

def create_access_token(data: dict, expires_minutes: int = 120):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)