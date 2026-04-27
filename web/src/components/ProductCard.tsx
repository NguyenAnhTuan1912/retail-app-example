import { Link } from "react-router-dom";

// Import components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import utils
import { formatPrice, renderStars } from "../utils";

// Import types
import type { TProductSummary } from "../core/products/model";

export function ProductCard({ product }: { product: TProductSummary }) {
  return (
    <Link to={`/products/${product.id}`}>
      <Card>
        <CardHeader>
          <img
            src={product.mainImageUrl || "/placeholder.png"}
            alt={product.name}
            className="h-48 w-full rounded-t-lg object-cover"
          />
        <CardTitle>{product.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mt-1 text-lg font-bold text-red-600">
            {formatPrice(product.basePrice)}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-gray-500">
          <span className="text-yellow-500">
            {renderStars(Number(product.ratingAvg))}
          </span>
          <span>Kho: {product.stockQuantity}</span>
        </CardFooter>
        {/* <div className="p-3">
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
        </div> */}
      </Card>
    </Link>
  );
}
