from fastapi import APIRouter, Depends, HTTPException
from app.routers.auth import get_current_user
from app.database import get_database
from app.services.pdf_service import generate_pdf_report
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/api", tags=["history"])

@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db["reports"].find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    reports = await cursor.to_list(length=100)
    for r in reports:
        r["id"] = str(r.pop("_id"))
    return reports

@router.get("/history/{report_id}")
async def get_report(report_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    report = await db["reports"].find_one({"_id": ObjectId(report_id), "user_id": str(current_user["_id"])})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report["id"] = str(report.pop("_id"))
    return report

@router.delete("/history/{report_id}")
async def delete_report(report_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    result = await db["reports"].delete_one({"_id": ObjectId(report_id), "user_id": str(current_user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Report deleted successfully"}

@router.get("/history/{report_id}/download")
async def download_report_pdf(report_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    report = await db["reports"].find_one({"_id": ObjectId(report_id), "user_id": str(current_user["_id"])})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    pdf_path = generate_pdf_report(report)
    return {"download_url": f"/{pdf_path}"}
