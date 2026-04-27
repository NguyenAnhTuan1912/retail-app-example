import { useState, useMemo } from "react";
import { useProducts, useCategories } from "../core/products/query";
import type { ProductFilters } from "../core/products/api";
import { ProductCard } from "../components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Banner from "@/components/banner";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  const filters = useMemo<ProductFilters>(() => {
    const f: ProductFilters = {};
    if (search.trim()) f.search = search.trim();
    if (categoryId && categoryId !== "all") f.categoryId = Number(categoryId);
    if (priceRange && priceRange !== "all") {
      const [from, to] = priceRange.split("-").map(Number);
      if (from) f.priceFrom = from;
      if (to) f.priceTo = to;
    }
    return f;
  }, [search, categoryId, priceRange]);

  const { data, isLoading, hasNextPage, fetchNextPage } = useProducts(filters);
  const { data: categories } = useCategories();
  const products = data?.pages.flatMap((p) => p.data) ?? [];

  // Chỉ hiển thị sub-categories (có parentId)
  const subCategories = categories?.filter((c) => c.parentId) ?? [];

  const categoryLabel =
    categoryId === "all"
      ? "Tất cả danh mục"
      : (subCategories.find((c) => String(c.id) === categoryId)?.name ??
        "Danh mục");

  const priceLabels: Record<string, string> = {
    all: "Tất cả giá",
    "0-1000000": "Dưới 1 triệu",
    "1000000-5000000": "1 - 5 triệu",
    "5000000-15000000": "5 - 15 triệu",
    "15000000-30000000": "15 - 30 triệu",
    "30000000-0": "Trên 30 triệu",
  };

  return (
    <>
      <Banner />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Sản phẩm</h1>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select
            value={categoryId}
            onValueChange={(v: string | null) => setCategoryId(v ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-48">
              {categoryLabel}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {subCategories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priceRange}
            onValueChange={(v: string | null) => setPriceRange(v ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-48">
              {priceLabels[priceRange] ?? "Khoảng giá"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả giá</SelectItem>
              <SelectItem value="0-1000000">Dưới 1 triệu</SelectItem>
              <SelectItem value="1000000-5000000">1 - 5 triệu</SelectItem>
              <SelectItem value="5000000-15000000">5 - 15 triệu</SelectItem>
              <SelectItem value="15000000-30000000">15 - 30 triệu</SelectItem>
              <SelectItem value="30000000-0">Trên 30 triệu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {isLoading && (
          <p className="mt-6 text-center text-gray-500">Đang tải...</p>
        )}
        {!isLoading && products.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            Không tìm thấy sản phẩm nào.
          </p>
        )}
        {hasNextPage && (
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchNextPage()}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </>
  );
}
