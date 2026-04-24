"use client"

import { ReviewSummary } from "@/api/venue/review/type"

type Props = {
  summary: ReviewSummary
}

export default function Statistic({ summary }: Props) {
  console.log("SUMMARY", summary)
  console.log("RATINGS", summary?.ratings)
  return (
    <div className="grid md:grid-cols-4 gap-6">

      {/* Tổng đánh giá */}
      <div className="bg-white p-6 border-r border-gray-200">
        <p className="text-sm text-gray-500 mb-2">
          Tổng đánh giá
        </p>
        <p className="text-3xl font-semibold tracking-tight">
          {summary.totalReviews}
        </p>
      </div>

      {/* Điểm trung bình */}
      <div className="bg-white p-6 border-r border-gray-200">
        <p className="text-sm text-gray-500 mb-2">
          Điểm trung bình
        </p>
        <p className="text-3xl font-semibold tracking-tight">
          {summary.averageRating.toFixed(1)}
        </p>
      </div>

      {/* Mood Match */}
      <div className="bg-white p-6 border-r border-gray-200">
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
      {/* Rating Breakdown */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const rating = summary?.ratings?.find(r => r.star === star) ?? {
            star,
            count: 0,
            percent: 0
          }

          return (
            <div key={star} className="flex items-center gap-3">

              {/* Star */}
              <div className="w-10 text-sm text-gray-500">
                {star}
              </div>

              {/* Bar */}
              <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full bg-yellow-400 transition-all duration-500"
                  style={{
                    width: `${rating.percent}%`
                  }}
                />
              </div>

              {/* Count */}
              <div className="w-12 text-sm text-gray-500 text-right">
                {rating.count}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
