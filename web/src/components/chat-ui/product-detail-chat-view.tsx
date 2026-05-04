import { useState } from "react";
import { formatPrice, renderStars } from "@/utils";
import { renderToDOM } from "./shared";

type ProductDetailData = {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  stockQuantity: number;
  ratingAvg: string;
  category: { name: string } | null;
  seller: { fullName: string };
  images: { url: string; isMain: boolean }[];
  reviewCount: number;
};

function ProductDetailCard({ data }: { data: ProductDetailData }) {
  const mainIndex = data.images?.findIndex((i) => i.isMain) ?? 0;
  const [selected, setSelected] = useState(Math.max(mainIndex, 0));

  return (
    <div className="w-[220px] overflow-hidden rounded-lg border border-gray-200 bg-white text-xs font-sans">
      {data.images?.[selected] && (
        <img src={data.images[selected].url} alt={data.name} className="h-[140px] w-full object-cover block" />
      )}

      {data.images.length > 1 && (
        <div className="flex gap-1 px-2 pt-1.5">
          {data.images.slice(0, 4).map((img, i) => (
            <button key={i} onClick={() => setSelected(i)} className={`h-7 w-7 overflow-hidden rounded border-2 p-0 bg-transparent cursor-pointer ${i === selected ? "border-blue-500" : "border-gray-200"}`}>
              <img src={img.url} alt="" className="h-full w-full object-cover block" />
            </button>
          ))}
          {data.images.length > 4 && (
            <span className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-[10px] text-gray-400">
              +{data.images.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5 p-2">
        <div>
          <h3 className="text-xs font-semibold leading-tight line-clamp-2 m-0">{data.name}</h3>
          {data.category && (
            <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-1.5 py-px text-[10px] text-gray-600">
              {data.category.name}
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-red-600 m-0">{formatPrice(data.basePrice)}</p>
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>
            <span className="text-yellow-500">{renderStars(Number(data.ratingAvg))}</span>
            {" "}({data.reviewCount})
          </span>
          <span>Kho: {data.stockQuantity}</span>
        </div>
        <hr className="border-gray-200 m-0" />
        {data.description && (
          <p className="line-clamp-2 text-[10px] text-gray-500 m-0">{data.description}</p>
        )}
        <p className="text-[10px] text-gray-500 m-0">
          Người bán: <span className="font-medium text-gray-800">{data.seller.fullName}</span>
        </p>
      </div>
    </div>
  );
}

export function renderProductDetail(data: ProductDetailData): HTMLElement {
  return renderToDOM(<ProductDetailCard data={data} />);
}
