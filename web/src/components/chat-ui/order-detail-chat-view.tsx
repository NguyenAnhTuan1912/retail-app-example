import { formatPrice } from "@/utils";
import { renderToDOM } from "./shared";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "#f59e0b" },
  processing: { label: "Đang xử lý", color: "#3b82f6" },
  shipped: { label: "Đang giao", color: "#8b5cf6" },
  delivered: { label: "Đã giao", color: "#22c55e" },
  cancelled: { label: "Đã huỷ", color: "#ef4444" },
};

type OrderDetailData = {
  id: string;
  totalAmount: string;
  status: string;
  shippingAddress: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    priceAtPurchase: string;
    product: { id: string; name: string; basePrice: string };
  }>;
  cancellation: { reason: string; cancelledAt: string } | null;
};

function OrderDetailCard({ data }: { data: OrderDetailData }) {
  const status = STATUS_LABELS[data.status] ?? { label: data.status, color: "#6b7280" };

  return (
    <div className="w-[260px] overflow-hidden rounded-lg border border-gray-200 bg-white text-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 px-3 py-2">
        <span className="font-semibold text-gray-800">Đơn hàng</span>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: status.color }}>
          {status.label}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {/* Items */}
        <div className="flex flex-col gap-1.5">
          {data.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-2">
              <span className="line-clamp-1 flex-1 text-gray-700">{item.product.name}</span>
              <span className="shrink-0 text-gray-500">
                x{item.quantity} · {formatPrice(item.priceAtPurchase)}
              </span>
            </div>
          ))}
        </div>

        <hr className="border-gray-200 m-0" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Tổng cộng</span>
          <span className="text-sm font-bold text-red-600">{formatPrice(data.totalAmount)}</span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-0.5 text-[10px] text-gray-500">
          <span>📍 {data.shippingAddress}</span>
          <span>📅 {new Date(data.createdAt).toLocaleDateString("vi-VN")}</span>
          <span className="text-gray-400">ID: {data.id.slice(0, 8)}...</span>
        </div>

        {/* Cancellation */}
        {data.cancellation && (
          <div className="rounded bg-red-50 px-2 py-1.5 text-[10px] text-red-600">
            <span className="font-medium">Lý do huỷ:</span> {data.cancellation.reason}
            <br />
            <span className="text-red-400">
              {new Date(data.cancellation.cancelledAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function renderOrderDetail(data: OrderDetailData): HTMLElement {
  return renderToDOM(<OrderDetailCard data={data} />);
}
