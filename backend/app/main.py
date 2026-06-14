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
from app.api import profile

# =====================================================
# ML TRIAGE — import at startup
# =====================================================
from app.services.ml_triage import get_triage_service

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
app.include_router(live_feed.router)
app.include_router(profile.router)


# =====================================================
# STARTUP — load ML model when server starts
# =====================================================
@app.on_event("startup")
async def startup_event():
    print("\n" + "="*50)
    print("  SENTINEL-X STARTUP")
    print("="*50)
    print("[STARTUP] Loading ML Triage Service...")

    try:
        svc = get_triage_service()
        print(f"[STARTUP] Model  : {'✅ Loaded' if svc._model  is not None else '❌ NOT LOADED'}")
        print(f"[STARTUP] Scaler : {'✅ Loaded' if svc._scaler is not None else '❌ NOT LOADED'}")
        print(f"[STARTUP] Features: {len(svc._feature_names)}")

        if svc._model is not None:
            # Quick sanity check
            import numpy as np
            test = np.zeros((1, len(svc._feature_names)), dtype=np.float32)
            test_s = svc._scaler.transform(test)
            prob = svc._model.predict_proba(test_s)[0][1]
            print(f"[STARTUP] Sanity check passed — test prob: {round(prob, 4)}")
            print("[STARTUP] ✅ ML pipeline ready\n")
        else:
            print("[STARTUP] ⚠️  Running on rule-based fallback\n")

    except Exception as e:
        print(f"[STARTUP] ❌ ML init error: {e}\n")

    print("="*50 + "\n")


# =====================================================
# HOME ROUTE
# =====================================================
@app.get("/")
def home():
    return {
        "message": "Sentinel-X Backend Running"
    }


# =====================================================
# PROFILE ROUTE
# =====================================================
@app.get("/profile")
def profile(
    current_user: str = Depends(get_current_user)
):
    return {
        "username": current_user
    }