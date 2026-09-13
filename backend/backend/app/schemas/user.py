from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    # Personal information
    age: Optional[int] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None

    # Medical information
    allergies: Optional[List[str]] = None
    medical_conditions: Optional[List[str]] = None


class UserInDB(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime

    # Personal information
    age: Optional[int] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None

    # Medical information
    allergies: List[str] = []
    medical_conditions: List[str] = []


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None