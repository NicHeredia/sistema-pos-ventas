# Sistema de Gestión de Ventas

Un sistema completo de punto de venta (POS) para pequeños negocios, construido con React, TypeScript, Vite y Supabase.

## 🚀 Características

- **Gestión de Productos**: Agregar, editar y eliminar productos con categorías
- **Punto de Venta**: Interfaz intuitiva para procesar ventas
- **Historial de Ventas**: Seguimiento completo de todas las transacciones
- **Gestión de Gastos**: Registro y categorización de gastos del negocio
- **Reportes**: Análisis de ventas y gastos
- **Interfaz Moderna**: UI/UX moderna con Tailwind CSS y shadcn/ui

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase (Edge Functions)
- **Base de Datos**: Supabase PostgreSQL
- **Deployment**: Vercel

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- Cuenta de Vercel (opcional para deployment)

## 🚀 Instalación y Desarrollo Local

1. **Clona el repositorio**
   ```bash
   git clone <tu-repo-url>
   cd sistema-de-gestion-de-ventas
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   ```bash
   cp .env.example .env
   ```

   Edita `.env` con tus claves de Supabase:
   ```
   VITE_SUPABASE_PROJECT_ID=tu_project_id
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador** en `http://localhost:5173`

## 🚀 Deployment en Vercel

### Opción 1: Deploy automático desde GitHub

1. **Sube el código a GitHub** (ver instrucciones abajo)

2. **Conecta Vercel con GitHub**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa el repositorio

3. **Configura variables de entorno en Vercel**
   - Ve a Settings → Environment Variables
   - Agrega:
     ```
     VITE_SUPABASE_PROJECT_ID=tu_project_id
     VITE_SUPABASE_ANON_KEY=tu_anon_key
     ```

4. **Deploy**
   - Vercel detectará automáticamente la configuración de Vite
   - El deployment se hará automáticamente

### Opción 2: Deploy manual

```bash
npm run build
```

Los archivos de producción estarán en la carpeta `dist/`.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/           # Componentes de UI reutilizables
│   │   ├── PointOfSale.tsx
│   │   ├── ProductsManager.tsx
│   │   ├── SalesHistory.tsx
│   │   └── ExpenseManager.tsx
│   ├── hooks/
│   │   └── useSupabaseData.ts
│   └── App.tsx
├── styles/
├── utils/
│   └── supabase/
└── main.tsx

supabase/
└── functions/
    └── api/
        └── index.ts      # Edge Function principal
```

## 🔧 Configuración de Supabase

1. **Crea un proyecto en Supabase**
2. **Configura la Edge Function**
   ```bash
   npx supabase functions deploy api --project-ref tu-project-ref
   ```
3. **La función maneja automáticamente**:
   - CRUD completo para productos, ventas y gastos
   - CORS configurado para todos los orígenes
   - Autenticación con tokens de Supabase

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Vista previa del build

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- Diseño original en [Figma](https://www.figma.com/design/YkxawvIZbj3M24Tq3G33jG/Sistema-de-Gesti%C3%B3n-de-Ventas)
- UI components de [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)