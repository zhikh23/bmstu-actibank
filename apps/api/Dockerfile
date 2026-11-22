FROM node:26-slim AS builder

RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /repo

COPY . .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm --filter @bmstu-actibank/api build

FROM node:26-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@10 --activate

COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /repo/apps/api/dist ./apps/api/dist
COPY --from=builder /repo/apps/api/package.json ./apps/api/package.json
COPY --from=builder /repo/package.json ./package.json
COPY --from=builder /repo/apps/api/assets ./apps/api/assets

WORKDIR /app/apps/api

CMD ["node", "dist/main.js"]
