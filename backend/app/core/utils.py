import re

def generate_slug(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)  # remove special chars
    text = re.sub(r'\s+', '-', text)          # spaces → hyphen
    text = re.sub(r'-+', '-', text)           # remove duplicate hyphens
    return text.strip('-')