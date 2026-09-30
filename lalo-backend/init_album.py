#!/usr/bin/env python
"""
Siembra la primera entrada del álbum — el mensaje original de "en construcción".
Corre UNA sola vez: python init_album.py
"""
from app.models import User, AlbumEntry
from app.database import Base, engine, SessionLocal

def seed():
    Base.metadata.create_all(bind=engine)  # crea album_entries si no existe
    db = SessionLocal()
    try:
        # No correr si ya hay entradas
        if db.query(AlbumEntry).count() > 0:
            print("Ya hay entradas en el álbum. Nada que hacer.")
            return

        lalo = db.query(User).filter(User.role == "lalo").first()
        if not lalo:
            print("Usuario 'lalo' no encontrado. Corre primero el registro de usuarios.")
            return

        first_entry = AlbumEntry(
            type="mensaje",
            title="El inicio de la aventura",
            date_label="Agosto 2026",
            image_url="https://lalo-planning.vercel.app/work-in-progress.jpg",
            content=(
                "Hace mucho te prometí construir algo así (apenas estábamos saliendo) "
                "y he estado trabajando en esto desde entonces, pero por varios motivos "
                "lo había puesto en pausa. Poco a poco le iré agregando cositas "
                "(sorry, tiene bugs y cosas que iré arreglando)\n\n"
                "Por lo pronto quiero que sepas que me siento súper orgulloso de ti, "
                "eres una persona admirable. Que este viaje te sirva para seguir creciendo "
                "en lo que amas. ¡Disfrútalo!\n\n"
                "Hoy es el inicio de esta aventura.\n\n"
                "Te amo, preciosa 💜"
            ),
            created_by_id=lalo.id,
        )
        db.add(first_entry)
        db.commit()
        print("✓ Primera entrada del álbum creada: 'El inicio de la aventura'")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
