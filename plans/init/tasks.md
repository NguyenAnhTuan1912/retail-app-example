# Tasks: Khởi tạo ứng dụng Retail Demo

> Được tạo từ requirements.md — có bổ sung các phần còn thiếu sau khi verify.

---

## Phase 1: Khởi tạo project & cấu hình

### Task 1.1: Khởi tạo NestJS project

- [ ] Tạo NestJS project mới (sử dụng `@nestjs/cli`).
- [ ] Cài đặt các dependencies cần thiết:
  - `@nestjs/swagger` (Swagger/API docs)
  - `prisma` + `@prisma/client` (ORM)
  - `class-validator`, `class-transformer` (DTO validation)
- [ ] Cấu hình Swagger trong `main.ts` (path: `/api-docs`).
- [ ] Cấu hình server chạy port `19000`.

### Task 1.2: Cấu hình Docker & Environments

- [ ] Tạo `docker-compose.dev.yml`:
  - Service `db`: PostgreSQL container, bind volume cho data, expose port.
- [ ] Tạo `docker-compose.prod.yml`:
  - Service `db`: PostgreSQL container, bind volume cho data.
  - Service `server`: build từ Dockerfile, chạy port `19000`.
- [ ] Tạo `Dockerfile` cho NestJS server (multi-stage build).
- [ ] Tạo `.env.dev` và `.env.prod` với các biến môi trường (DATABASE_URL, PORT, ...).
- [ ] Tạo `.dockerignore` và cập nhật `.gitignore`.

---

## Phase 2: Database Schema (Prisma)

### Task 2.1: Khởi tạo Prisma & định nghĩa schema

