from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.connection import engine

from app.models.user import User
from app.models.ioc_history import IOCHistory

from app.api import ioc
from app.api import auth
from app.api import history
from app.api import dashboard
from app.api import threat_feed
from app.api import cve
from app.api import correlation

from app.auth.dependencies import get_current_user
from app.api import watchlist
from app.api import reports
from app.websocket import live_feed

# FASTAPI APP
app = FastAPI(
    title="Sentinel-X Backend"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CREATE DATABASE TABLES
Base.metadata.create_all(bind=engine)

print(Base.metadata.tables.keys())

# INCLUDE ROUTERS
app.include_router(ioc.router)
app.include_router(auth.router)
app.include_router(history.router)
app.include_router(dashboard.router)
app.include_router(threat_feed.router)
app.include_router(cve.router)
app.include_router(correlation.router)
app.include_router(watchlist.router) 
app.include_router(reports.router)
app.include_router( live_feed.router )

# HOME ROUTE
@app.get("/")
def home():
    return {
        "message": "Sentinel-X Backend Running"
    }

# PROFILE ROUTE
@app.get("/profile")
def profile(
    current_user: str = Depends(get_current_user)
):
    return {
        "username": current_user
    }