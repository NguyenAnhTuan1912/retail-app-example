# Build stage
FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json ./
RUN pnpm install
COPY . .
RUN npx prisma generate
RUN pnpm build

# Production stage
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json ./
RUN pnpm install --prod
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 19000
CMD ["node", "dist/main"]
