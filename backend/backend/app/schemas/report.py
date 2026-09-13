from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReportBase(BaseModel):
    patient_name: Optional[str] = None
    test_type: Optional[str] = None
    summary: str
    findings: List[str] = []
    risk_level: str
    recommendations: List[str] = []

class ReportCreate(ReportBase):
    user_id: str
    file_url: str

class ReportInDB(ReportBase):
    id: str
    user_id: str
    file_url: str
    created_at: datetime
    confidence_score: float = 0.0

class ImageAnalysisResponse(BaseModel):
    annotated_image_url: str
    summary: str
    risk_level: str
    recommendations: List[str]
    confidence: float
