from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.config import settings

from app.routers import auth, user, analysis, chat, history, dashboard

app = FastAPI(
    title="MediVision AI Backend",
    description="Production-ready AI healthcare platform backend",
    version="1.0.0"
)

origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(analysis.router)
app.include_router(chat.router)
app.include_router(history.router)
app.include_router(dashboard.router)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
