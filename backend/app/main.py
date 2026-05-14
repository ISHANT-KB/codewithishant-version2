from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, note, topic
from app.db.session import Base, engine
from app import models


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Create tables in PostgreSQL
Base.metadata.create_all(bind=engine)

app.include_router(topic.router)
app.include_router(note.router)
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])


@app.get("/")
def root():
    return {"message": "Backend running"}
