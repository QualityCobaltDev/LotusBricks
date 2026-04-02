#!/bin/sh
set -eu

log() {
  printf '[startup] %s\n' "$*"
}

if [ -z "${DATABASE_URL:-}" ]; then
  log "fatal: DATABASE_URL is required for container startup"
  exit 1
fi

log "waiting for database network endpoint"
node ./scripts/wait-for-db.mjs

log "database reachable"
log "applying Prisma migrations (prisma migrate deploy)"
node ./node_modules/prisma/build/index.js migrate deploy --schema ./prisma/schema.prisma

log "starting Next.js server"
exec node server.js
