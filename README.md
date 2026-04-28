# Demo Retail App

Ứng dụng mô phỏng các tính năng cơ bản của sàn thương mại điện tử (Shopee, Lazada) — xây dựng bằng NestJS + Prisma + PostgreSQL.

## Tech Stack

- **Backend:** NestJS (TypeScript)
- **Frontend:** React + Vite + TailwindCSS
- **ORM:** Prisma 7 (với Driver Adapter `@prisma/adapter-pg`)
- **Database:** PostgreSQL 16
- **Auth:** API Key (`X-API-Key` header)
- **Docs:** Swagger UI (`/api-docs`)
- **Container:** Docker Compose + Nginx

## Cấu trúc dự án

```
app/
├── src/
│   ├── main.ts                          # Entry point (Swagger, ValidationPipe, port 19000)
│   ├── app.module.ts                    # Root module
│   ├── prisma/
│   │   ├── prisma.module.ts             # Global Prisma module
│   │   └── prisma.service.ts            # PrismaClient wrapper (Driver Adapter)
│   ├── auth/
│   │   ├── auth.module.ts               # Auth module (global guards)
│   │   ├── auth.service.ts              # API Key validation
│   │   ├── auth.guard.ts                # AuthGuard — đọc X-API-Key header
│   │   ├── roles.guard.ts               # RolesGuard — phân quyền theo role
│   │   ├── roles.decorator.ts           # @Roles() decorator
│   │   └── current-user.decorator.ts    # @CurrentUser() decorator
│   ├── products/
│   ├── orders/
│   └── reviews/
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── migrations/
├── Dockerfile
└── package.json

web/
├── src/
│   ├── main.tsx                         # Entry point
│   ├── App.tsx                          # Router
│   ├── api.ts                           # API client
│   ├── pages/
│   │   ├── HomePage.tsx                 # Danh sách sản phẩm
│   │   └── ProductPage.tsx              # Chi tiết + reviews
│   └── components/
│       └── ProductCard.tsx
├── nginx.conf                           # Nginx: SPA + reverse proxy /api
├── Dockerfile
└── package.json

docker-compose.dev.yml                   # Dev: chỉ DB container
docker-compose.prod.yml              # Prod: DB + server containers
Dockerfile                           # Multi-stage build
```

## Database Schema

```
users ──────────< addresses
  │
  ├──────────< products ──────< product_images
  │               │
  ├──────────< orders ────────< order_items ───> products
  │               │
  │               └──────────── order_cancellations
  │
  ├──────────< reviews ──────> products
  ├──────────< cart_items ───> products
  └──────────< api_keys

categories (self-ref) ──< products
```

**Roles:** `admin`, `seller`, `buyer`
**Order statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/products` | Danh sách sản phẩm (cursor-based pagination) |
| GET | `/products/:productId` | Chi tiết sản phẩm |
| GET | `/orders` | Danh sách đơn hàng theo user (filter thời gian, search theo tên sản phẩm) |
| GET | `/orders/:orderId` | Chi tiết đơn hàng |
| DELETE | `/orders/:orderId` | Huỷ đơn hàng (trong vòng 7 ngày) |
| GET | `/reviews` | Reviews của sản phẩm (cursor-based pagination) |

## Cài đặt & Chạy

### Yêu cầu

- Node.js >= 22
- pnpm >= 10
- Docker & Docker Compose

### Dev environment

```bash
# 1. Cài dependencies
cd app && pnpm install
cd web && pnpm install

# 2. Khởi động PostgreSQL container
docker compose -f docker-compose.dev.yml up -d

# 3. Chạy migration + seed
cd app
npx prisma migrate dev
npx prisma generate
npx tsx prisma/seed.ts

# 4. Chạy backend (port 19000)
pnpm start:dev

# 5. Chạy frontend (port 3000, proxy /api → backend)
cd web
pnpm dev
```

### Prod environment

```bash
docker compose -f docker-compose.prod.yml up -d --build

