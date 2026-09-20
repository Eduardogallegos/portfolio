from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime
import io
from icalendar import Calendar, Event
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

@router.get("/export/ical")
async def export_ical(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Exportar bookings como archivo iCalendar (.ics)"""
    
    bookings = db.query(Booking).all()
    
    # Crear calendario
    cal = Calendar()
    cal.add('prodid', '-//Date Booking//Lalo//EN')
    cal.add('version', '2.0')
    cal.add('calscale', 'GREGORIAN')
    cal.add('method', 'PUBLISH')
    cal.add('x-wr-calname', '💕 Dates - Lalo & Pareja')
    cal.add('x-wr-timezone', 'UTC')
    
    # Agregar eventos
    for booking in bookings:
        event = Event()
        event.add('summary', f"💕 {booking.plan.nombre}")
        event.add('description', booking.plan.descripcion)
        event.add('dtstart', booking.fecha)
        event.add('duration', f"PT{booking.plan.duracion_minutos}M")
        event.add('location', 'Our Special Date')
        event.add('uid', f"{booking.id}@datebooking.local")
        event.add('dtstamp', datetime.utcnow())
        
        cal.add_component(event)
    
    # Generar archivo
    ics_content = cal.to_ical()
    
    return FileResponse(
        io.BytesIO(ics_content),
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=dates.ics"}
    )

@router.get("/export/google-calendar")
async def google_calendar_link(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generar enlaces para abrir eventos en Google Calendar"""
    
    bookings = db.query(Booking).all()
    
    events = []
    for booking in bookings:
        # Formato de Google Calendar
        start_time = booking.fecha.isoformat()
        end_time = (booking.fecha + __import__('datetime').timedelta(minutes=booking.plan.duracion_minutos)).isoformat()
        
        google_url = (
            f"https://calendar.google.com/calendar/render?"
            f"action=TEMPLATE"
            f"&text={booking.plan.nombre}"
            f"&dates={start_time.replace('-', '').replace(':', '')}/"
            f"{end_time.replace('-', '').replace(':', '')}"
            f"&details={booking.plan.descripcion}"
            f"&location=Our+Special+Date"
        )
        
        events.append({
            "id": booking.id,
            "plan": booking.plan.nombre,
            "fecha": booking.fecha.isoformat(),
            "hora": booking.hora_inicio,
            "google_url": google_url
        })
    
    return {"events": events}