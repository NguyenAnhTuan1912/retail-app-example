import { useEffect, useState } from 'react';
import { api, type ProductSummary } from '../api';
import { ProductCard } from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (nextCursor?: string) => {
    setLoading(true);
    const res = await api.getProducts(nextCursor);
    setProducts((prev) => (nextCursor ? [...prev, ...res.data] : res.data));
    setCursor(res.nextCursor);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Sản phẩm</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {loading && <p className="mt-6 text-center text-gray-500">Đang tải...</p>}
      {!loading && cursor && (
        <div className="mt-6 text-center">
          <button
            onClick={() => load(cursor)}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}
