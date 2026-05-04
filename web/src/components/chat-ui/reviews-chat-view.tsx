import { renderStars } from "@/utils";
import { renderToDOM } from "./shared";

type ReviewsData = {
  data: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { id: string; username: string; fullName: string | null };
  }>;
  nextCursor: string | null;
};

function ReviewsCard({ data }: { data: ReviewsData }) {
  if (!data?.data?.length) {
    return (
      <div className="w-[260px] rounded-lg border border-gray-200 bg-white p-3 text-xs font-sans text-gray-500">
        Chưa có đánh giá nào.
      </div>
    );
  }

  return (
    <div className="w-[260px] overflow-hidden rounded-lg border border-gray-200 bg-white text-xs font-sans">
      <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-800">
        Đánh giá ({data.data.length})
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {data.data.map((r) => (
          <div key={r.id} className="flex flex-col gap-1 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">
                {r.user.fullName || r.user.username}
              </span>
              <span className="text-yellow-500 text-[10px]">{renderStars(r.rating)}</span>
            </div>
            {r.comment && (
              <p className="line-clamp-2 text-gray-500 m-0">{r.comment}</p>
            )}
            <span className="text-[10px] text-gray-400">
              {new Date(r.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        ))}
      </div>

      {data.nextCursor && (
        <div className="border-t border-gray-100 px-3 py-1.5 text-center text-[10px] text-gray-400">
          Còn thêm đánh giá...
        </div>
      )}
    </div>
  );
}

export function renderReviews(data: ReviewsData): HTMLElement {
  return renderToDOM(<ReviewsCard data={data} />);
}
