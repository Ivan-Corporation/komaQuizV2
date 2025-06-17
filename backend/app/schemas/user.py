from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Dict, Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    created_at: datetime
    experience_points: int
    achievements: List[str]
    level: int
    topic_experience: Dict[str, int]
    wallet_address: Optional[str]
    
    class Config:
        orm_mode = True


class WalletConnectRequest(BaseModel):
    wallet_address: Optional[str]