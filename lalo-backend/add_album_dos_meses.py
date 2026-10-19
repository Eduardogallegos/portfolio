#!/usr/bin/env python
"""
Agrega al álbum el mensaje de "Felices dos meses" (que estaba en la página principal).
Corre UNA sola vez: python add_album_dos_meses.py
"""
from app.models import User, AlbumEntry
from app.database import Base, engine, SessionLocal

TITLE = "Felices dos meses!! 💛"

CONTENT = (
    "Que rápido se me pasó el tiempo, pero hoy cumplimos dos meses!! Está cañón como "
    "en el tiempo que llevo de conocerte he tenido experiencias increíbles, momentos de "
    "mucha felicidad y alegría.\n\n"
    "Esta vez nos toca celebrar desde lejos, pero no quise que pasara desapercibida la "
    "fecha. Estás en un viaje que desde hace mucho tenías presente y hoy estás cumpliendo. "
    "En las videollamadas te ves super feliz y eso me pone feliz a mi también porque, "
    "aunque te extraño muchísimo y muero por un abrazo tuyo, me encanta verte luchando "
    "por tus sueños.\n\n"
    "Felices dos meses, gracias por venir a cambiar muchos aspectos de mi vida. Te amo "
    "como no he amado a nadie nunca y como amaré a nadie jamás.\n\n"
    "Sobre la página, espero que te guste lo que he estado trabajando. Tiene varios bugs "
    "y muy probablemente no te gusten mis dotes de diseñador pero justo la construí "
    "pensando en que sea un espacio para los dos. Así que, cualquier queja, idea, "
    "sugerencia o experimento es bienvenido.\n\n"
    "Alguna vez prometí construir una página para agendar citas, pero en el camino han "
    "surgido algunas ideas extras, espero te guste.\n\n"
    "Te amo.\nTu tontito 🍀"
)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(AlbumEntry).filter(AlbumEntry.title == TITLE).first():
            print("Esta entrada ya existe en el álbum. Nada que hacer.")
            return

        lalo = db.query(User).filter(User.role == "lalo").first()
        if not lalo:
            print("Usuario 'lalo' no encontrado. Corre primero el registro de usuarios.")
            return

        db.add(AlbumEntry(
            type="mensaje",
            title=TITLE,
            date_label="01 de octubre, 2026",
            content=CONTENT,
            created_by_id=lalo.id,
        ))
        db.commit()
        print(f"✓ Entrada agregada al álbum: '{TITLE}'")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
