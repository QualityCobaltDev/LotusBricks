# RightBricks Rebuild

Production-grade rewrite of the RightBricks property platform using Next.js App Router + Prisma + PostgreSQL.

## Architecture
- Public marketing and listing pages.
- Shared sign-in endpoint with server-side role routing.
- Admin area (`/admin`) for users, listings, inquiries, pricing, and content visibility.
- Customer area (`/account`) with saved listings.
- API routes with Zod validation and role checks.
- Prisma-backed content and business entities.
- Docker Compose stack (`web`, `db`, `proxy`) behind Caddy.

## Environment
Copy `.env.example` to `.env` and set secure values.

## Run locally
```bash
npm install
npm run prisma:generate
npm run build
npm run dev
```

## Docker deployment
```bash
./scripts/deploy-production.sh main
```

This deployment script fails fast, stamps images with the deployed commit SHA, rebuilds the Docker stack deterministically, waits for Postgres health, runs `prisma generate`, runs `prisma db push`, seeds baseline data, then starts web/proxy and prints health + logs.

## Seed credentials
- Admin: `admin@rightbricks.online` / `Admin123!`
- Customer: `customer@rightbricks.online` / `Customer123!`


## Database lifecycle
```bash
npm run prisma:generate
npm run prisma:push
npm run seed
```

Use `prisma db push` as the production schema-sync strategy for this repository.
