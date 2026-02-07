# GameReview
App informativa de videojuegos

1. Visión del Proyecto
Este repositorio es el punto de partida para una aplicación multiplataforma que permite comparar precios de videojuegos en tiempo real entre distintas tiendas (Steam, Epic Games, GOG, Humble Bundle).

2. Instrucciones para la IA (Jules)
Rol: Actúa como Full-Stack Developer Senior. Tarea: Basándote en este README, inicializa el proyecto desde cero. No esperes instrucciones adicionales; toma decisiones de arquitectura basadas en las mejores prácticas actuales.

3. Stack Tecnológico Sugerido
Jules, eres libre de elegir, pero se recomienda:

Frontend: Next.js (App Router) + Tailwind CSS.

Backend: Node.js (integrado en Next.js) o FastAPI si prefieres Python.

API Externa: Utiliza la API de CheapShark (es gratuita y no requiere API Key compleja para empezar) para obtener los precios.

4. Requerimientos Funcionales (MVP)
Módulo de Búsqueda: Un input donde el usuario escriba el nombre de un juego.

Lógica de Comparación: Consultar la API, normalizar los precios a una moneda única (EUR/USD) y ordenarlos de menor a mayor.

Interfaz de Resultados: Tarjetas de producto que muestren:

Imagen del juego.

Precio actual vs. Precio original.

Enlace directo a la tienda.

Sistema de Cache: Implementar un sistema básico (puede ser en memoria o SQLite) para no saturar la API externa en búsquedas repetidas.

5. Roadmap de Implementación (Orden de trabajo para Jules)
[x] Fase 1: Configurar el entorno (package.json, tsconfig, etc.).
    - Se ha añadido configuración de testing con Vitest y JSDOM.

[x] Fase 2: Crear un script de conexión con la API de CheapShark y probar la recuperación de datos en consola.
    - Ejecutar script de verificación: `npx tsx scripts/verify-api.ts`
    - Ejecutar tests unitarios: `npm test`

[x] Fase 3: Diseñar la UI básica (Search Bar + Results Grid).

[ ] Fase 4: Conectar el frontend con la lógica de la API.

[ ] Fase 5: Añadir testing unitario para la lógica de filtrado de precios.
