# Lalo Date Booking - Frontend React

Frontend de la aplicación de date booking entre pareja.

## Instalación

```bash
cd lalo-frontend
npm install
```

## Desarrollo

```bash
npm run dev
```

Acceder a `http://localhost:5173`

**Importante:** El backend debe estar corriendo en `http://localhost:8000`

## Build

```bash
npm run build
```

## Estructura

```
src/
├── components/      # Componentes React
├── hooks/          # Custom hooks (useAuth, usePlans, useBookings)
├── pages/          # Páginas (futuro)
├── utils/          # Funciones auxiliares (api.js)
├── App.jsx         # Componente principal
└── index.css       # Estilos globales
```

## Features

✅ Registro e inicio de sesión  
✅ Gestión de roles (Lalo vs Pareja)  
✅ Selector de planes  
✅ Calendario interactivo  
✅ Agendar dates  
✅ Historial de bookings  

## Usuarios de prueba

- **Lalo:** lalo@example.com / password123
- **Pareja:** pareja@example.com / password123

## Tecnologías

- React 18
- Vite
- Axios
- React Router (futuro)
- Tailwind CSS (opcional)
