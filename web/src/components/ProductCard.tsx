import { Link } from 'react-router-dom';
import type { ProductSummary } from '../api';
import { formatPrice, renderStars } from '../utils';

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <img
        src={product.mainImageUrl || '/placeholder.png'}
        alt={product.name}
        className="h-48 w-full rounded-t-lg object-cover"
      />
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-gray-800">
          {product.name}
        </h3>
        <p className="mt-1 text-lg font-bold text-red-600">
          {formatPrice(product.basePrice)}
        </p>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span className="text-yellow-500">
            {renderStars(Number(product.ratingAvg))}
          </span>
          <span>Kho: {product.stockQuantity}</span>
        </div>
      </div>
    </Link>
  );
}
