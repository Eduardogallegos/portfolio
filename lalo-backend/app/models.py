from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "lalo" o "mariana"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    bookings = relationship("Booking", back_populates="creator")


class Plan(Base):
    __tablename__ = "planes"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    duracion_minutos = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    bookings = relationship("Booking", back_populates="plan", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("planes.id"), nullable=False)
    fecha = Column(DateTime, nullable=False)
    hora_inicio = Column(String, nullable=False)  # Formato "HH:MM"
    creado_por = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    plan = relationship("Plan", back_populates="bookings")
    creator = relationship("User", back_populates="bookings")
