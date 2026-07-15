import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal
from app.seed import seed_demo_data
from app.routers import auth, dashboard, kyc, clients, funds, margin, watchdog

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    seed_demo_data(db)

app = FastAPI(title="BrokerVerse API")

cors_origins_env = os.environ.get("CORS_ORIGINS", "*")
origins = [o.strip() for o in cors_origins_env.split(",")] if cors_origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(kyc.router)
app.include_router(clients.router)
app.include_router(funds.router)
app.include_router(margin.router)
app.include_router(watchdog.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "BrokerVerse API"}


@app.get("/")
def root():
    return {"message": "BrokerVerse API is running. See /docs for the API reference."}
