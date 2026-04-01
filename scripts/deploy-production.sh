#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-main}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

log() {
  printf '\n[%s] %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$*"
}

require_clean_worktree() {
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "Refusing deployment: working tree has uncommitted changes." >&2
    git status --short
    exit 1
  fi
}

wait_for_health() {
  local service="$1"
  local timeout_seconds="${2:-180}"
  local started_at
  started_at="$(date +%s)"

  while true; do
    local container_id health
    container_id="$(docker compose ps -q "$service")"
    health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id" 2>/dev/null || true)"

    if [[ "$health" == "healthy" ]]; then
      log "Service '$service' is healthy."
      return 0
    fi

    if (( "$(date +%s)" - started_at > timeout_seconds )); then
      echo "Service '$service' did not become healthy within ${timeout_seconds}s." >&2
      docker compose ps
      docker compose logs --tail=200 "$service" || true
      exit 1
    fi

    sleep 3
  done
}

log "Validating repository state"
require_clean_worktree

log "Fetching origin/$BRANCH"
git fetch --prune origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

GIT_SHA="$(git rev-parse --short=12 HEAD)"
GIT_SHA_FULL="$(git rev-parse HEAD)"
export GIT_SHA

log "Deploying commit $GIT_SHA_FULL"

log "Building web image (no cache)"
docker compose build --no-cache web

log "Applying Prisma migrations in one-off container"
docker compose run --rm web npm run prisma:deploy

log "Starting stack with freshly-built images"
docker compose up -d --no-build --remove-orphans

wait_for_health db 120
wait_for_health web 240

log "Current compose status"
docker compose ps

log "Image metadata"
docker image inspect "rightbricks-web:${GIT_SHA}" --format 'Image={{index .RepoTags 0}} Created={{.Created}} VersionLabel={{index .Config.Labels "org.opencontainers.image.version"}}'

log "Recent web logs"
docker compose logs --tail=120 web

log "Deployment completed successfully for commit $GIT_SHA_FULL"
