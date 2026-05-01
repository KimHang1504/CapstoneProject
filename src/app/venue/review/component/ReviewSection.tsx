"use client"

import { useEffect, useState, useCallback } from "react"
import { getMyReviews } from "@/api/venue/review/api"
import { ReviewSummary, Review } from "@/api/venue/review/type"
import { Sparkles, MessageSquareText } from "lucide-react"

import Statistic from "./Statistic"
import ReviewList from "./ReviewList"
import ReviewFilter from "./Filter"
import ReviewImprovePanel from "./ReviewImprovePanel"

type Props = {
    venueId: number
    venueName?: string
    venueDescription?: string
    canInteractReview: boolean
}

export default function ReviewSection({ venueId, venueName, venueDescription, canInteractReview }: Props) {
    const [activeTab, setActiveTab] = useState<"reviews" | "improve">("reviews")

    const [summary, setSummary] = useState<ReviewSummary>()
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [filterParams, setFilterParams] = useState<{
        date?: string
        month?: number
        year?: number
    }>({})


    const fetchReviews = useCallback(async () => {
        try {
            setIsLoading(true)

            const res = await getMyReviews({
                venueId,
                ...filterParams,
            })

            setSummary(res.data.summary)
            setReviews(res.data.reviews.items)
        } finally {
            setIsLoading(false)
        }
    }, [venueId, filterParams])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])


    const handleReplySuccess = async () => {
        await fetchReviews()
    }

    console.log("Review list: ", reviews)
    if (!summary) return null


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Đánh giá của bạn</h2>

            <Statistic summary={summary} />

            <div className="inline-flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${activeTab === "reviews"
                            ? "bg-white shadow-sm text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <MessageSquareText size={16} />
                    Đánh giá
                </button>
                <button
                    onClick={() => setActiveTab("improve")}
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${activeTab === "improve"
                            ? "bg-white shadow-sm text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Sparkles size={16} />
                    Cải thiện
                </button>
            </div>

            {activeTab === "reviews" && (
                <>
                    <ReviewFilter onChange={setFilterParams} />

                    <ReviewList
                        reviews={reviews}
                        isLoading={isLoading}
                        onReplySuccess={handleReplySuccess}
                        canInteractReview={canInteractReview}
                    />
                </>
            )}

            {activeTab === "improve" && (
                <ReviewImprovePanel
                    venueId={venueId}
                    venueName={venueName}
                    venueDescription={venueDescription}
                    reviews={reviews}
                    summary={summary}
                />
            )}

        </div>
    )
}
