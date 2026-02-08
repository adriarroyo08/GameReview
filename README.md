# GameReview
Aplicación de búsqueda y comparación de precios de videojuegos.

## 🎮 Características

- **Búsqueda de videojuegos**: Accede a una base de datos de más de 500,000 juegos de todas las plataformas (PC, PlayStation, Xbox, Nintendo, retro, etc.)
- **Valoraciones**: Visualiza ratings agregados de usuarios y críticos
- **Comparación de precios**: Encuentra el mejor precio en tiendas como Steam, GOG, Epic Games, etc.
- **Historial de precios**: Ve el precio más bajo histórico de cada juego

## 🚀 Instalación

### 1. Clonar e instalar dependencias
```bash
git clone <repo-url>
cd GameReview
npm install
```

### 2. Configurar credenciales de IGDB (Twitch)

Para acceder a la base de datos de juegos, necesitas credenciales de Twitch Developer:

1. Ve a [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Inicia sesión o crea una cuenta
3. Crea una nueva aplicación:
   - **Nombre**: GameReview (o el que prefieras)
   - **URL de redirección OAuth**: `http://localhost`
   - **Categoría**: Application Integration
4. Copia el **Client ID** y genera un **Client Secret**
5. Crea un archivo `.env.local` en la raíz del proyecto:

```env
TWITCH_CLIENT_ID=tu_client_id_aqui
TWITCH_CLIENT_SECRET=tu_client_secret_aqui
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta tests con Vitest |

## 🏗️ Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **APIs**:
  - [IGDB](https://api-docs.igdb.com/) - Base de datos de videojuegos (requiere cuenta Twitch)
  - [CheapShark](https://cheapshark.com/api) - Precios en tiendas digitales (sin API key)
- **Testing**: Vitest + Testing Library

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   └── games/
│   │       ├── search/route.ts    # GET /api/games/search?q=...
│   │       └── [id]/route.ts      # GET /api/games/:id
│   ├── components/
│   │   ├── GameCard.tsx           # Tarjeta de juego
│   │   └── SearchBar.tsx          # Barra de búsqueda
│   ├── game/
│   │   └── [id]/page.tsx          # Página de detalle
│   ├── page.tsx                   # Página principal
│   └── globals.css                # Estilos globales
└── services/
    ├── igdb.ts                    # Servicio IGDB
    ├── cheapshark.ts              # Servicio CheapShark
    └── cache.ts                   # Cache en memoria
```

## 🔑 APIs utilizadas

### IGDB (Internet Game Database)
Proporciona información completa sobre videojuegos:
- Título, descripción, historia
- Plataformas, géneros
- Ratings de usuarios y críticos
- Capturas de pantalla
- Empresas desarrolladoras/publicadoras

### CheapShark
Proporciona precios en tiempo real de tiendas digitales:
- Steam, GOG, Epic Games, Humble Bundle, etc.
- Precio actual vs precio original
- Historial de precios

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Verificar conexión con APIs
npx tsx scripts/verify-api.ts
```

## 📝 Roadmap

- [x] Configuración del proyecto
- [x] Integración con API de CheapShark
- [x] Integración con API de IGDB
- [x] UI de búsqueda y resultados
- [x] Página de detalle del juego
- [ ] Filtros por plataforma y género
- [ ] Sistema de favoritos
- [ ] Alertas de precios
