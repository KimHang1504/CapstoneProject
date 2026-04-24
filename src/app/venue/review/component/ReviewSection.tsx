"use client"

import { useEffect, useState, useCallback } from "react"
import { getMyReviews } from "@/api/venue/review/api"
import { ReviewSummary, Review } from "@/api/venue/review/type"

import Statistic from "./Statistic"
import ReviewList from "./ReviewList"
import ReviewFilter from "./Filter"

type Props = {
    venueId: number
}

export default function ReviewSection({ venueId }: Props) {

    const [summary, setSummary] = useState<ReviewSummary>()
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [filterParams, setFilterParams] = useState<{
        date?: string
        month?: number
        year?: number
    }>({})

    /**
     * Fetch reviews (source of truth)
     */
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

            <ReviewFilter onChange={setFilterParams} />

            <ReviewList
                reviews={reviews}
                isLoading={isLoading}
                onReplySuccess={handleReplySuccess}
            />

        </div>
    )
}
