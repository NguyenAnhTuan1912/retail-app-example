import { useParams, Link } from "react-router-dom";
import { useOrder } from "../core/orders/query";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "../core/orders/model";
import { formatPrice } from "../utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PROGRESS_STEPS = ORDER_STATUSES.filter((s) => s !== "cancelled");

function OrderProgress({ status }: { status: string }) {
  if (status === "cancelled") {
    return <Badge variant="destructive">Đã huỷ</Badge>;
  }
  const currentIdx = PROGRESS_STEPS.indexOf(status as any);

  return (
    <div className="flex items-center gap-1">
      {PROGRESS_STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= currentIdx
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span className="mt-1 text-xs text-gray-600">
              {ORDER_STATUS_LABELS[step]}
            </span>
          </div>
          {i < PROGRESS_STEPS.length - 1 && (
            <div
              className={`mb-5 h-0.5 w-8 sm:w-16 ${i < currentIdx ? "bg-blue-600" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id!);

  if (isLoading || !order)
    return <p className="p-8 text-center text-gray-500">Đang tải...</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="mb-4 inline-block text-blue-600 hover:underline">
        ← Trang chủ
      </Link>

      <h1 className="mb-2 text-2xl font-bold">Chi tiết đơn hàng</h1>
      <p className="mb-6 text-sm text-gray-500">#{order.id.slice(0, 8)}</p>

      {/* Progress bar */}
      <div className="mb-8 flex justify-center">
        <OrderProgress status={order.status} />
      </div>

      <Separator className="mb-6" />

      {/* Order info */}
      <div className="mb-6 space-y-2 text-sm">
        <p>
          <span className="text-gray-500">Ngày đặt:</span>{" "}
          {new Date(order.createdAt).toLocaleString("vi-VN")}
        </p>
        <p>
          <span className="text-gray-500">Địa chỉ:</span>{" "}
          {order.shippingAddress}
        </p>
        <p>
          <span className="text-gray-500">Tổng tiền:</span>{" "}
          <span className="font-bold text-red-600">
            {formatPrice(order.totalAmount)}
          </span>
        </p>
      </div>

      {order.cancellation && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
          <p className="font-medium text-red-700">
            Lý do huỷ: {order.cancellation.reason}
          </p>
          <p className="text-xs text-red-500">
            Huỷ lúc:{" "}
            {new Date(order.cancellation.cancelledAt).toLocaleString("vi-VN")}
          </p>
        </div>
      )}

      <Separator className="mb-6" />

      {/* Items */}
      <h2 className="mb-4 text-lg font-bold">
        Sản phẩm ({order.items.length})
      </h2>
      <div className="space-y-3">
        {order.items.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.product.id}`}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                SL: {item.quantity} × {formatPrice(item.priceAtPurchase)}
              </p>
            </div>
            <p className="font-bold text-red-600">
              {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
