from fastapi import APIRouter, Depends, HTTPException
from app.routers.auth import get_current_user
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import ai_service
from app.database import get_database
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    db = get_database()
    session_id = request.session_id or str(uuid.uuid4())
    
    history_cursor = db["chat_history"].find({"session_id": session_id}).sort("timestamp", 1)
    history = await history_cursor.to_list(length=100)
    
    formatted_history = [{"role": msg["role"], "content": msg["content"]} for msg in history]
    
    try:
        response_text = ai_service.chat_with_context(formatted_history, request.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate AI response")
        
    user_msg = {
        "session_id": session_id,
        "user_id": str(current_user["_id"]),
        "role": "user",
        "content": request.message,
        "timestamp": datetime.utcnow()
    }
    ai_msg = {
        "session_id": session_id,
        "user_id": str(current_user["_id"]),
        "role": "model",
        "content": response_text,
        "timestamp": datetime.utcnow()
    }
    
    await db["chat_history"].insert_many([user_msg, ai_msg])
    
    return ChatResponse(response=response_text, session_id=session_id)
