# Anatomy Museum — Offline Demo Container
#
# Build once at home (with internet):  docker build -t anatomy-museum-demo .
# Run at the venue (no internet):      docker run -p 3000:3000 anatomy-museum-demo
#
# The app boots in DEMO_MODE=1 (SQLite instead of PostgreSQL), seeds the demo
# database on first start, and is ready for the presentation with:
#   admin@anatomy.edu.in / password123

# ---------------------------------------------------------------- base
FROM node:22-bookworm-slim AS base
ENV DEMO_MODE=1
WORKDIR /app

# ------------------------------------------------------- dependencies
FROM base AS deps
# Native modules (better-sqlite3) may compile from source if no prebuilt
# binary matches — provide a toolchain just for the install step.
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------- build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build in demo mode so any build-time env wiring matches the offline run.
RUN npm run build
# Drop dev dependencies for a leaner runtime image.
RUN npm prune --omit=dev

# -------------------------------------------------------------- runtime
FROM base AS runtime
ENV NODE_ENV=production \
    DEMO_MODE=1 \
    DEMO_DB_PATH=/app/data/demo.sqlite \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.mjs ./next.config.mjs
COPY --from=build /app/scripts ./scripts
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
 && mkdir -p /app/data
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
