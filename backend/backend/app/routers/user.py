from fastapi import APIRouter, Depends, HTTPException
from app.routers.auth import get_current_user
from app.schemas.user import UserUpdate, UserInDB
from app.database import get_database
from app.core.security import get_password_hash

router = APIRouter(prefix="/api/user", tags=["user"])


def build_user_response(user: dict):
    return {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "full_name": user.get("full_name"),
        "is_active": user.get("is_active", True),
        "created_at": user.get("created_at"),

        # Personal information
        "phone": user.get("phone"),
        "address": user.get("address"),
        "age": user.get("age"),
        "gender": user.get("gender"),
        "blood_group": user.get("blood_group"),

        # Medical information
        "allergies": user.get("allergies", []),
        "medical_conditions": user.get(
            "medical_conditions", []
        ),
    }


@router.get("/profile")
async def get_profile(
    current_user: dict = Depends(get_current_user)
):
    return build_user_response(current_user)


@router.put("/profile")
async def update_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()

    update_data = {
        k: v
        for k, v in user_update.dict().items()
        if v is not None
    }

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(
            update_data.pop("password")
        )

    if update_data:
        await db["users"].update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data}
        )

    updated_user = await db["users"].find_one(
        {"_id": current_user["_id"]}
    )

    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return build_user_response(updated_user)


@router.delete("/profile")
async def delete_profile(
    current_user: dict = Depends(get_current_user)
):
    db = get_database()

    await db["users"].delete_one(
        {"_id": current_user["_id"]}
    )

    return {
        "message": "User deleted successfully"
    }