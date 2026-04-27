# Lambda Functions — Tool Descriptions

Mô tả cho từng Lambda function, dùng để gắn vào chatbot tool definitions.

## listProducts
Tìm kiếm và liệt kê danh sách sản phẩm. Hỗ trợ tìm theo tên, lọc theo danh mục và khoảng giá, phân trang bằng cursor.
- **Parameters:**
  - `search` (string, optional): Từ khoá tìm kiếm theo tên sản phẩm
  - `categoryId` (number, optional): ID danh mục để lọc (lấy từ listCategories)
  - `priceFrom` (number, optional): Giá tối thiểu (VNĐ)
  - `priceTo` (number, optional): Giá tối đa (VNĐ)
  - `limit` (number, optional): Số sản phẩm trả về (mặc định 20, tối đa 100)
  - `cursor` (string, optional): Cursor để lấy trang tiếp theo

## getProduct
Lấy thông tin chi tiết của một sản phẩm, bao gồm mô tả, giá, đánh giá, hình ảnh, người bán và danh mục.
- **Parameters:**
  - `productId` (string, required): ID của sản phẩm (UUID)

## listCategories
Liệt kê tất cả danh mục sản phẩm, bao gồm danh mục cha và danh mục con. Dùng để lấy categoryId cho việc lọc sản phẩm.
- **Parameters:** Không có

## listOrders
Liệt kê danh sách đơn hàng của một user. Hỗ trợ lọc theo khoảng thời gian và tìm kiếm theo tên sản phẩm trong đơn.
- **Parameters:**
  - `userId` (string, required): ID của user (UUID, lấy từ getMe)
  - `dateFrom` (string, optional): Ngày bắt đầu (ISO 8601, mặc định đầu tháng hiện tại)
  - `dateTo` (string, optional): Ngày kết thúc (ISO 8601, mặc định hiện tại)
  - `search` (string, optional): Tìm theo tên sản phẩm trong đơn hàng
  - `limit` (number, optional): Số đơn hàng trả về (mặc định 20)
  - `cursor` (string, optional): Cursor để lấy trang tiếp theo

## getOrder
Lấy thông tin chi tiết của một đơn hàng, bao gồm danh sách sản phẩm, trạng thái, địa chỉ giao hàng và thông tin huỷ (nếu có).
- **Parameters:**
  - `orderId` (string, required): ID của đơn hàng (UUID)

## cancelOrder
Huỷ một đơn hàng. Chỉ cho phép huỷ trong vòng 7 ngày kể từ khi đặt hàng.
- **Parameters:**
  - `orderId` (string, required): ID của đơn hàng (UUID)
  - `reason` (string, required): Lý do huỷ đơn hàng

## listReviews
Liệt kê các đánh giá (reviews) của một sản phẩm. Phân trang bằng cursor.
- **Parameters:**
  - `productId` (string, required): ID của sản phẩm (UUID)
  - `limit` (number, optional): Số reviews trả về (mặc định 10)
  - `cursor` (string, optional): Cursor để lấy trang tiếp theo

## getMe
Lấy thông tin tài khoản của user hiện tại (dựa trên API key). Trả về tên, email, số điện thoại, vai trò và user ID.
- **Parameters:** Không có

## getCart
Xem giỏ hàng hiện tại của user. Trả về danh sách sản phẩm, số lượng, giá và tổng tiền.
- **Parameters:** Không có

## addToCart
Thêm một sản phẩm vào giỏ hàng. Nếu sản phẩm đã có trong giỏ, số lượng sẽ được cộng dồn.
- **Parameters:**
  - `productId` (string, required): ID của sản phẩm (UUID)
  - `quantity` (number, optional): Số lượng thêm (mặc định 1)

## updateCartItem
Cập nhật số lượng của một sản phẩm trong giỏ hàng.
- **Parameters:**
  - `itemId` (string, required): ID của cart item (UUID, lấy từ getCart)
  - `quantity` (number, required): Số lượng mới (tối thiểu 1)

## removeCartItem
Xoá một sản phẩm khỏi giỏ hàng.
- **Parameters:**
  - `itemId` (string, required): ID của cart item (UUID, lấy từ getCart)
