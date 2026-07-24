# Deduce - Frontend

Plataforma inteligente para profesionistas e independientes en México. Controla tus facturas, proyecta tu ISR anual y maximiza tu devolución de impuestos ante el SAT.

## Stack Tecnológico
- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS + Shadcn UI
- **Gestión de Estado:** Zustand
- **Validación de Formularios:** React Hook Form + Zod

## Estructura Principal
- `/app`: Rutas de la aplicación (Dashboard, Auth, Landing de Precios, Vistas Legales).
- `/components`: Componentes reutilizables de interfaz de usuario.
- `/lib/api`: Funciones cliente para interactuar con la API REST (FastAPI).
- `/store`: Almacenamiento global (Zustand) para control de sesión, perfil y cálculo de deducciones.

## Configuración y Uso

### Instalación
```bash
npm install
```

### Desarrollo Local
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) en su navegador para ver la plataforma.

### Construcción para Producción
```bash
npm run build
npm start
```
