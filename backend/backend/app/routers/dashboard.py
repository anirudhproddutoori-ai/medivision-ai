from fastapi import APIRouter, Depends
from app.routers.auth import get_current_user
from app.database import get_database

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = str(current_user["_id"])
    
    total_analyses = await db["reports"].count_documents({"user_id": user_id})
    
    cursor = db["reports"].find({"user_id": user_id}).sort("created_at", -1).limit(5)
    latest_reports = await cursor.to_list(length=5)
    for r in latest_reports:
        r["id"] = str(r.pop("_id"))
        
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {"_id": "$risk_level", "count": {"$sum": 1}}}
    ]
    risk_distribution_cursor = db["reports"].aggregate(pipeline)
    risk_distribution = {doc["_id"]: doc["count"] for doc in await risk_distribution_cursor.to_list(length=10) if doc.get("_id")}
    
    return {
        "total_analyses": total_analyses,
        "latest_reports": latest_reports,
        "risk_distribution": risk_distribution
    }
