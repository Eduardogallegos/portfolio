import random
import requests as http_requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.database import get_db
from app.models import Message, User, VALID_CATEGORIES
from app.schemas import MessageResponse
from app.middleware.auth import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/messages", tags=["messages"])

SIGNED_URL_EXPIRY = 3600  # 1 hora


def get_signed_url(image_path: str) -> Optional[str]:
    """Genera una signed URL para un archivo en Supabase Storage."""
    if not image_path or not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        return None

    url = f"{settings.SUPABASE_URL}/storage/v1/object/sign/{settings.SUPABASE_BUCKET}/{image_path}"
    headers = {
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }

    try:
        resp = http_requests.post(url, json={"expiresIn": SIGNED_URL_EXPIRY}, headers=headers, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        signed_path = data.get("signedURL")
        if signed_path:
            return f"{settings.SUPABASE_URL}{signed_path}"
    except Exception:
        pass  # Si falla, retornamos None — el frontend omite la imagen

    return None


def build_response(message: Message) -> MessageResponse:
    """Convierte un Message de BD a MessageResponse con signed URL si aplica."""
    image_url = get_signed_url(message.image_path) if message.image_path else None
    return MessageResponse(
        id=message.id,
        category=message.category,
        content=message.content,
        image_url=image_url,
        created_at=message.created_at,
    )


@router.get("/{category}", response_model=List[MessageResponse])
async def get_messages(
    category: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retorna todos los mensajes de una categoría.
    Para 'sorpresa', retorna uno aleatorio de cualquier categoría.
    Solo usuarios autenticados pueden acceder.
    """
    if category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Categoría inválida. Válidas: {', '.join(sorted(VALID_CATEGORIES))}",
        )

    if category == "sorpresa":
        # Un mensaje aleatorio de cualquier categoría excepto 'sorpresa'
        real_categories = VALID_CATEGORIES - {"sorpresa"}
        message = (
            db.query(Message)
            .filter(Message.category.in_(real_categories))
            .order_by(func.random())
            .first()
        )
        if not message:
            raise HTTPException(status_code=404, detail="No hay mensajes disponibles.")
        return [build_response(message)]

    messages = db.query(Message).filter(Message.category == category).all()

    if not messages:
        raise HTTPException(
            status_code=404,
            detail=f"No hay mensajes en la categoría '{category}'.",
        )

    return [build_response(m) for m in messages]
