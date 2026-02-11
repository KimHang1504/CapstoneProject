"use client"

import { Review } from "@/api/venue/review/type"

type Props = {
  reviews: Review[]
  isLoading?: boolean
}

export default function ReviewList({ reviews, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Đang tải đánh giá...</p>
      </div>
    )
  }

  if (!reviews.length) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
        <p className="text-gray-400 text-sm">
          Chưa có đánh giá nào
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={review.member.avatarUrl || "/avatar-placeholder.png"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {review.member.fullName}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="text-sm font-semibold text-yellow-500">
              ⭐ {review.rating}
            </div>
          </div>

          {/* Comment */}
          <p className="mt-4 text-sm text-gray-700 leading-relaxed">
            {review.content}
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>👍 {review.likeCount} lượt thích</span>

            {review.isAnonymous && (
              <span className="px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs">
                Mood phù hợp
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
