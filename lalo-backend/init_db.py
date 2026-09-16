#!/usr/bin/env python
"""Script para crear las tablas en la base de datos"""

from app.database import Base, engine

def init_db():
    """Crea todas las tablas"""
    print("Creando tablas en la base de datos...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ Tablas creadas exitosamente")
    except Exception as e:
        print(f"✗ Error al crear tablas: {e}")
        raise

if __name__ == "__main__":
    init_db()