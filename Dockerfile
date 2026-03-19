# --------------------------

# 📦 Étape 1 : Builder

# --------------------------

FROM node:22-alpine AS builder

WORKDIR /app

# Mise à jour sécurité Alpine + dépendances de build

RUN apk update \
 \
 && apk upgrade --no-cache \
 \
 && apk add --no-cache python3 make g++

# Dépendances

COPY package*.json yarn.lock ./

RUN yarn config set registry https://registry.npmjs.org \
 && yarn install --frozen-lockfile

COPY prisma ./prisma/

RUN yarn prisma generate

COPY . .

# Build

RUN yarn build

RUN rm -rf node_modules \
 && YARN_PRODUCTION=true yarn install --frozen-lockfile --production \
 && yarn prisma generate 

# --------------------------

# 🚀 Étape 2 : Runner

# --------------------------

FROM node:22-alpine AS runner

# Mise à jour sécurité Alpine

RUN apk update && apk upgrade --no-cache

# Création utilisateur non-root AVANT toute copie

RUN addgroup -S app && adduser -S app -G app

USER app

WORKDIR /app

ENV NODE_ENV=production

# Copie avec ownership correct (évite chown -R)

COPY --from=builder --chown=app:app /app/dist ./dist

COPY --from=builder --chown=app:app /app/node_modules ./node_modules

COPY --from=builder --chown=app:app /app/package*.json ./

COPY --from=builder --chown=app:app /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main"]
