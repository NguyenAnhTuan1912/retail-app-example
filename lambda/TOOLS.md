# Lambda Functions — Tool Definitions

Tool descriptions for chatbot integration.

> **Auth:** API Key is configured via Lambda environment variable, not passed by LLM.
> **User context:** `user.userId` is automatically injected by the system, not passed by LLM.
> **UI rendering:** Functions marked `isUIRenderer: true` return `{ text, data }` — `text` for LLM to read, `data` (raw object) for frontend to render UI.

## listProducts

Search and list products. Supports keyword search, category and price filtering, cursor-based pagination.

- **Parameters:**
  - `search` (string, optional): Search keyword by product name
  - `categoryId` (number, optional): Category ID to filter (get from listCategories)
  - `priceFrom` (number, optional): Minimum price (VND)
  - `priceTo` (number, optional): Maximum price (VND)
  - `limit` (number, optional): Number of products to return (default 20, max 100)
  - `cursor` (string, optional): Cursor for next page

## getProduct

Get detailed information of a product including description, price, rating, images, seller and category.

- **isUIRenderer:** true
- **Parameters:**
  - `productId` (string, required): Product ID (UUID)

## listCategories

List all product categories including parent and child categories. Use to get categoryId for filtering products.

- **Parameters:** None

## listOrders

List orders for the current user. Supports date range filtering and search by product name within orders.

- **Parameters:**
  - `dateFrom` (string, optional): Start date (ISO 8601, defaults to first day of current month)
  - `dateTo` (string, optional): End date (ISO 8601, defaults to now)
  - `search` (string, optional): Search by product name in orders
  - `limit` (number, optional): Number of orders to return (default 20)
  - `cursor` (string, optional): Cursor for next page

## getOrder

Get order details including product list, status, shipping address and cancellation info (if any).

- **isUIRenderer:** true
- **Parameters:**
  - `orderId` (string, required): Order ID (UUID)

## cancelOrder

Cancel an order. Only allowed within 7 days of order creation.

- **Parameters:**
  - `orderId` (string, required): Order ID (UUID)
  - `reason` (string, required): Cancellation reason

## listReviews

List reviews for a product. Cursor-based pagination.

- **isUIRenderer:** true
- **Parameters:**
  - `productId` (string, required): Product ID (UUID)
  - `limit` (number, optional): Number of reviews to return (default 10)
  - `cursor` (string, optional): Cursor for next page

## getMe

Get current user account information. Returns name, email, phone, role and user ID.

- **Parameters:** None

## getCart

Get current user's shopping cart. Returns product list, quantities, prices and total.

- **isUIRenderer:** true
- **Parameters:** None

## addToCart

Add a product to the shopping cart. If the product already exists in cart, quantity will be incremented.

- **Parameters:**
  - `productId` (string, required): Product ID (UUID)
  - `quantity` (number, optional): Quantity to add (default 1)

## updateCartItem

Update quantity of a product in the shopping cart.

- **Parameters:**
  - `itemId` (string, required): Cart item ID (UUID, get from getCart)
  - `quantity` (number, required): New quantity (minimum 1)

## removeCartItem

Remove a product from the shopping cart.

- **Parameters:**
  - `itemId` (string, required): Cart item ID (UUID, get from getCart)

## renderUI

Render a UI component in the chat. Used to display rich content like order details, cart, reviews, etc.

- **isUIRenderer:** true
- **Parameters:**
  - `componentName` (string, required): Component to render. Valid values: `order-detail-chat-view`, `reviews-chat-view`, `cart-detail-chat-view`, `product-detail-chat-view`
  - `props` (object, required): Props to pass to the component
