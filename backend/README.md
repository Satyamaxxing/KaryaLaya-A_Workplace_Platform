# Node.js Express backend (Postgres) for your React frontend

## What is included
- Express app with endpoints that match the API shapes your frontend expects:
  /api/health, /api/projects, /api/projects/:id, /api/tasks, /api/messages, /api/notifications, /api/users
- Creates tables and seeds sample data on first run (idempotent)
- Docker & docker-compose ready (Postgres + backend)

## Quick start with Docker (recommended)
1. Put this folder next to your frontend repo.
2. Run: `docker compose up --build`
3. Backend: http://localhost:8000
4. Test: `curl http://localhost:8000/api/health`

## Local (without Docker)
1. Install Node 18+
2. `npm install`
3. Start Postgres locally and set `DATABASE_URL` in `.env`
4. `npm run seed` (optional) then `npm start`

## Notes
- The API returns JSON shapes matching your frontend mock data (members arrays, tasks_summary, avatar URLs).
- If you want auth added, I can add JWT endpoints next.