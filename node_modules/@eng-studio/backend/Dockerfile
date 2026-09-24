FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/backend/package.json ./apps/backend/

RUN npm install

COPY tsconfig.base.json ./
COPY packages/shared-types/ ./packages/shared-types/
COPY apps/backend/ ./apps/backend/

RUN npm run build --workspace=packages/shared-types
RUN npm run build --workspace=apps/backend

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/backend/package.json ./apps/backend/

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /usr/src/app/apps/backend/dist ./apps/backend/dist

EXPOSE 3000

CMD ["node", "apps/backend/dist/main.js"]
