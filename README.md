# RightBricks

Production-first foundation for the RightBricks real estate marketplace + SaaS platform.

## Included in this foundation
- Next.js (App Router) + TypeScript with typed routes.
- Tailwind-based public site shell with reusable header/footer and CTA primitives.
- Public marketplace routes: `/`, `/buy`, `/rent`, `/listings/[slug]`, `/sell`, `/landlords`, `/developers`, `/pricing`.
- Seller/admin shell routes: `/dashboard`, `/admin`.
- Temporary marketplace repository (`lib/marketplace-data.ts`) for realistic listings while Prisma wiring is completed.
- Prisma schema baseline for users, listings, leads, offers, notifications, and audits.
- Docker Compose stack for Contabo VPS (`Caddy + Web + PostgreSQL + Redis + Backup`) with web healthcheck.

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