# Chạy migration + seed (từ local, cần expose port 5432 hoặc set DATABASE_URL)
cd app
./scripts/migrate-and-seed.sh

# Hoặc chỉ định DATABASE_URL
DATABASE_URL="postgresql://retail:retail123@<host>:5432/retail_db" ./scripts/migrate-and-seed.sh
```

### Swagger UI

Truy cập: http://localhost:19000/api-docs

## Authentication

Tất cả API đều yêu cầu header `X-API-Key`. Server sẽ validate key trong bảng `api_keys`, xác định user và role tương ứng.

```bash
curl http://localhost:19000/products \
  -H "X-API-Key: <your-api-key>"
```

## API Examples

### Danh sách sản phẩm

```bash
# Trang đầu
curl "http://localhost:19000/products?limit=10" \
  -H "X-API-Key: <your-api-key>"

# Trang tiếp theo (dùng cursor từ response trước)
curl "http://localhost:19000/products?limit=10&cursor=<product-id>" \
  -H "X-API-Key: <your-api-key>"
```

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "iPhone 15 Pro Max",
      "basePrice": "29990000.00",
      "ratingAvg": "4.50",
      "stockQuantity": 100,
      "mainImageUrl": "https://example.com/image.jpg"
    }
  ],
  "nextCursor": "uuid-or-null"
}
```

### Chi tiết sản phẩm

```bash
curl "http://localhost:19000/products/<product-id>" \
  -H "X-API-Key: <your-api-key>"
```

### Danh sách đơn hàng (filter + search)

```bash
# Đơn hàng của user trong tháng này
curl "http://localhost:19000/orders?userId=<user-id>" \
  -H "X-API-Key: <your-api-key>"

# Filter theo khoảng thời gian + search theo tên sản phẩm
curl "http://localhost:19000/orders?userId=<user-id>&dateFrom=2026-01-01&dateTo=2026-04-24&search=iPhone" \
  -H "X-API-Key: <your-api-key>"
```

### Chi tiết đơn hàng

```bash
curl "http://localhost:19000/orders/<order-id>" \
  -H "X-API-Key: <your-api-key>"
```

### Huỷ đơn hàng

```bash
curl -X DELETE "http://localhost:19000/orders/<order-id>" \
  -H "X-API-Key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Đổi ý, không muốn mua nữa"}'
```

> Chỉ cho phép huỷ trong vòng 7 ngày kể từ khi đặt hàng.

### Reviews của sản phẩm

```bash
curl "http://localhost:19000/reviews?productId=<product-id>&limit=10" \
  -H "X-API-Key: <your-api-key>"
```

## Lambda (Chatbot Tools)

```bash
cd lambda

# Deploy toàn bộ Lambda functions
API_BASE_URL="https://<backend-url>" API_KEY="<api-key>" ./deploy.sh --profile <aws-profile>

# Update code
./update-code.sh --profile <aws-profile>

# Update biến môi trường (chỉ truyền những biến cần update)
API_KEY="<api-key>" ./update-env.sh --profile <aws-profile>
API_BASE_URL="https://<url>" API_KEY="<key>" ./update-env.sh --profile <aws-profile>
```

> Xem mô tả chi tiết từng function trong `lambda/TOOLS.md`.

## Useful Commands

```bash
# Prisma
npx prisma migrate dev --name <name>   # Tạo migration mới
npx prisma migrate deploy              # Apply migrations (cho dev khác / CI/CD)
npx prisma studio                      # GUI quản lý database

# Dev
pnpm start:dev                         # Watch mode
pnpm build                             # Build production
pnpm start:prod                        # Chạy production build

# Docker
docker compose -f docker-compose.dev.yml up -d      # Start DB
docker compose -f docker-compose.dev.yml down        # Stop DB
docker compose -f docker-compose.prod.yml up -d      # Start all (prod)

# Docker — Remove all (containers, volumes, images)
docker compose -f docker-compose.dev.yml down -v --rmi all
docker compose -f docker-compose.prod.yml down -v --rmi all
```

## License

MIT
