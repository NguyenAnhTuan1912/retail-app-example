import { Outlet, Link, useNavigate } from "react-router-dom";
import { useMe } from "../core/users/query";
import { useOrders } from "../core/orders/query";
import { useCart } from "../core/cart/query";
import { ORDER_STATUS_LABELS } from "../core/orders/model";
import { formatPrice } from "../utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AnnouncementBar from "@/components/announcement-bar";

function OrderStatusBadge({ status }: { status: string }) {
  const variant =
    status === "delivered"
      ? "default"
      : status === "cancelled"
        ? "destructive"
        : "secondary";
  return (
    <Badge variant={variant}>{ORDER_STATUS_LABELS[status] ?? status}</Badge>
  );
}

export default function GlobalHeaderLayout() {
  const { data: user } = useMe();
  const { data: orderData, hasNextPage, fetchNextPage } = useOrders(user?.id);
  const { data: cartItems } = useCart();
  const navigate = useNavigate();
  const orders = orderData?.pages.flatMap((p) => p.data) ?? [];
  const cartCount = cartItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold">
            Demo E-Commerce
          </Link>

          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-3 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* Orders dropdown */}
            <Popover>
              <PopoverTrigger>
                <button className="relative">
                  <span className="text-xl">📦</span>
                  {orders.length > 0 && (
                    <Badge className="absolute -top-2 -right-3 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
                      {orders.length}
                    </Badge>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <div className="px-3 pt-3 font-medium">Đơn hàng của bạn</div>
                <Separator />
                {orders.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500">
                    Chưa có đơn hàng
                  </p>
                ) : (
                  <div className="flex flex-col gap-3 overflow-y-auto">
                    {orders.map((o) => (
                      <Button
                        variant="ghost"
                        key={o.id}
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="flex w-full items-center justify-between px-3 py-3 text-left text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {formatPrice(o.totalAmount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <OrderStatusBadge status={o.status} />
                      </Button>
                    ))}
                    {hasNextPage && (
                      <>
                        <Separator />
                        <Button
                          variant="link"
                          onClick={() => fetchNextPage()}
                          className="w-full py-2 text-center text-sm text-blue-600"
                        >
                          Xem thêm
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* User info */}
            {user && (
              <span className="text-sm text-gray-600">
                {user.fullName ?? user.username}
              </span>
            )}
          </div>
        </div>
      </header>

      <AnnouncementBar />

      <Outlet />
    </>
  );
}
