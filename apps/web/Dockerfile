FROM node:26-slim AS builder

RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /repo

COPY . .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm --filter @bmstu-actibank/web build

FROM scratch AS export
COPY --from=builder /repo/apps/web/dist/ /dist/
