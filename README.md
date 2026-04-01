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

This deployment script fails fast, stamps the image with the deployed commit SHA, applies Prisma migrations, starts containers only after a successful build, and prints logs plus container health.

## Seed credentials
- Admin: `admin@rightbricks.com` / `Admin123!`
- Customer: `customer@rightbricks.com` / `Customer123!`
