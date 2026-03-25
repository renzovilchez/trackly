# Trackly — Roadmap

## Fase 1 · MVP funcional con SQLite 🔨 *(en desarrollo)*

**Objetivo:** tener una API completamente funcional localmente con SQLite.

- [ ] Entidad `Link` (url original, slug/código corto, fecha de creación)
- [ ] `POST /links` — crear enlace acortado
- [ ] `GET /links` — listar todos los enlaces
- [ ] `GET /links/:id` — obtener un enlace
- [ ] `DELETE /links/:id` — eliminar enlace
- [ ] Redirección: `GET /:code` → redirige a la URL original
- [ ] Entidad `Stat` (enlace, ip, fecha del clic)
- [ ] Registro automático de clic al redirigir
- [ ] `GET /stats/:linkId` — obtener clics de un enlace
- [ ] Validación de DTOs con `class-validator`
- [ ] Manejo global de errores (`HttpException`)
- [ ] Tests unitarios mínimos por servicio

**Stack:** NestJS · TypeORM · SQLite (better-sqlite3)

---

## Fase 2 · Despliegue en producción con SQLite 🚀

**Objetivo:** subir la API a un servidor y que sea accesible desde internet.

> SQLite en producción es viable para proyectos personales/pequeños con bajo tráfico.  
> El archivo `.db` vive en el servidor, no en Vercel (Vercel es serverless, **no** soporta SQLite persistente).

- [ ] Elegir plataforma: **Railway** o **Render** (ambas soportan Node.js con filesystem persistente)
- [ ] Configurar variables de entorno (`PORT`, etc.)
- [ ] Ajustar `nest-cli.json` y script `start:prod` para producción
- [ ] Agregar `Dockerfile` opcional para despliegue containerizado
- [ ] CI básico: lint + tests en GitHub Actions antes de cada deploy
- [ ] Probar redirecciones y estadísticas en producción

**Nota Vercel:** Vercel sólo sirve para el **frontend**. Para esta API NestJS con SQLite, usar Railway o Render.

---

## Fase 3 · Frontend básico (opcional)

**Objetivo:** interfaz mínima para crear y ver enlaces sin tocar la API a mano.

- [ ] Proyecto Vite + React (o Next.js) en `/client` o repo separado
- [ ] Formulario para acortar URL
- [ ] Tabla de enlaces con su código corto y clics totales
- [ ] Página de estadísticas por enlace
- [ ] Deploy del frontend en **Vercel** apuntando a la API en Railway/Render

---

## Fase 4 · Migración a PostgreSQL (Supabase) ☁️

**Objetivo:** cuando el proyecto crezca o necesites colaborar/escalar, migrar a una base de datos en la nube.

- [ ] Crear proyecto en [Supabase](https://supabase.com)
- [ ] Cambiar driver en `app.module.ts`: `better-sqlite3` → `postgres`
- [ ] Instalar `pg` y `@types/pg`
- [ ] Configurar `DATABASE_URL` como variable de entorno
- [ ] Ejecutar migraciones con TypeORM (`typeorm migration:generate` / `migration:run`)
- [ ] Desactivar `synchronize: true` en producción, usar migraciones
- [ ] Verificar que todos los tests y endpoints siguen funcionando

**Por qué hacerlo en esta fase y no antes:**  
SQLite es perfectamente válido para las fases 1–2.  
La migración tiene sentido cuando necesites múltiples instancias, backups automáticos o acceso concurrente real.

---

## Fase 5 · Features avanzados (futuro)

Ideas para cuando el núcleo esté consolidado:

- [ ] Autenticación (JWT) para tener links privados por usuario
- [ ] Dashboard de métricas (país, navegador, referer del clic)
- [ ] Expiración de links por fecha o número de clics
- [ ] Rate limiting y protección anti-abuso
- [ ] Paginación y búsqueda en `GET /links`
- [ ] Webhooks al registrar un clic

---

## Decisiones técnicas rápidas

| Pregunta | Respuesta |
|---|---|
| ¿Puedo desplegar con SQLite? | Sí, en Railway/Render. **No** en Vercel |
| ¿Cuándo migrar a Supabase? | Fase 4, cuando necesites escalar o colaborar |
| ¿Frontend en Vercel? | Sí, sin problema (solo el frontend) |
| ¿TypeORM `synchronize: true` en prod? | No, usar migraciones desde Fase 2 |
