"use client"

import { useState } from "react"
import { Review, ReviewReply } from "@/api/venue/review/type"
import { replyReview, updateReply } from "@/api/venue/review/api"
import Image from "next/image"

type Props = {
    reviews: Review[]
    isLoading?: boolean
    onReplySuccess?: (reviewId: number, reply: ReviewReply) => void
}

export default function ReviewList({
    reviews,
    isLoading,
    onReplySuccess,
}: Props) {
    const [replyingId, setReplyingId] = useState<number | null>(null)
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)


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
                <p className="text-gray-400 text-sm">Chưa có đánh giá nào</p>
            </div>
        )
    }

    const handleSubmit = async (reviewId: number, isEdit = false) => {
        if (!content.trim()) return

        try {
            setLoading(true)

            const res = isEdit
                ? await updateReply(reviewId, { content })
                : await replyReview(reviewId, { content })
            console.log("REPLY RESPONSE:", res)
            console.log("REPLY DATA:", res.data)
            onReplySuccess?.(reviewId, res.data)

            setReplyingId(null)
            setEditingId(null)
            setContent("")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition space-y-4"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src={review.member.avatarUrl || "/avatar-placeholder.png"}
                                alt="avatar"
                                width={40}
                                height={40}
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

                        <div className="text-sm font-semibold text-yellow-500">
                            ⭐ {review.rating}
                        </div>
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {review.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>👍 {review.likeCount} lượt thích</span>

                        {review.isAnonymous && (
                            <span className="px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs">
                                Mood phù hợp
                            </span>
                        )}
                    </div>

                    {/* ===== OWNER REPLY DISPLAY ===== */}
                    {review.reviewReply && editingId !== review.id && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                            <p className="text-xs font-semibold text-gray-500">
                                Chủ địa điểm
                            </p>
                            <p className="text-sm text-gray-800">
                                {review.reviewReply.content}
                            </p>

                            <button
                                onClick={() => {
                                    setEditingId(review.id)
                                    setContent(review.reviewReply!.content)
                                }}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Chỉnh sửa
                            </button>
                        </div>
                    )}
                    {review.reviewReply && editingId === review.id && (
                        <div className="space-y-2">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={3}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSubmit(review.id, true)}
                                    disabled={loading}
                                    className="px-4 py-1.5 bg-black text-white text-sm rounded-xl"
                                >
                                    {loading ? "Đang lưu..." : "Lưu"}
                                </button>

                                <button
                                    onClick={() => {
                                        setEditingId(null)
                                        setContent("")
                                    }}
                                    className="px-4 py-1.5 bg-gray-100 text-sm rounded-xl"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}


                    {/* ===== OWNER REPLY FORM ===== */}
                    {!review.reviewReply && (
                        <>
                            {replyingId !== review.id ? (
                                <button
                                    onClick={() => setReplyingId(review.id)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Trả lời
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                                        placeholder="Nhập phản hồi của bạn..."
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSubmit(review.id)}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-black text-white text-sm rounded-xl"
                                        >
                                            {loading ? "Đang gửi..." : "Gửi"}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setReplyingId(null)
                                                setContent("")
                                            }}
                                            className="px-4 py-1.5 bg-gray-100 text-sm rounded-xl"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}
