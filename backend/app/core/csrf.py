import secrets
import hmac

def generate_csrf_token() -> str:
    return secrets.token_urlsafe(32)

def verify_csrf_token(cookie_token: str, header_token: str) -> bool:
    return hmac.compare_digest(cookie_token, header_token)