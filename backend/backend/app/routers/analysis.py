from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.routers.auth import get_current_user
from app.utils.file_handler import save_upload_file
from app.services.ai_service import ai_service
from app.database import get_database
from datetime import datetime
import os
import pdf2image
import pytesseract

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


def extract_text_from_pdf(file_path: str) -> str:
    try:
        images = pdf2image.convert_from_path(file_path)

        text = ""

        for img in images:
            text += pytesseract.image_to_string(img)

        if not text.strip():
            return "No readable text was found in the PDF."

        return text

    except Exception as e:
        return f"Failed to extract text from PDF: {str(e)}"


@router.post("/report")
async def analyze_report(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported for report analysis"
        )

    file_path = save_upload_file(file)

    text = extract_text_from_pdf(file_path)

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from the PDF"
        )

    analysis_result = ai_service.analyze_medical_text(text)

    if "error" in analysis_result:
        raise HTTPException(
            status_code=500,
            detail=analysis_result.get("error")
        )

    db = get_database()

    report_doc = {
        "user_id": str(current_user["_id"]),
        "file_url": file_path,
        "file_name": file.filename,
        "type": "report",
        "created_at": datetime.utcnow(),
        **analysis_result
    }

    result = await db["reports"].insert_one(report_doc)

    report_doc["_id"] = str(result.inserted_id)

    return report_doc


@router.post("/image")
async def analyze_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    valid_extensions = (
        ".png",
        ".jpg",
        ".jpeg",
        ".dcm"
    )

    filename = file.filename.lower()

    if not filename.endswith(valid_extensions):
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format. Use PNG, JPG, JPEG, or DICOM."
        )

    file_path = save_upload_file(file)

    analysis_result = ai_service.analyze_medical_image(file_path)

    if "error" in analysis_result:
        raise HTTPException(
            status_code=500,
            detail=analysis_result.get("error")
        )

    db = get_database()

    report_doc = {
        "user_id": str(current_user["_id"]),
        "file_url": file_path,
        "file_name": file.filename,
        "type": "image",
        "created_at": datetime.utcnow(),
        **analysis_result
    }

    result = await db["reports"].insert_one(report_doc)

    report_doc["_id"] = str(result.inserted_id)

    return report_doc