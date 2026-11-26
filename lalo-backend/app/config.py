from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Registro por invitación: link /pareja/registro/<INVITE_CODE>.
    # Vacío = registro desactivado.
    INVITE_CODE: str = ""

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    # Environment
    ENVIRONMENT: str = "development"

    # Supabase Storage (para signed URLs de imágenes)
    SUPABASE_URL: str = ""           # ej: https://xyzxyz.supabase.co
    SUPABASE_SERVICE_KEY: str = ""   # service_role key (nunca al frontend)
    SUPABASE_BUCKET: str = "messages"

    # Notificaciones por correo (Resend). Si faltan, no se envía nada.
    RESEND_API_KEY: str = ""
    NOTIFY_FROM_EMAIL: str = ""      # ej: "Álbum <album@egallegos.me>"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
