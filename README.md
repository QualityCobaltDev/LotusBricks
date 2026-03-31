# RightBricks

Production-first scaffold for the RightBricks real estate marketplace + SaaS platform.

## Included in this scaffold
- Next.js (App Router) TypeScript app shell.
- Tailwind baseline and public navigation.
- Homepage + pricing page.
- Seller dashboard shell and admin shell.
- Prisma schema baseline for users/listings/leads/offers/audits.
- Docker Compose stack for Contabo VPS (Caddy + Web + PostgreSQL + Redis + Backup).
- Initial architecture blueprint and deployment notes.

## Quick start
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

## Production
```bash
docker compose build
docker compose up -d
```

## Core docs
- Product and architecture blueprint: `docs/blueprint.md`
- Deployment runbook: `docs/deployment-contabo.md`
