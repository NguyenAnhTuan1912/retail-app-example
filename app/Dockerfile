# Build stage
FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN pnpm install
RUN npx prisma generate
COPY . .
RUN pnpm build
RUN pnpm prune --prod

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 19000
CMD ["node", "dist/main"]
