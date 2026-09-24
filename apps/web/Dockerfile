FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/web/package.json ./apps/web/

RUN npm install

COPY tsconfig.base.json ./
COPY packages/shared-types/ ./packages/shared-types/
COPY apps/web/ ./apps/web/

RUN npm run build --workspace=packages/shared-types
RUN npm run build --workspace=apps/web

FROM nginx:1.25-alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
