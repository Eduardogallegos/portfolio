# Date Booking API

Backend FastAPI para aplicación de date booking entre pareja.

## Instalación

### 1. Clonar el repositorio y crear venv

```bash
cd lalo-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus valores
```

**Mínimo requerido en .env:**
```env
DATABASE_URL=postgresql://user:password@host:5432/date_booking
SECRET_KEY=tu-super-secret-key-aqui-minimo-32-chars
FRONTEND_URL=http://localhost:5173
```

### 4. Crear base de datos

Si usas Supabase:
1. Ir a https://supabase.com
2. Crear proyecto
3. Copiar `DATABASE_URL` desde Settings → Database
4. Pegar en `.env`

### 5. Ejecutar servidor

```bash
python app/main.py
```

O con uvicorn directamente:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Acceder a http://localhost:8000/docs (Swagger UI)

---

## Estructura

```
app/
├── main.py              # Punto de entrada FastAPI
├── config.py            # Configuración y env vars
├── database.py          # Conexión PostgreSQL
├── models.py            # Modelos SQLAlchemy (User, Plan, Booking)
├── schemas.py           # Pydantic schemas para validación
├── routes/
│   ├── auth.py          # Endpoints login/register
│   ├── planes.py        # CRUD planes
│   └── bookings.py      # Agendar dates
└── middleware/
    └── auth.py          # JWT, hashing, permisos
```

---

## Endpoints principales

### Autenticación
- `POST /auth/register` - Registrar usuario (Lalo o Pareja)
- `POST /auth/login` - Login y obtener JWT
- `GET /auth/me` - Info del usuario actual

### Planes
- `GET /planes` - Listar todos (ambos)
- `POST /planes` - Crear (solo Lalo)
- `PUT /planes/{id}` - Editar (solo Lalo)
- `DELETE /planes/{id}` - Eliminar (solo Lalo)

### Bookings
- `GET /bookings` - Listar (ambos)
- `POST /bookings` - Agendar (solo Pareja)
- `GET /bookings/{id}` - Detalles

---

## Ejemplo de uso (con curl)

### 1. Registrar Lalo
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lalo@example.com",
    "password": "password123",
    "role": "lalo"
  }'
```

### 2. Registrar Pareja
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pareja@example.com",
    "password": "password123",
    "role": "pareja"
  }'
```

### 3. Login (Lalo)
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
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {...}
}
```

### 4. Crear Plan (con JWT de Lalo)
```bash
curl -X POST "http://localhost:8000/planes" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cena romántica",
    "descripcion": "Cena en restaurante de comida italiana",
    "duracion_minutos": 120
  }'
```

### 5. Agendar Date (con JWT de Pareja)
```bash
curl -X POST "http://localhost:8000/bookings" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "fecha": "2024-09-20T19:00:00",
    "hora_inicio": "19:00"
  }'
```

---

## Deployment

### Railway

1. Conectar GitHub a Railway
2. Crear nuevo proyecto desde repo
3. Agregar variable de entorno `DATABASE_URL`
4. Deploy automático

### Render

1. Conectar GitHub a Render
2. Crear Web Service
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## Notas importantes

- **SECRET_KEY:** Cambiar antes de producción (mínimo 32 caracteres)
- **CORS:** Configurado en main.py, agregar URLs del frontend
- **JWT:** Token expira en 30 minutos (configurable)
- **Permisos:** Lalo = gestiona planes, Pareja = agenda dates