- [ ] Chạy `npx prisma init`.
- [ ] Định nghĩa các enum trong `schema.prisma`:
  - `UserRole`: `admin`, `seller`, `buyer`
  - `OrderStatus`: `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- [ ] Định nghĩa các model:

**Users**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK, default auto-gen |
| username | String(50) | unique, not null |
| email | String(100) | unique, not null |
| password_hash | String | not null |
| full_name | String(100) | nullable |
| phone_number | String(20) | nullable |
| role | UserRole | default `buyer` |
| created_at | DateTime | default now() |
| updated_at | DateTime | @updatedAt |

**Addresses**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users, onDelete: Cascade |
| recipient_name | String(100) | not null |
| phone_number | String(20) | not null |
| province | String(100) | not null |
| district | String(100) | not null |
| ward | String(100) | not null |
| detail_address | String | nullable |
| is_default | Boolean | default false |
| created_at | DateTime | default now() *(bổ sung)* |

**Categories**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | Int | PK, auto-increment |
| name | String(100) | not null |
| parent_id | Int | FK → categories (self-ref), nullable |
| slug | String(100) | unique, not null |

**Products**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| seller_id | UUID | FK → users, onDelete: Cascade |
| category_id | Int | FK → categories, onDelete: SetNull, nullable |
| name | String(255) | not null |
| description | String | nullable |
| base_price | Decimal(12,2) | not null |
| stock_quantity | Int | default 0 |
| rating_avg | Decimal(3,2) | default 0 |
| created_at | DateTime | default now() |
| updated_at | DateTime | @updatedAt *(bổ sung)* |

**ProductImages**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| product_id | UUID | FK → products, onDelete: Cascade |
| url | String | not null |
| is_main | Boolean | default false |

**CartItems**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users, onDelete: Cascade |
| product_id | UUID | FK → products, onDelete: Cascade |
| quantity | Int | not null, check > 0 |
| created_at | DateTime | default now() *(bổ sung)* |
| @@unique | [user_id, product_id] | composite unique |

**Orders**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| buyer_id | UUID | FK → users |
| total_amount | Decimal(12,2) | not null |
| status | OrderStatus | default `pending` |
| shipping_address | String | not null |
| created_at | DateTime | default now() |
| updated_at | DateTime | @updatedAt *(bổ sung)* |

**OrderItems**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| order_id | UUID | FK → orders, onDelete: Cascade |
| product_id | UUID | FK → products |
| quantity | Int | not null |
| price_at_purchase | Decimal(12,2) | not null |

**Reviews**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| product_id | UUID | FK → products, onDelete: Cascade |
| user_id | UUID | FK → users |
| rating | Int | check >= 1 AND <= 5 |
| comment | String | nullable |
| created_at | DateTime | default now() |
| @@unique | [product_id, user_id] | mỗi user chỉ review 1 lần/sản phẩm *(bổ sung)* |

**OrderCancellations** *(bảng mới — bổ sung)*
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| order_id | UUID | FK → orders, onDelete: Cascade, unique |
| reason | String | not null |
| cancelled_at | DateTime | default now() |

**ApiKeys** *(bảng mới — bổ sung cho Authentication)*
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users, onDelete: Cascade |
| key | String(64) | unique, not null |
| is_active | Boolean | default true |
| created_at | DateTime | default now() |
| expires_at | DateTime | nullable (null = không hết hạn) |

### Task 2.2: Tạo indexes

- [ ] `products`: index trên `seller_id`, `category_id`, `created_at`
- [ ] `products`: GIN index trên `name` (hỗ trợ full-text search cho tìm kiếm order theo tên sản phẩm)
- [ ] `orders`: index trên `buyer_id`, `created_at`, composite index `[buyer_id, created_at]`
- [ ] `order_items`: index trên `order_id`, `product_id`
- [ ] `reviews`: index trên `product_id`, `created_at`
- [ ] `cart_items`: index trên `user_id`
- [ ] `addresses`: index trên `user_id`
- [ ] `categories`: index trên `parent_id`
- [ ] `product_images`: index trên `product_id`
- [ ] `api_keys`: index trên `key` (lookup nhanh khi authenticate), `user_id`

### Task 2.3: Chạy migration

- [ ] Tạo migration đầu tiên: `npx prisma migrate dev --name init`.
- [ ] Verify migration chạy thành công trên PostgreSQL container.

---

## Phase 3: Cấu trúc NestJS Modules

### Task 3.1: Tạo Prisma Module

- [ ] Tạo `PrismaService` (extends `PrismaClient`, implements `OnModuleInit`).
- [ ] Tạo `PrismaModule` (global module).

### Task 3.2: Tạo các feature modules

- [ ] `AuthModule` — guard, service, decorator
- [ ] `ProductsModule` — controller, service, DTOs
- [ ] `OrdersModule` — controller, service, DTOs
- [ ] `ReviewsModule` — controller, service, DTOs

> Các module khác (Users, Cart, Categories, ...) sẽ bổ sung sau khi seed data.

---

## Phase 4: Authentication & Authorization (API Key)

### Task 4.0: Implement API Key Auth

- [ ] Tạo `AuthModule` với `AuthGuard` và `AuthService`.
- [ ] `AuthGuard` (NestJS Guard):
  - Đọc header `X-API-Key` từ request.
  - Lookup trong bảng `api_keys` (check `is_active = true` và chưa hết hạn).
  - Nếu hợp lệ: gắn `user` (kèm `role`) vào `request.user`.
  - Nếu không hợp lệ: trả về `401 Unauthorized`.
- [ ] Tạo custom decorator `@CurrentUser()` để lấy user từ request.
- [ ] Tạo `@Roles()` decorator + `RolesGuard` để phân quyền theo role.
- [ ] Apply `AuthGuard` globally (hoặc per-controller tuỳ nhu cầu).
- [ ] Cấu hình Swagger: thêm `ApiSecurity` / `ApiHeader` cho `X-API-Key`.

---

## Phase 5: Implement APIs

### Task 5.1: GET /products — Danh sách sản phẩm

- [ ] Request DTO: `cursor` (optional, UUID), `limit` (optional, default 20).
- [ ] Response DTO: trả về thông tin cơ bản (`id`, `name`, `base_price`, `rating_avg`, `stock_quantity`, main image URL).
- [ ] Cursor-based pagination: sử dụng `created_at` + `id` làm cursor.
- [ ] Sắp xếp theo `created_at DESC`.

### Task 5.2: GET /products/:productId — Chi tiết sản phẩm

- [ ] Response DTO: toàn bộ thông tin product + images + category + seller info (basic).
- [ ] Xử lý 404 nếu không tìm thấy.

### Task 5.3: GET /orders/:orderId — Chi tiết đơn hàng

- [ ] Response DTO: thông tin order + order items (kèm product basic info) + cancellation info (nếu có).
- [ ] Xử lý 404 nếu không tìm thấy.

### Task 5.4: GET /orders?userId= — Danh sách đơn hàng theo user

- [ ] Request DTO: `userId` (required), `dateFrom` (optional, default đầu tháng hiện tại), `dateTo` (optional, default now), `search` (optional, tìm theo tên sản phẩm), `cursor` (optional), `limit` (optional, default 20).
- [ ] Search logic: khi có param `search`, join `order_items` → `products` và filter theo `products.name ILIKE %search%`.
- [ ] Cursor-based pagination: sử dụng `created_at` + `id` làm cursor.
- [ ] Sắp xếp theo `created_at DESC`.
- [ ] Validate `userId` tồn tại.

### Task 5.5: GET /reviews?productId= — Reviews của sản phẩm

- [ ] Request DTO: `productId` (required), `cursor` (optional), `limit` (optional, default 20).
- [ ] Response DTO: review info + user basic info (username, full_name).
- [ ] Cursor-based pagination: sử dụng `created_at` + `id` làm cursor.
- [ ] Sắp xếp theo `created_at DESC`.

### Task 5.6: DELETE /orders/:orderId — Huỷ đơn hàng

- [ ] Request DTO: `reason` (required, trong body).
- [ ] Validate:
  - Order tồn tại.
  - Order chưa bị huỷ (`status !== 'cancelled'`).
  - Order được tạo trong vòng 7 ngày.
- [ ] Cập nhật `orders.status` → `cancelled`.
- [ ] Tạo record trong bảng `order_cancellations`.
- [ ] Trả về thông tin order đã cập nhật.

---

## Phase 6: Swagger & Hoàn thiện

### Task 6.1: Swagger decorators

- [ ] Thêm `@ApiTags`, `@ApiOperation`, `@ApiResponse` cho tất cả endpoints.
- [ ] Thêm `@ApiProperty` cho tất cả DTOs.
- [ ] Verify Swagger UI hiển thị đúng tại `/api-docs`.

### Task 6.2: Error handling

- [ ] Tạo global exception filter (hoặc dùng built-in của NestJS).
- [ ] Đảm bảo trả về format lỗi nhất quán (status, message, error).

### Task 6.3: Kiểm tra tổng thể

- [ ] Chạy dev environment (`docker-compose.dev.yml` + `npm run start:dev`).
- [ ] Test tất cả endpoints qua Swagger UI.
- [ ] Chạy prod environment (`docker-compose.prod.yml`) và verify.
