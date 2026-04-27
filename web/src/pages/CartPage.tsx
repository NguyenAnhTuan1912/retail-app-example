import { Link } from "react-router-dom";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "../core/cart/query";
import { formatPrice } from "../utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { data: items, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading)
    return <p className="p-8 text-center text-gray-500">Đang tải...</p>;

  const cartItems = items ?? [];
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.basePrice) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="mb-4 inline-block text-blue-600 hover:underline">
        ← Trang chủ
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Giỏ hàng ({cartItems.length})</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-gray-500">Giỏ hàng trống</p>
          <Link to="/">
            <Button>Tiếp tục mua sắm</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                <Link to={`/products/${item.product.id}`}>
                  <img
                    src={item.product.mainImageUrl || "/placeholder.png"}
                    alt={item.product.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-red-600 font-bold">
                      {formatPrice(item.product.basePrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateItem.mutate({
                          itemId: item.id,
                          quantity: item.quantity - 1,
                        })
                      }
                    >
                      −
                    </Button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateItem.mutate({
                          itemId: item.id,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-red-500 hover:text-red-700"
                      onClick={() => removeItem.mutate(item.id)}
                    >
                      Xoá
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Tổng cộng:</span>
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(total)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
