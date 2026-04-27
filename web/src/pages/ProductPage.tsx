import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../core/products/query";
import { useReviews } from "../core/reviews/query";
import { useAddToCart } from "../core/cart/query";
import { formatPrice, renderStars } from "../utils";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { data: reviewData, hasNextPage, fetchNextPage } = useReviews(id!);
  const addToCart = useAddToCart();
  const [selectedImage, setSelectedImage] = useState(0);

  const reviews = reviewData?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading || !product)
    return <p className="p-8 text-center text-gray-500">Đang tải...</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/" className="mb-4 inline-block text-blue-600 hover:underline">
        ← Quay lại
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <div>
          <div>
            <img
              src={product.images[selectedImage]?.url}
              alt={product.name}
              className="w-full aspect-square rounded-lg object-center object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded border-2 ${i === selectedImage ? "border-blue-600" : "border-gray-200"}`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {formatPrice(product.basePrice)}
          </p>
          <div className="mt-2 text-yellow-500">
            {renderStars(Number(product.ratingAvg))}{" "}
            <span className="text-sm text-gray-500">({product.ratingAvg})</span>
          </div>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <div className="mt-4 space-y-1 text-sm text-gray-500">
            <p>Người bán: {product.seller.fullName}</p>
            {product.category && <p>Danh mục: {product.category.name}</p>}
            <p>Kho: {product.stockQuantity}</p>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={() => addToCart.mutate({ productId: product.id })}
            disabled={addToCart.isPending}
          >
            {addToCart.isPending ? 'Đang thêm...' : '🛒 Thêm vào giỏ hàng'}
          </Button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold">Đánh giá ({product.reviewCount})</h2>
        {reviews.length === 0 && (
          <p className="text-gray-500">Chưa có đánh giá nào.</p>
        )}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.user.fullName}</span>
                <span className="text-yellow-500">{renderStars(r.rating)}</span>
              </div>
              {r.comment && <p className="mt-2 text-gray-600">{r.comment}</p>}
              <p className="mt-1 text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
          >
            Xem thêm đánh giá
          </button>
        )}
      </div>
    </div>
  );
}
