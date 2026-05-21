from app.db.session import Base  # noqa: F401

# Import all models here so Alembic autogenerate detects them
from app.models.admin import Admin  # noqa: F401
from app.models.topic import Topic  # noqa: F401
from app.models.note import Note  # noqa: F401
from app.models.cheatsheet import Cheatsheet  # noqa: F401
# from app.models.blog import Blog  # noqa: F401
from app.models.token_blacklist import TokenBlacklist  # noqa: F401