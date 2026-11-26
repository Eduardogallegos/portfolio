import hmac
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models import User
from app.schemas import InviteRegister, UserLogin, UserResponse, Token
from app.middleware.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])

PAREJA_ROLE = "mariana"
# Cuentas de ejemplo (p. ej. mariana@example.com) que sirven para previsualizar;
# no cuentan como "la pareja ya se registró".
PREVIEW_EMAIL_DOMAIN = "@example.com"


def _issue_token(user: User) -> dict:
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/register", response_model=Token)
async def register(data: InviteRegister, db: Session = Depends(get_db)):
    """Registro solo por invitación. Siempre crea el rol de pareja y es de un solo uso."""

    invalid_invite = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Este link de invitación no es válido"
    )
    if not settings.INVITE_CODE or not hmac.compare_digest(
        data.invite_code.encode(), settings.INVITE_CODE.encode()
    ):
        raise invalid_invite

    # Un solo uso: si ya existe una pareja real, el link deja de servir.
    already_used = (
        db.query(User)
        .filter(User.role == PAREJA_ROLE, ~User.email.ilike(f"%{PREVIEW_EMAIL_DOMAIN}"))
        .first()
    )
    if already_used:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Esta invitación ya se usó. Inicia sesión con tu cuenta."
        )

    email = data.email.lower()
    if db.query(User).filter(func.lower(User.email) == email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )

    new_user = User(
        email=email,
        password_hash=hash_password(data.password),
        role=PAREJA_ROLE,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return _issue_token(new_user)


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login y obtener JWT token"""

    user = db.query(User).filter(func.lower(User.email) == credentials.email.lower()).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )

    return _issue_token(user)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtener info del usuario actual"""
    return current_user
