# Trackly

API REST para acortar y rastrear URLs, con estadísticas de clics por enlace.

Construido con **NestJS** · **TypeORM** · **SQLite (better-sqlite3)**

---

## Estructura del proyecto

```
src/
├── links/          # CRUD de enlaces acortados
│   ├── links.controller.ts
│   ├── links.service.ts
│   └── links.module.ts
├── stats/          # Estadísticas de clics por enlace
│   ├── stats.controller.ts
│   ├── stats.service.ts
│   └── stats.module.ts
├── app.module.ts   # Módulo raíz (TypeORM + módulos)
└── main.ts         # Bootstrap de la app
trackly.db          # Base de datos SQLite (generada automáticamente)
```

---

## Requisitos

- Node.js >= 20
- npm >= 10

---

## Instalación

```bash
npm install
```

---

## Comandos principales

```bash
# Desarrollo con hot-reload
npm run start:dev

# Compilar el proyecto
npm run build

# Ejecutar en producción (requiere build previo)
npm run start:prod

# Linter
npm run lint

# Formatear código
npm run format
```

---

## Tests

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Cobertura
npm run test:cov

# Tests e2e
npm run test:e2e
```

---

## Variables de entorno

Por ahora la app no requiere `.env`. La base de datos SQLite se crea automáticamente como `trackly.db` en la raíz del proyecto al iniciar.

> Para producción con Supabase/PostgreSQL se requerirá configurar `DATABASE_URL` (ver roadmap).

---

## Endpoints disponibles (fase actual)

| Método | Ruta     | Descripción                            |
| ------ | -------- | -------------------------------------- |
| —      | `/links` | Módulo de enlaces (en desarrollo)      |
| —      | `/stats` | Módulo de estadísticas (en desarrollo) |

---

## Roadmap

Ver [`ROADMAP.md`](./ROADMAP.md) para el plan de fases del proyecto.

---

## Licencia

UNLICENSED — Proyecto personal.
