from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ===== USER SCHEMAS =====

class UserBase(BaseModel):
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ===== PLAN SCHEMAS =====

class PlanBase(BaseModel):
    nombre: str
    descripcion: str
    duracion_minutos: int
    link: Optional[str] = None

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    duracion_minutos: Optional[int] = None
    link: Optional[str] = None

class PlanResponse(PlanBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ===== BOOKING SCHEMAS =====

class BookingBase(BaseModel):
    plan_id: int
    fecha: datetime
    hora_inicio: str

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    creado_por: int
    created_at: datetime
    plan: PlanResponse
    
    class Config:
        from_attributes = True

# ===== TOKEN SCHEMA =====

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# ===== MESSAGE SCHEMAS =====

class MessageResponse(BaseModel):
    id: int
    category: str
    content: str
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ===== ALBUM SCHEMAS =====

class AlbumEntryCreate(BaseModel):
    type: str          # "mensaje" | "foto"
    title: str
    content: Optional[str] = None
    date_label: Optional[str] = None
    image_url: Optional[str] = None   # para URLs directas (entries legacy)

class AlbumEntryResponse(BaseModel):
    id: int
    type: str
    title: str
    content: Optional[str] = None
    image_url: Optional[str] = None   # signed URL o URL directa ya resuelta
    date_label: Optional[str] = None
    created_by_role: str              # "lalo" | "mariana"
    created_at: datetime

    class Config:
        from_attributes = True
