from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import JWT_SECRET, JWT_ALGORITHM

security = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        role = payload.get("role")

        if role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")