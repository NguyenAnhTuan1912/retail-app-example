export type TReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { fullName: string };
}

export type TReviewListResponse = {
  data: TReview[];
  nextCursor: string | null;
}
