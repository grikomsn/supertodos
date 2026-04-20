# supertodos

Vite + React client with Supabase Auth (email/password) and an Express API backed by Postgres (`pg`) for todo CRUD. Access tokens are verified with Supabase JWKS (ES256).

## Prerequisites

- [Bun](https://bun.sh) 1.3+ (or Node 20+ with another package manager — lockfile is `bun.lock`)
- A [Supabase](https://supabase.com) project with a `public.todos` table and Auth configured

## Setup

1. Copy [`.env.example`](.env.example) to `.env` and fill in values from the Supabase Dashboard (API URL/keys, database connection string, optional `SUPABASE_URL` for JWKS).

2. Install and run:

```bash
bun install
bun run dev
```

- Client: [http://localhost:5173](http://localhost:5173) (Vite; proxies `/api` to the API in dev)
- API: [http://localhost:3000](http://localhost:3000) (`PORT` overrides the port)

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | API (`tsx watch`) + Vite dev server |
| `bun run dev:server` | API only |
| `bun run build` | Typecheck + production client build |
| `bun run lint` | ESLint (`src/` + `server/` + `vite.config.ts`) |
| `bun run preview` | Preview the Vite production build |

## Project layout

- `src/` — React app, Supabase client for auth only, REST calls to `/api/todos`
- `server/` — Express, JWT verification, `pg` queries scoped by JWT `sub`
