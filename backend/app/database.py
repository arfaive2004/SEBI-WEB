import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Allow overriding with a real Postgres/MySQL database in production via env var.
# Falls back to a local SQLite file for development.
# NOTE: on Vercel's serverless Python runtime the filesystem is ephemeral outside
# of /tmp, and /tmp itself is wiped between cold starts. SQLite works great for
# local dev and demos, but for durable multi-user data in production, set
# DATABASE_URL to a hosted Postgres instance (e.g. Neon, Supabase, Vercel Postgres).
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    db_dir = "/tmp" if os.environ.get("VERCEL") else os.path.dirname(os.path.abspath(__file__))
    DATABASE_URL = f"sqlite:///{db_dir}/brokerverse.db"

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
