#!/usr/bin/env python
"""Script para crear las tablas en la base de datos"""

# IMPORTANTE: Importar los modelos ANTES de create_all
from app.models import User, Plan, Booking
from app.database import Base, engine
from sqlalchemy import inspect

def init_db():
    """Crea todas las tablas"""
    print("Creando tablas en la base de datos...")
    
    # Verificar qué tablas existen antes
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    print(f"Tablas existentes: {existing_tables}")
    
    try:
        # Crear todas las tablas definidas en Base.metadata
        Base.metadata.create_all(bind=engine)
        
        # Verificar qué tablas se crearon
        inspector = inspect(engine)
        created_tables = inspector.get_table_names()
        print(f"Tablas después de crear: {created_tables}")
        
        if created_tables:
            print("✓ Tablas creadas exitosamente")
        else:
            print("✗ No se crearon tablas. Revisa los modelos.")
            
    except Exception as e:
        print(f"✗ Error al crear tablas: {e}")
        raise

if __name__ == "__main__":
    init_db()