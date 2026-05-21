"""
Sanitize user-supplied content before saving to DB.
Uses bleach to strip dangerous HTML/JS from markdown fields.
"""
import bleach
import re

# tags allowed in rendered markdown
ALLOWED_TAGS = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "strong", "em", "del", "code", "pre", "blockquote",
    "ul", "ol", "li",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
    "div", "span",
]

ALLOWED_ATTRS = {
    "a":   ["href", "title", "rel"],
    "img": ["src", "alt", "title"],
    "*":   ["class"],               # for syntax highlighting classes
}

# force external links to open safely
ALLOWED_PROTOCOLS = ["http", "https", "mailto"]


def sanitize_markdown(content: str) -> str:
    """Strip XSS vectors from markdown/HTML content."""
    if not content:
        return content

    cleaned = bleach.clean(
        content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRS,
        protocols=ALLOWED_PROTOCOLS,
        strip=True,
    )

    # add rel=noopener to all links (bleach linkify doesn't always catch these)
    cleaned = re.sub(
        r'<a\s+(?!.*rel=)',
        '<a rel="noopener noreferrer" ',
        cleaned,
    )

    return cleaned


def sanitize_plain(text: str) -> str:
    """Strip ALL html — for title/slug fields."""
    return bleach.clean(text, tags=[], attributes={}, strip=True).strip()