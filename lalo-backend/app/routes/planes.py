from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Plan
from app.schemas import PlanCreate, PlanUpdate, PlanResponse
from app.middleware.auth import get_current_user
from typing import List

router = APIRouter(prefix="/planes", tags=["planes"])

@router.get("", response_model=List[PlanResponse])
async def list_planes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener todos los planes (ambos pueden ver)"""
    planes = db.query(Plan).all()
    return planes

@router.post("", response_model=PlanResponse)
async def create_plan(
    plan_data: PlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo plan (solo Lalo puede)"""
    
    # Validar que sea Lalo
    if current_user.role != "lalo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo Lalo puede crear planes"
        )
    
    # Crear plan
    new_plan = Plan(
        nombre=plan_data.nombre,
        descripcion=plan_data.descripcion,
        duracion_minutos=plan_data.duracion_minutos
    )
    
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    
    return new_plan

@router.put("/{plan_id}", response_model=PlanResponse)
async def update_plan(
    plan_id: int,
    plan_data: PlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar un plan (solo Lalo puede)"""
    
    # Validar que sea Lalo
    if current_user.role != "lalo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo Lalo puede editar planes"
        )
    
    # Buscar plan
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan no encontrado"
        )
    
    # Actualizar campos
    if plan_data.nombre is not None:
        plan.nombre = plan_data.nombre
    if plan_data.descripcion is not None:
        plan.descripcion = plan_data.descripcion
    if plan_data.duracion_minutos is not None:
        plan.duracion_minutos = plan_data.duracion_minutos
    
    db.commit()
    db.refresh(plan)
    
    return plan

@router.delete("/{plan_id}")
async def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Eliminar un plan (solo Lalo puede)"""
    
    # Validar que sea Lalo
    if current_user.role != "lalo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo Lalo puede eliminar planes"
        )
    
    # Buscar plan
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan no encontrado"
        )
    
    # Eliminar
    db.delete(plan)
    db.commit()
    
    return {"message": "Plan eliminado exitosamente"}
