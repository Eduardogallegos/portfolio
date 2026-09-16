# 🚀 Setup Completo: Backend FastAPI para Date Booking

## Paso 1: Descargar y Extraer Archivos

```bash
# Descargar lalo-backend.tar.gz y extraer
tar -xzf lalo-backend.tar.gz
cd lalo-backend
```

## Paso 2: Crear Base de Datos en Supabase

1. Ir a https://supabase.com
2. Click en "New Project"
3. Completar:
   - **Name:** date-booking
   - **Database Password:** Guardar en lugar seguro
   - **Region:** us-east-1 (o tu región)
4. Esperar ~2 minutos a que se cree
5. Ir a **Settings → Database → Connection strings**
6. Copiar **URI** (la que comienza con `postgresql://`)

Será algo como:
```
postgresql://postgres:XXXXX@db.XXXXX.supabase.co:5432/postgres
```

## Paso 3: Configurar Variables de Entorno

```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus valores
nano .env  # o tu editor favorito
```

**Contenido de .env:**
```env
DATABASE_URL=postgresql://postgres:XXXXX@db.XXXXX.supabase.co:5432/postgres
SECRET_KEY=tu-super-secret-key-aqui-minimo-32-caracteres-aleatorios
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development
```

**Para generar SECRET_KEY seguro:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Paso 4: Crear Virtual Environment e Instalar Dependencias

```bash
# Crear venv
python -m venv venv

# Activar venv
source venv/bin/activate  # Linux/Mac
# O en Windows:
# venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

## Paso 5: Verificar Conexión a Base de Datos

```bash
python -c "
from app.database import engine
from app.models import Base

# Crear tablas
Base.metadata.create_all(bind=engine)
print('✓ Conexión exitosa y tablas creadas')
"
```

Si ves "✓ Conexión exitosa", ¡todo está bien!

## Paso 6: Ejecutar el Servidor

### Opción A: Usando script (recomendado)
```bash
bash run.sh
```

### Opción B: Manualmente
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Deberías ver:
```
Uvicorn running on http://0.0.0.0:8000
```

## Paso 7: Probar la API

### Acceder a Swagger UI (interfaz gráfica)
```
http://localhost:8000/docs
```

### O usar curl (terminal)

#### 1. Registrar a Lalo
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lalo@example.com",
    "password": "password123",
    "role": "lalo"
  }'
```

Respuesta esperada:
```json
{
  "id": 1,
  "email": "lalo@example.com",
  "role": "lalo",
  "created_at": "2024-09-15T..."
}
```

#### 2. Registrar Pareja
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pareja@example.com",
    "password": "password123",
    "role": "pareja"
  }'
```

#### 3. Login (Lalo)
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lalo@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": { ... }
}
```

**Guardar el `access_token` para los próximos requests**

#### 4. Crear un Plan (como Lalo)
```bash
# Reemplaza TOKEN con el access_token del paso anterior
curl -X POST "http://localhost:8000/planes" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cena romántica",
    "descripcion": "Cena en restaurante de comida italiana",
    "duracion_minutos": 120
  }'
```

Respuesta:
```json
{
  "id": 1,
  "nombre": "Cena romántica",
  "descripcion": "Cena en restaurante de comida italiana",
  "duracion_minutos": 120,
  "created_at": "2024-09-15T...",
  "updated_at": "2024-09-15T..."
}
```

#### 5. Ver todos los planes
```bash
curl -X GET "http://localhost:8000/planes" \
  -H "Authorization: Bearer TOKEN"
```

#### 6. Login (Pareja)
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pareja@example.com",
    "password": "password123"
  }'
```

Guardar el token de pareja

#### 7. Agendar un Date (como Pareja)
```bash
# Reemplaza PAREJA_TOKEN con el token de pareja
curl -X POST "http://localhost:8000/bookings" \
  -H "Authorization: Bearer PAREJA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "fecha": "2024-09-20T19:00:00",
    "hora_inicio": "19:00"
  }'
```

Respuesta:
```json
{
  "id": 1,
  "plan_id": 1,
  "fecha": "2024-09-20T19:00:00",
  "hora_inicio": "19:00",
  "creado_por": 2,
  "created_at": "2024-09-15T...",
  "plan": {
    "id": 1,
    "nombre": "Cena romántica",
    ...
  }
}
```

## Paso 8: Validar Permisos

### ❌ Intentar crear plan como Pareja (debe fallar)
```bash
curl -X POST "http://localhost:8000/planes" \
  -H "Authorization: Bearer PAREJA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Otro plan",
    "descripcion": "...",
    "duracion_minutos": 60
  }'
```

Respuesta esperada (error):
```json
{
  "detail": "Solo Lalo puede crear planes"
}
```

### ❌ Intentar agendar como Lalo (debe fallar)
```bash
curl -X POST "http://localhost:8000/bookings" \
  -H "Authorization: Bearer LALO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "fecha": "2024-09-22T20:00:00",
    "hora_inicio": "20:00"
  }'
```

Respuesta esperada (error):
```json
{
  "detail": "Solo la pareja puede agendar dates"
}
```

✅ **¡Si llegaste aquí, todo funciona perfecto!**

---

## Troubleshooting

### Error: "could not connect to server: Connection refused"
**Solución:** Verificar que DATABASE_URL es correcta en .env

### Error: "Module not found: app.main"
**Solución:** Asegúrate de estar en la carpeta raíz (`lalo-backend/`)

### Error: "ImportError: No module named 'psycopg2'"
**Solución:**
```bash
pip install psycopg2-binary
```

### El servidor no se inicia
**Solución:** Revisar que el puerto 8000 no esté ocupado
```bash
# Cambiar puerto
uvicorn app.main:app --reload --port 8001
```

---

## Próximo Paso: Conectar con React

Una vez que el backend funciona, necesitamos:

1. Crear componentes React que hagan fetch a http://localhost:8000
2. Guardar JWT token en localStorage
3. Enviar token en headers de requests

Ejemplos en React (fetch):
```javascript
// Login
const response = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.access_token);

// Crear plan
const response = await fetch('http://localhost:8000/planes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ nombre, descripcion, duracion_minutos })
});
```

---

## Deployment (cuando esté listo)

### Railway
1. Conectar GitHub
2. Crear Web Service
3. Agregar `DATABASE_URL` en Environment
4. Deploy automático

### Render
1. Conectar GitHub
2. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Build command: `pip install -r requirements.txt`

---

¿Preguntas? Revisa README.md para más detalles 📚
