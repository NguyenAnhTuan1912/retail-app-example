import { formatPrice } from "@/utils";
import { renderToDOM } from "./shared";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    basePrice: string;
    stockQuantity: number;
    mainImageUrl: string | null;
  };
};

function CartCard({ data }: { data: CartItem[] }) {
  if (!data?.length) {
    return (
      <div className="w-[260px] rounded-lg border border-gray-200 bg-white p-3 text-xs font-sans text-gray-500">
        🛒 Giỏ hàng trống.
      </div>
    );
  }

  const total = data.reduce(
    (sum, item) => sum + Number(item.product.basePrice) * item.quantity, 0,
  );

  return (
    <div className="w-[260px] overflow-hidden rounded-lg border border-gray-200 bg-white text-xs font-sans">
      <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-800">
        🛒 Giỏ hàng ({data.length})
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-2 px-3 py-2">
            {item.product.mainImageUrl && (
              <img
                src={item.product.mainImageUrl}
                alt={item.product.name}
                className="h-10 w-10 shrink-0 rounded border border-gray-200 object-cover block"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 font-medium text-gray-700 m-0">{item.product.name}</p>
              <p className="text-[10px] text-gray-500 m-0">
                {formatPrice(item.product.basePrice)} × {item.quantity}
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-gray-800">
              {formatPrice(Number(item.product.basePrice) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2">
        <span className="font-medium text-gray-700">Tổng cộng</span>
        <span className="text-sm font-bold text-red-600">{formatPrice(total)}</span>
      </div>
    </div>
  );
}

export function renderCart(data: CartItem[]): HTMLElement {
  return renderToDOM(<CartCard data={data} />);
}
