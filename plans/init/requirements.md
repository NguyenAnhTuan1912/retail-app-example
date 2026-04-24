# Requirements: Khởi tạo một ứng dụng dành cho ngành bán lẻ (retail)

Mô tả: ứng dụng mô phỏng lại các tính năng đơn giản giống với Shopee, Lazada.

## Technologies

Các công nghệ sử dụng:

- Demo: setup Swagger để demo và cho API Docs là được.
- Backend: NestJS, dùng Prisma ORM để connect tới database (có migration).
- Database: PostgreSQL.

## Environments

Sẽ chia thành 2 môi trường:

- Dev: chạy database trong container (có bind volume), server chạy bình thường (port 19000).
- Prod: chạy database và server trong container (docker compose), bind volume cho database và server vẫn chạy port 19000.

## Database Entity Schema

Một số các schema cho các entity như sau, có một số entity cần lưu ý: user, address, category, product, product_image, cart_items_ order_items và reviews. Thông tin chi tiết thì bạn có thể xem bên dưới.

> Note: phân chia rõ ràng các DTO (Request, Response và Entity).

### Quản lý người dùng và phân quyền

```sql
-- Tạo ENUM cho vai trò người dùng
CREATE TYPE user_role AS ENUM ('admin', 'seller', 'buyer');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    role user_role DEFAULT 'buyer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    detail_address TEXT,
    is_default BOOLEAN DEFAULT false
);
```

### Danh mục và sản phẩm

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES categories(id), -- Cho phép danh mục đa cấp
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(12, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT false
);
```

### Giỏ hàng và đơn hàng

```sql
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    UNIQUE(user_id, product_id)
);

-- Trạng thái đơn hàng
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    total_amount DECIMAL(12, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(12, 2) NOT NULL -- Lưu giá tại thời điểm mua để tránh thay đổi sau này
);
```

### Đánh giá (chỉ có Review)

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Authentication & Authorization

Sử dụng API Key để xác thực và phân quyền:

- Mỗi user sẽ có một API Key riêng, lưu trong bảng `api_keys`.
- Client gửi API Key qua header `X-API-Key` trong mỗi request.
- Server validate API Key, xác định user và role tương ứng.
- Phân quyền dựa trên `role` của user (admin, seller, buyer).

```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key VARCHAR(64) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE -- nullable, null = không hết hạn
);
```

## Features

Mình sẽ cần tập trung vào một số tính năng như sau:

- Lấy thông tin danh sách các sản phẩm - chỉ cần trả về một số thông tin cơ bản trong table (GET /products). Cho phép query pagination (cursor based).
- Lấy thông tin chi tiết của một sản phẩm - trả về toàn bộ thông tin (GET /product/:productId).
- Kiểm tra thông tin của order - cũng có thể hiểu là lây thông tin chi tiết của order (GET /orders/:orderId).
- Kiểm tra thông tin các order của 1 người dùng, trong một khoảng thời gian (GET /orders?userId=). Cho phép query pagination (cursor based). Khoảng thời gian thì là date from và date to, default value cho date from là đầu tháng và date to là tới hiện tại. Cho phép search order theo tên sản phẩm (query param `search`), tìm kiếm trong tên các sản phẩm thuộc order items.
- Xem review của một sản phẩm. (GET /reviews?productId=). Cho phép query pagination (cursor based).
- Huỷ đơn hàng, nhưng chỉ cho phép 1 tuần kể từ khi đặt hàng, đi theo đó là lý do huỷ đơn hàng. (Lý do huỷ đơn thì bạn có thể tạo một table mới để lưu thông tin) (DELETE /orders/:orderId)

> Note: về phần dữ liệu còn lại thì chúng ta sẽ seed sau, nên chưa cần đầy đủ tính năng. Nên bạn có thể thấy là các thông tin ở trên chỉ toàn là GET, chỉ có 1 DELETE.