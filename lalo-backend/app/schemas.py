from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ===== USER SCHEMAS =====

class UserBase(BaseModel):
    email: EmailStr
    role: str  # "lalo" o "pareja"

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

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    duracion_minutos: Optional[int] = None

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
    hora_inicio: str  # Formato "HH:MM"

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    creado_por: int
    created_at: datetime
    plan: PlanResponse  # Incluir info del plan
    
    class Config:
        from_attributes = True

# ===== TOKEN SCHEMA =====

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
