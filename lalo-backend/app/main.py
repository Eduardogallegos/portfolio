from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, planes, bookings

# Crear app FastAPI
app = FastAPI(
    title="Date Booking API",
    description="API para agendar dates entre pareja",
    version="1.0.0"
)

# Configurar CORS
# FRONTEND_URL admite una o varias URLs separadas por coma, ej:
# FRONTEND_URL=https://egallegos.me,https://www.egallegos.me
allowed_origins = [origin.strip() for origin in settings.FRONTEND_URL.split(",") if origin.strip()]
allowed_origins += ["http://localhost:3000", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(auth.router)
app.include_router(planes.router)
app.include_router(bookings.router)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Date Booking API is running",
        "environment": settings.ENVIRONMENT
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    )