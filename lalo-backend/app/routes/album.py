import uuid
import requests as http_requests
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import AlbumEntry, User, VALID_ALBUM_TYPES
from app.schemas import AlbumEntryCreate, AlbumEntryResponse
from app.middleware.auth import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/album", tags=["album"])

SIGNED_URL_EXPIRY = 3600  # 1 hora
ALBUM_BUCKET_PREFIX = "album"


def get_signed_url(image_path: str) -> Optional[str]:
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
        pass
    return None


def upload_to_supabase(file_bytes: bytes, content_type: str, filename: str) -> Optional[str]:
    """Sube un archivo al bucket de Supabase y devuelve el path."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        return None
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "jpg"
    path = f"{ALBUM_BUCKET_PREFIX}/{uuid.uuid4()}.{ext}"
    url = f"{settings.SUPABASE_URL}/storage/v1/object/{settings.SUPABASE_BUCKET}/{path}"
    headers = {
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
        "Content-Type": content_type,
    }
    try:
        resp = http_requests.post(url, data=file_bytes, headers=headers, timeout=30)
        resp.raise_for_status()
        return path
    except Exception as e:
        print(f"Error subiendo a Supabase: {e}")
        return None


def build_response(entry: AlbumEntry) -> AlbumEntryResponse:
    # Resolver image_url: primero intenta signed URL desde Storage, luego image_url directa
    image_url = None
    if entry.image_path:
        image_url = get_signed_url(entry.image_path)
    if not image_url and entry.image_url:
        image_url = entry.image_url

    return AlbumEntryResponse(
        id=entry.id,
        type=entry.type,
        title=entry.title,
        content=entry.content,
        image_url=image_url,
        date_label=entry.date_label,
        created_by_role=entry.created_by.role,
        created_at=entry.created_at,
    )


# ── GET /api/album ─────────────────────────────────────────────────────────────
@router.get("", response_model=List[AlbumEntryResponse])
async def list_album(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entries = (
        db.query(AlbumEntry)
        .order_by(AlbumEntry.created_at.desc())
        .all()
    )
    return [build_response(e) for e in entries]


# ── POST /api/album ────────────────────────────────────────────────────────────
@router.post("", response_model=AlbumEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    body: AlbumEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.type not in VALID_ALBUM_TYPES:
        raise HTTPException(400, f"Tipo inválido. Válidos: {', '.join(VALID_ALBUM_TYPES)}")
    # Solo lalo puede crear entradas de tipo "mensaje"
    if body.type == "mensaje" and current_user.role != "lalo":
        raise HTTPException(403, "Solo lalo puede crear entradas de tipo mensaje.")

    entry = AlbumEntry(
        type=body.type,
        title=body.title,
        content=body.content,
        date_label=body.date_label,
        image_url=body.image_url,
        created_by_id=current_user.id,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return build_response(entry)


# ── POST /api/album/upload ─────────────────────────────────────────────────────
@router.post("/upload", response_model=AlbumEntryResponse, status_code=status.HTTP_201_CREATED)
async def upload_photo(
    title: str = Form(...),
    date_label: Optional[str] = Form(None),
    photo: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Sube una foto y crea una entrada tipo 'foto' en el álbum."""
    content_type = photo.content_type or "image/jpeg"
    if not content_type.startswith("image/"):
        raise HTTPException(400, "Solo se permiten imágenes.")

    file_bytes = await photo.read()
    image_path = upload_to_supabase(file_bytes, content_type, photo.filename or "photo.jpg")
    if not image_path:
        raise HTTPException(500, "Error al subir la imagen. Intenta de nuevo.")

    entry = AlbumEntry(
        type="foto",
        title=title,
        date_label=date_label,
        image_path=image_path,
        created_by_id=current_user.id,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return build_response(entry)


# ── DELETE /api/album/{id} ─────────────────────────────────────────────────────
@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "lalo":
        raise HTTPException(403, "Solo lalo puede eliminar entradas del álbum.")
    entry = db.query(AlbumEntry).filter(AlbumEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(404, "Entrada no encontrada.")
    db.delete(entry)
    db.commit()
