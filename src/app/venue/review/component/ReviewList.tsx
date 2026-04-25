"use client"

import { useEffect, useState } from "react"
import { ReportType, Review, ReviewReply } from "@/api/venue/review/type"
import {
    createReviewReportByOwner,
    getReportTypes,
    replyReview,
    updateReply,
} from "@/api/venue/review/api"
import Image from "next/image"
import { Star, ThumbsUp } from "lucide-react"
import { toast } from "sonner"

type Props = {
    reviews: Review[]
    isLoading?: boolean
    onReplySuccess?: (reviewId: number, reply: ReviewReply) => void
    canInteractReview: boolean
}

type ActionType = "reply" | "edit" | "report" | null

export default function ReviewList({
    reviews,
    isLoading,
    onReplySuccess,
    canInteractReview,
}: Props) {
    const [activeAction, setActiveAction] = useState<{
        id: number | null
        type: ActionType
    }>({ id: null, type: null })

    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)

    const [reportTypes, setReportTypes] = useState<ReportType[]>([])
    const [selectedType, setSelectedType] = useState<number | null>(null)
    const [reportReason, setReportReason] = useState("")
    const [reportLoading, setReportLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    // ===== Fetch report types =====
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await getReportTypes()
                const active = res.data.items.filter((t) => t.isActive)
                setReportTypes(active)
            } catch (err) {
                console.error("Failed to load report types", err)
            }
        }

        fetchTypes()
    }, [])

    // ===== Report =====
    const handleReport = async (reviewId: number) => {
        if (!selectedType) {
            setError("type")
            return
        }

        if (!reportReason.trim()) {
            setError("reason")
            return
        }

        try {
            setError(null)
            setReportLoading(true)

            await createReviewReportByOwner(reviewId, {
                reportTypeId: selectedType,
                reason: reportReason,
            })

            toast.success("Báo cáo đã được gửi")

            setActiveAction({ id: null, type: null })
            setSelectedType(null)
            setReportReason("")
        } catch (err) {
            toast.error("Gửi báo cáo thất bại",git  { description: (err as Error).message })
        } finally {
            setReportLoading(false)
        }
    }

    // ===== Reply / Edit =====
    const handleSubmit = async (reviewId: number, isEdit = false) => {
        if (!content.trim()) return

        try {
            setLoading(true)

            const res = isEdit
                ? await updateReply(reviewId, { content })
                : await replyReview(reviewId, { content })

            onReplySuccess?.(reviewId, res.data)

            // reset
            setActiveAction({ id: null, type: null })
            setContent("")
        } finally {
            setLoading(false)
        }
    }

    // ===== Loading =====
    if (isLoading) {
        return (
            <div className="py-10 text-center text-sm text-gray-500">
                Đang tải đánh giá...
            </div>
        )
    }

    if (!reviews.length) {
        return (
            <div className="py-16 text-center text-sm text-gray-400">
                Chưa có đánh giá nào
            </div>
        )
    }

    return (
        <div className="divide-y divide-gray-100">
            {reviews.map((review) => (
                <div key={review.id} className="py-6 space-y-3">

                    {/* ===== HEADER ===== */}
                    <div className="flex items-start gap-3">
                        <Image
                            src={
                                review.member.avatarUrl
                                    ? decodeURIComponent(review.member.avatarUrl)
                                    : "/logo.png"
                            }
                            alt="avatar"
                            width={40}
                            height={40}
                            unoptimized
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="flex-1">

                            {/* Name + date + rating */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {review.member.fullName}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>

                            {review.coupleMoodSnapshot && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center gap-1
                                            px-3 py-1 text-xs font-medium
                                            rounded-full
                                            bg-gradient-to-r from-purple-50 to-pink-50
                                            text-purple-700
                                            border border-purple-200
                                            shadow-sm
                                        ">
                                        Mood: {review.coupleMoodSnapshot}
                                    </span>
                                </div>
                            )}


                            {/* CONTENT */}
                            <p className="text-sm text-gray-800 mt-2">
                                {review.content}
                            </p>

                            {/* FOOTER */}
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">

                                <span className="flex items-center gap-1">
                                    <ThumbsUp size={13} />
                                    {review.likeCount}
                                </span>

                                {review.isMatched && (
                                    <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                        Mood phù hợp
                                    </span>
                                )}
                                {!review.isMatched && (
                                    <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                        Mood không phù hợp
                                    </span>
                                )}

                                <button
                                    onClick={() =>
                                        setActiveAction({ id: review.id, type: "report" })
                                    }
                                    className="hover:text-red-500 cursor-pointer"
                                >
                                    Báo cáo
                                </button>

                                {!review.reviewReply && canInteractReview && (
                                    <button
                                        onClick={() =>
                                            setActiveAction({ id: review.id, type: "reply" })
                                        }
                                        className="text-violet-500 hover:text-violet-600 hover:underline cursor-pointer"                                    >
                                        Trả lời
                                    </button>
                                )}
                            </div>

                            {/* ===== REPLY DISPLAY ===== */}
                            {review.reviewReply &&
                                !(activeAction.id === review.id && activeAction.type === "edit") && (
                                    <div className="ml-12 mt-3 pl-4 border-l border-gray-200">
                                        <p className="text-xs text-gray-500 font-medium">
                                            Chủ địa điểm
                                        </p>
                                        <p className="text-sm text-gray-800">
                                            {review.reviewReply.content}
                                        </p>

                                        <button
                                            onClick={() => {
                                                setActiveAction({ id: review.id, type: "edit" })
                                                setContent(review.reviewReply!.content)
                                            }}
                                            className="text-xs text-blue-500 hover:underline cursor-pointer"
                                        >
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                )}

                            {/* ===== EDIT ===== */}
                            {review.reviewReply &&
                                activeAction.id === review.id &&
                                activeAction.type === "edit" && (
                                    <div className="mt-3 space-y-2">
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                        />

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSubmit(review.id, true)}
                                                disabled={loading}
                                                className="px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition cursor-pointer"                                            >
                                                {loading ? "Đang lưu..." : "Lưu"}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setActiveAction({ id: null, type: null })
                                                    setContent("")
                                                }}
                                                className="px-3 py-1.5 bg-gray-100 rounded-lg cursor-pointer"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}

                            {/* ===== CREATE REPLY ===== */}
                            {!review.reviewReply &&
                                activeAction.id === review.id &&
                                activeAction.type === "reply" && (
                                    <div className="mt-3 space-y-2">
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={3}
                                            placeholder="Nhập phản hồi..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                        />

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSubmit(review.id)}
                                                disabled={loading}
                                                className="px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition cursor-pointer"                                            >
                                                {loading ? "Đang gửi..." : "Gửi"}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setActiveAction({ id: null, type: null })
                                                    setContent("")
                                                }}
                                                className="px-3 py-1.5 bg-gray-100 rounded-lg cursor-pointer"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}

                            {/* ===== REPORT ===== */}
                            {activeAction.id === review.id &&
                                activeAction.type === "report" && (
                                    <div className="mt-3 border border-gray-200 rounded-xl p-4 space-y-3 bg-white">

                                        {/* Title */}
                                        <p className="text-sm font-medium text-gray-800">
                                            Báo cáo đánh giá
                                        </p>

                                        {/* Select */}
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Lý do</p>
                                            <select
                                                value={selectedType ?? ""}
                                                onChange={(e) => {
                                                    setSelectedType(Number(e.target.value))
                                                    setError(null)
                                                }}
                                                className={`w-full border rounded-lg px-3 py-2 text-sm ${!selectedType && error === "type"
                                                    ? "border-red-400 focus:ring-red-100"
                                                    : "border-gray-200 focus:ring-2 focus:ring-violet-100 focus:border-violet-400"
                                                    }`}
                                            >
                                                <option value="">Chọn lý do</option>
                                                {reportTypes.map((t) => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.description}
                                                    </option>
                                                ))}
                                            </select>
                                            {!selectedType && error === "type" && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    Vui lòng chọn lý do
                                                </p>
                                            )}
                                        </div>

                                        {/* Textarea */}
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Mô tả thêm</p>
                                            <textarea
                                                value={reportReason}
                                                onChange={(e) => {
                                                    setReportReason(e.target.value)
                                                    setError(null)
                                                }} rows={3}
                                                placeholder="Nhập mô tả chi tiết..."
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
focus:ring-2 focus:ring-violet-100 focus:border-violet-400"                                            />
                                            {selectedType && !reportReason.trim() && error === "reason" && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    Vui lòng nhập mô tả
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-2">
                                            <button
                                                onClick={() => {
                                                    setActiveAction({ id: null, type: null })
                                                    setSelectedType(null)
                                                    setReportReason("")
                                                }}
                                                className="text-xs text-gray-500 hover:underline cursor-pointer"
                                            >
                                                Hủy
                                            </button>

                                            <button
                                                onClick={() => handleReport(review.id)}
                                                disabled={reportLoading}
                                                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition cursor-pointer"
                                            >
                                                {reportLoading ? "Đang gửi..." : "Gửi báo cáo"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}