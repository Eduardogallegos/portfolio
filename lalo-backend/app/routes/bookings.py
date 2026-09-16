from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import User, Booking, Plan
from app.schemas import BookingCreate, BookingResponse
from app.middleware.auth import get_current_user
from typing import List

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.get("", response_model=List[BookingResponse])
async def list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener todos los bookings (ambos pueden ver)"""
    bookings = db.query(Booking).all()
    return bookings

@router.post("", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Agendar un date (solo la pareja puede)"""
    
    # Validación 1: ¿Es la pareja?
    if current_user.role != "pareja":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo la pareja puede agendar dates"
        )
    
    # Validación 2: ¿El plan existe?
    plan = db.query(Plan).filter(Plan.id == booking_data.plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan no encontrado"
        )
    
    # Validación 3: ¿La fecha es futura?
    if booking_data.fecha <= datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La fecha debe ser en el futuro"
        )
    
    # Validación 4: Validar formato de hora (HH:MM)
    try:
        datetime.strptime(booking_data.hora_inicio, "%H:%M")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de hora inválido. Use HH:MM"
        )
    
    # Crear booking
    new_booking = Booking(
        plan_id=booking_data.plan_id,
        fecha=booking_data.fecha,
        hora_inicio=booking_data.hora_inicio,
        creado_por=current_user.id
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener detalles de un booking específico"""
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking no encontrado"
        )
    
    return booking
