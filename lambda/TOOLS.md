# Tool Definitions — Demo Retail App

Mô tả các tool để LLM biết khi nào cần gọi. Dùng cho Bedrock Agent, OpenAI function calling, hoặc bất kỳ LLM tool-use framework nào.

## Tools

### 1. listProducts

**Khi nào gọi:** Khi người dùng muốn xem, tìm kiếm, hoặc duyệt danh sách sản phẩm. Ví dụ: "có sản phẩm gì?", "cho xem điện thoại", "trang tiếp theo".

```json
{
  "name": "listProducts",
  "description": "Lấy danh sách sản phẩm đang bán trên hệ thống. Hỗ trợ phân trang. Dùng khi người dùng muốn xem, duyệt, hoặc tìm sản phẩm.",
  "parameters": {
    "type": "object",
    "properties": {
      "limit": {
        "type": "integer",
        "description": "Số sản phẩm trả về mỗi trang (1-100, mặc định 20)"
      },
      "cursor": {
        "type": "string",
        "description": "ID sản phẩm cuối cùng của trang trước, dùng để lấy trang tiếp theo"
      }
    },
    "required": []
  }
}
```

### 2. getProduct

**Khi nào gọi:** Khi người dùng muốn xem chi tiết một sản phẩm cụ thể. Ví dụ: "cho xem chi tiết iPhone 15", "sản phẩm này giá bao nhiêu?", "mô tả sản phẩm X".

```json
{
  "name": "getProduct",
  "description": "Lấy thông tin chi tiết của một sản phẩm bao gồm mô tả, giá, tồn kho, hình ảnh, danh mục và người bán. Dùng khi người dùng hỏi chi tiết về một sản phẩm cụ thể.",
  "parameters": {
    "type": "object",
    "properties": {
      "productId": {
        "type": "string",
        "description": "UUID của sản phẩm cần xem chi tiết"
      }
    },
    "required": ["productId"]
  }
}
```

### 3. listOrders

**Khi nào gọi:** Khi người dùng muốn xem đơn hàng của mình, tìm đơn hàng theo thời gian hoặc theo tên sản phẩm. Ví dụ: "đơn hàng của tôi", "tôi đã mua gì tháng 3?", "tìm đơn hàng có iPhone".

```json
{
  "name": "listOrders",
  "description": "Lấy danh sách đơn hàng của một người dùng. Hỗ trợ lọc theo khoảng thời gian, tìm kiếm theo tên sản phẩm trong đơn, và phân trang. Dùng khi người dùng muốn xem lịch sử mua hàng hoặc tìm đơn hàng cụ thể.",
  "parameters": {
    "type": "object",
    "properties": {
      "userId": {
        "type": "string",
        "description": "UUID của người dùng cần xem đơn hàng"
      },
      "dateFrom": {
        "type": "string",
        "description": "Ngày bắt đầu lọc (ISO 8601, ví dụ: 2026-01-01). Mặc định: đầu tháng hiện tại"
      },
      "dateTo": {
        "type": "string",
        "description": "Ngày kết thúc lọc (ISO 8601). Mặc định: hiện tại"
      },
      "search": {
        "type": "string",
        "description": "Từ khoá tìm kiếm theo tên sản phẩm trong đơn hàng"
      },
      "limit": {
        "type": "integer",
        "description": "Số đơn hàng trả về mỗi trang (1-100, mặc định 20)"
      },
      "cursor": {
        "type": "string",
        "description": "ID đơn hàng cuối cùng của trang trước, dùng để lấy trang tiếp theo"
      }
    },
    "required": ["userId"]
  }
}
```

### 4. getOrder

**Khi nào gọi:** Khi người dùng muốn xem chi tiết một đơn hàng cụ thể. Ví dụ: "chi tiết đơn hàng X", "đơn hàng này gồm những gì?", "trạng thái đơn hàng".

```json
{
  "name": "getOrder",
  "description": "Lấy thông tin chi tiết đơn hàng bao gồm danh sách sản phẩm, số lượng, giá mua, trạng thái, địa chỉ giao hàng, và thông tin huỷ đơn (nếu có). Dùng khi người dùng hỏi chi tiết về một đơn hàng cụ thể.",
  "parameters": {
    "type": "object",
    "properties": {
      "orderId": {
        "type": "string",
        "description": "UUID của đơn hàng cần xem chi tiết"
      }
    },
    "required": ["orderId"]
  }
}
```

### 5. cancelOrder

**Khi nào gọi:** Khi người dùng muốn huỷ đơn hàng. Ví dụ: "huỷ đơn hàng X", "tôi muốn cancel đơn này", "không muốn mua nữa". Chỉ huỷ được trong vòng 7 ngày kể từ khi đặt.

```json
{
  "name": "cancelOrder",
  "description": "Huỷ một đơn hàng. Chỉ cho phép huỷ trong vòng 7 ngày kể từ khi đặt hàng và đơn chưa bị huỷ trước đó. Yêu cầu lý do huỷ. Dùng khi người dùng yêu cầu huỷ đơn hàng.",
  "parameters": {
    "type": "object",
    "properties": {
      "orderId": {
        "type": "string",
        "description": "UUID của đơn hàng cần huỷ"
      },
      "reason": {
        "type": "string",
        "description": "Lý do huỷ đơn hàng (bắt buộc)"
      }
    },
    "required": ["orderId", "reason"]
  }
}
```

### 6. listReviews

**Khi nào gọi:** Khi người dùng muốn xem đánh giá, nhận xét về một sản phẩm. Ví dụ: "review sản phẩm này thế nào?", "người khác nói gì về iPhone?", "đánh giá sản phẩm X".

```json
{
  "name": "listReviews",
  "description": "Lấy danh sách đánh giá (review) của một sản phẩm, bao gồm số sao, bình luận và thông tin người đánh giá. Hỗ trợ phân trang. Dùng khi người dùng muốn xem nhận xét, đánh giá của người mua khác về sản phẩm.",
  "parameters": {
    "type": "object",
    "properties": {
      "productId": {
        "type": "string",
        "description": "UUID của sản phẩm cần xem đánh giá"
      },
      "limit": {
        "type": "integer",
        "description": "Số đánh giá trả về mỗi trang (1-100, mặc định 20)"
      },
      "cursor": {
        "type": "string",
        "description": "ID đánh giá cuối cùng của trang trước, dùng để lấy trang tiếp theo"
      }
    },
    "required": ["productId"]
  }
}
```
