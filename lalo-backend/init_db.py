#!/usr/bin/env python
"""Script para crear las tablas en la base de datos"""

from app.models import User, Plan, Booking, Message
from app.database import Base, engine
from sqlalchemy import inspect

def init_db():
    print("Creando tablas en la base de datos...")

    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    print(f"Tablas existentes: {existing_tables}")

    try:
        Base.metadata.create_all(bind=engine)

        inspector = inspect(engine)
        created_tables = inspector.get_table_names()
        print(f"Tablas después de crear: {created_tables}")
        print("✓ Tablas listas")

    except Exception as e:
        print(f"✗ Error al crear tablas: {e}")
        raise

if __name__ == "__main__":
    init_db()
