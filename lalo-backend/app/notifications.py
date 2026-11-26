"""Notificaciones por correo (vía Resend, API HTTP — Railway bloquea SMTP)."""
import html
from typing import Optional

import requests as http_requests

from app.config import settings

RESEND_URL = "https://api.resend.com/emails"


def _album_link() -> str:
    base = settings.FRONTEND_URL.split(",")[0].strip().rstrip("/")
    return f"{base}/pareja/album"


def send_email(to: str, subject: str, html_body: str) -> None:
    if not settings.RESEND_API_KEY or not settings.NOTIFY_FROM_EMAIL:
        print("Notificaciones desactivadas: falta RESEND_API_KEY o NOTIFY_FROM_EMAIL")
        return
    try:
        resp = http_requests.post(
            RESEND_URL,
            json={
                "from": settings.NOTIFY_FROM_EMAIL,
                "to": [to],
                "subject": subject,
                "html": html_body,
            },
            headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
            timeout=10,
        )
        resp.raise_for_status()
    except Exception as e:
        # Nunca rompemos la creación de la entrada por un correo fallido.
        print(f"Error enviando correo a {to}: {e}")


def notify_new_album_entry(
    to_email: str,
    author_role: str,
    entry_type: str,
    title: str,
    content: Optional[str],
) -> None:
    author = html.escape(author_role.capitalize())
    kind = "una foto" if entry_type == "foto" else "un mensaje"
    subject = f"{author_role.capitalize()} agregó {kind} al álbum 💌"

    preview = ""
    if content:
        snippet = content if len(content) <= 200 else content[:200].rstrip() + "…"
        preview = f'<p style="color:#555;font-style:italic">“{html.escape(snippet)}”</p>'

    body = f"""
    <div style="font-family:Georgia,serif;max-width:480px;margin:auto;padding:24px">
      <p>{author} agregó {kind} nuevo al álbum:</p>
      <h2 style="margin:8px 0">{html.escape(title)}</h2>
      {preview}
      <p style="margin-top:24px">
        <a href="{_album_link()}"
           style="background:#c0392b;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">
          Ver el álbum
        </a>
      </p>
    </div>
    """
    send_email(to_email, subject, body)
