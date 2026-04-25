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
    "Bạn là chuyên gia vận hành venue. Phân tích review và đưa ra đề xuất cải thiện.",
    "",
    "CRITICAL: Trả về ĐÚNG format JSON sau, KHÔNG thêm text nào khác:",
    "",
    "{",
    '  "summary": "Văn bản tóm tắt ở đây",',
    '  "improvements": [',
    '    "Đề xuất 1",',
    '    "Đề xuất 2",',
    '    "Đề xuất 3"',
    "  ],",
    '  "priorityActions": [',
    '    "Hành động 1",',
    '    "Hành động 2",',
    '    "Hành động 3"',
    "  ]",
    "}",
    "",
    "QUY TẮC JSON:",
    "- KHÔNG có dấu phẩy sau phần tử cuối trong mảng",
    "- KHÔNG có dấu phẩy sau thuộc tính cuối trong object",
    "- Dùng dấu nháy đơn ' thay vì nháy kép \" trong nội dung text",
    "- Mỗi item trong mảng là 1 câu ngắn gọn",
    "",
    `VenueId: ${input.venueId}`,
    `VenueName: ${input.venueName || "N/A"}`,
    `VenueDescription: ${input.venueDescription || "N/A"}`,
    `AverageRating: ${input.averageRating}`,
    `TotalReviews: ${input.totalReviews}`,
    "",
    "Reviews:",
    normalizedReviews || "(không có review)",
    "",
    "Yêu cầu:",
    "- summary: 1-2 câu tóm tắt vấn đề chính",
    "- improvements: 5-7 đề xuất cụ thể, khả thi",
    "- priorityActions: 3 hành động ưu tiên trong 7 ngày",
    "- Viết bằng tiếng Việt, ngắn gọn, dễ hiểu",
  ].join("\n");
};
