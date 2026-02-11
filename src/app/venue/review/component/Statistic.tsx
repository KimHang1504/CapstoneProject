"use client"

import { ReviewSummary } from "@/api/venue/review/type"

type Props = {
  summary: Pick<
    ReviewSummary,
    "averageRating" | "totalReviews" | "moodMatchPercentage" | "matchedReviewsCount"
  >
}

export default function Statistic({ summary }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Tổng đánh giá */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-2">
          Tổng đánh giá
        </p>
        <p className="text-3xl font-semibold tracking-tight">
          {summary.totalReviews}
        </p>
      </div>

      {/* Điểm trung bình */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-2">
          Điểm trung bình
        </p>
        <p className="text-3xl font-semibold tracking-tight">
          {summary.averageRating.toFixed(1)}
        </p>
      </div>

      {/* Mood Match */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">
              Phù hợp với mood
            </p>
            <p className="text-3xl font-semibold tracking-tight">
              {summary.moodMatchPercentage}%
            </p>
          </div>

          <div className="text-sm text-gray-400">
            {summary.matchedReviewsCount} đánh giá phù hợp
          </div>
        </div>

        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full bg-pink-400 transition-all duration-500"
            style={{
              width: `${summary.moodMatchPercentage}%`,
            }}
          />
        </div>
      </div>

    </div>
  )
}
