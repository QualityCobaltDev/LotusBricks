FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
COPY package*.json ./
RUN npm ci

FROM base AS builder
ARG APP_VERSION=dev
ENV NEXT_PUBLIC_APP_VERSION=${APP_VERSION}
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ARG APP_VERSION=dev
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_APP_VERSION=${APP_VERSION}
LABEL org.opencontainers.image.version=${APP_VERSION}

RUN apk add --no-cache libc6-compat openssl \
    && addgroup -S nextjs \
    && adduser -S nextjs -G nextjs

COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nextjs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000

ENV HOSTNAME=0.0.0.0
ENV PORT=3000

CMD ["node", "server.js"]
