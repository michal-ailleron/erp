# syntax=docker/dockerfile:1

# Node 22.22+ is required by the lockfile (vitest, jsdom, msw).
# bookworm-slim (glibc) keeps the native binaries (oxlint, rolldown) happy.
FROM node:22-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Dev server (default target). Vite binds to 0.0.0.0 so the host can reach it.
FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM dev AS build
RUN npm run build

# Production-style preview of the built bundle.
FROM base AS prod
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
