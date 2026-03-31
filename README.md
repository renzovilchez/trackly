# 🚀 Trackly — Acortador de URLs con métricas

**Trackly** es una aplicación ligera para acortar URLs y registrar métricas básicas de uso (clics, origen y dispositivo), construida con un enfoque simple y eficiente.

![Trackly Demo](https://raw.githubusercontent.com/renzovilchez/trackly/main/public/trackly.png)

---

## ✨ Características

- 🔗 **Acortamiento de URLs**: Genera slugs únicos para enlaces largos.
- 📊 **Registro de clics**: Guarda información básica de cada visita:
  - IP
  - User-Agent (navegador/dispositivo)
  - Referer (origen del tráfico)
- ⚡ **UI rápida y simple**: Construida con HTMX y Tailwind CSS.
- 📦 **Paginación**: Listado de enlaces con `page` y `limit`.
- 🧱 **Arquitectura backend**: API REST con NestJS y TypeORM.
- 🐘 **Base de datos**: PostgreSQL.

---

## 🛠️ Stack Tecnológico

- Backend: NestJS
- Base de Datos: PostgreSQL + TypeORM
- Frontend: HTMX + Tailwind CSS
- Lenguaje: TypeScript

---

## ⚙️ Instalación

### Requisitos

- Node.js >= 20
- npm >= 10

### Pasos

```bash
git clone https://github.com/renzovilchez/trackly.git
cd trackly
npm install
npm run start:dev
```

---

## 🚀 API

### Crear link

POST /links

Body:
{
"url": "https://google.com"
}

---

### Listar links (paginado)

GET /links?page=1&limit=10

Respuesta:
{
"data": [...],
"total": 100,
"page": 1,
"lastPage": 10
}

---

### Obtener link por ID

GET /links/:id

---

### Obtener estadísticas de un link

GET /links/:id/stats

Incluye:

- total de clics
- historial de visitas

---

### Redirección

GET /:slug

Registra automáticamente:

- IP
- navegador
- referer

---

## 📁 Estructura

- src/links → lógica de enlaces
- src/stats → métricas de clics
- public/ → frontend (HTMX)
- test/ → pruebas

---

Hecho por Renzo Vilchez | [renzovilchez.dev](https://renzovilchez.dev)
