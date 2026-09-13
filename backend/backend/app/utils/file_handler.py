import os
import shutil
import uuid
from fastapi import UploadFile
from app.config import settings

def save_upload_file(upload_file: UploadFile, folder: str = settings.UPLOAD_FOLDER) -> str:
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    extension = os.path.splitext(upload_file.filename)[1]
    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(folder, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    return file_path
