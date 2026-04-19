# NEXORA LITE

Base funcional full-stack lista para escalar con arquitectura modular:

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** FastAPI + SQLAlchemy + Pydantic
- **DB:** PostgreSQL
- **Auth:** JWT + hash seguro de contraseñas

## Estructura

```text
backend/
  app/
    main.py
    core/
    db/
    models/
    schemas/
    routers/
    services/
    utils/
frontend/
  src/
    components/
    pages/
    layouts/
    hooks/
    services/
    context/
    utils/
```

## Backend (FastAPI)

### 1) Configurar entorno

```bash
cd /home/runner/work/Nexora/Nexora/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 2) Configurar PostgreSQL

Crear base de datos (ejemplo):

```sql
CREATE DATABASE nexora_lite;
```

Ajustar `DATABASE_URL` en `backend/.env`.

### 3) Ejecutar API

```bash
cd /home/runner/work/Nexora/Nexora/backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API disponible en `http://localhost:8000` y docs en `http://localhost:8000/docs`.

## Frontend (React + Vite + Tailwind)

### 1) Instalar dependencias

```bash
cd /home/runner/work/Nexora/Nexora/frontend
npm install
cp .env.example .env
```

### 2) Ejecutar app

```bash
cd /home/runner/work/Nexora/Nexora/frontend
npm run dev
```

Frontend disponible en `http://localhost:5173`.

## Endpoints base implementados

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /users/me`
- `GET /users/portfolio`
- `PUT /users/portfolio` (admin)
- `GET/POST/PUT/DELETE /tasks/*`
- `GET/POST/PUT/DELETE /goals/*`
- `GET/POST/PUT/DELETE /notes/*`
- `GET/POST/PUT/DELETE /projects/*`
- `GET /system/daily-focus`
- `GET /system/dashboard-summary`

## Módulos frontend implementados

- Auth (register/login/logout)
- Dashboard (stats, daily focus, recientes)
- CRUD de Tasks, Goals, Notes, Projects
- Owner/Admin panel para editar portfolio

## Notas de seguridad y arquitectura

- Passwords hasheadas con `passlib[bcrypt]`
- JWT firmado con secreto configurable por `.env`
- CORS configurable por variable de entorno
- Diseño modular para escalar por dominios y servicios
