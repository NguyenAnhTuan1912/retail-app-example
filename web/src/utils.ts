export function formatPrice(value: string | number) {
  return Number(value).toLocaleString('vi-VN') + '₫';
}

export function renderStars(rating: number) {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}
