import random
import logging
import requests as http_requests

logger = logging.getLogger(__name__)

# Cache de signed URLs: { path: (url, expires_at) }
_signed_url_cache: dict = {}
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
    """Genera una signed URL para un archivo en Supabase Storage (con cache de 55 min)."""
    import time
    if not image_path or not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        return None

    # Revisar cache primero
    cached = _signed_url_cache.get(image_path)
    if cached and cached[1] > time.time():
        return cached[0]

    # Si el path incluye el nombre del bucket como prefijo (ej: "messages/juegos.jpeg"),
    # se lo quitamos para no duplicarlo en la URL.
    bucket_prefix = settings.SUPABASE_BUCKET + "/"
    clean_path = image_path[len(bucket_prefix):] if image_path.startswith(bucket_prefix) else image_path

    url = f"{settings.SUPABASE_URL}/storage/v1/object/sign/{settings.SUPABASE_BUCKET}/{clean_path}"
    headers = {
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }

    try:
        resp = http_requests.post(url, json={"expiresIn": SIGNED_URL_EXPIRY}, headers=headers, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        print(f"[DEBUG] Supabase response for {clean_path!r}: {data}", flush=True)
        # Supabase puede devolver 'signedURL' (viejo) o 'signedUrl' (nuevo)
        signed = data.get("signedURL") or data.get("signedUrl") or data.get("url")
        if signed:
            if signed.startswith("http"):
                return signed
            # Supabase devuelve '/object/sign/...' sin el prefijo '/storage/v1'
            if signed.startswith("/object/"):
                signed = "/storage/v1" + signed
            final_url = f"{settings.SUPABASE_URL}{signed}"
            _signed_url_cache[image_path] = (final_url, time.time() + 55 * 60)
            return final_url
    except Exception as e:
        logger.error(f"get_signed_url failed for path={image_path!r}: {e}")
        try:
            logger.error(f"Response status: {resp.status_code}, body: {resp.text}")
        except Exception:
            pass
        return None

    print(f"[DEBUG] No signed key in response for {image_path!r}: {data}", flush=True)
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
