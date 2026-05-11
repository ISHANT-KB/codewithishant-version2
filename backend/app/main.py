from fastapi import FastAPI

from app.routes import auth
from .db import engine, Base
from . import models
from .routes import topic, note
from app.routes import auth
from fastapi.middleware.cors import CORSMiddleware


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
