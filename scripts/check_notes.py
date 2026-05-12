import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to sys.path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import DATABASE_URL
from app.models.note import Note

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_notes():
    db = SessionLocal()
    try:
        notes = db.query(Note).all()
        print(f"Total notes: {len(notes)}")
        for note in notes:
            print(f"ID: {note.id}, Title: {note.title}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_notes()
