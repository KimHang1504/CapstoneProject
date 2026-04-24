type VenueReviewImprovePromptInput = {
  venueId: number;
  venueName?: string;
  venueDescription?: string;
  averageRating: number;
  totalReviews: number;
  reviews: string[];
};

export const buildVenueReviewImprovePrompt = (
  input: VenueReviewImprovePromptInput
): string => {
  const normalizedReviews = input.reviews
    .map((review) => review.trim())
    .filter(Boolean)
    .map((review, index) => `${index + 1}. ${review}`)
    .join("\n");

  return [
    "Bạn là chuyên gia vận hành venue (quán cafe, nhà hàng, quán ăn, địa điểm hẹn hò).",
    "Hãy xác định loại hình quán dựa trên tên quán và mô tả quán, sau đó đưa ra đề xuất đúng ngữ cảnh vận hành.",
    "Phân tích review thực tế và đưa ra đề xuất cải thiện có thể áp dụng ngay.",
    "Chỉ trả về đúng định dạng JSON, không markdown, không text bổ sung.",
    "Định dạng bắt buộc:",
    '{"summary":"...","improvements":["..."],"priorityActions":["..."]}',
    "",
    `VenueId: ${input.venueId}`,
    `VenueName: ${input.venueName || "(không có)"}`,
    `VenueDescription: ${input.venueDescription || "(không có)"}`,
    `AverageRating: ${input.averageRating}`,
    `TotalReviews: ${input.totalReviews}`,
    "Review contents (newest first):",
    normalizedReviews || "(không có nội dung review hợp lệ)",
    "",
    "Yêu cầu nội dung:",
    "- summary: tóm tắt ngắn gọn nguyên nhân chính ảnh hưởng rating",
    "- improvements: 5-8 đề xuất cụ thể, có tính hành động",
    "- priorityActions: 3 hành động ưu tiên cao nhất trong 7 ngày tới",
    "- Toàn bộ nội dung phải viết bằng tiếng Việt tự nhiên, rõ ràng, dễ thực thi",
    "- Đề xuất phải khớp với loại hình quán đã suy luận từ VenueName + VenueDescription",
  ].join("\n");
};
