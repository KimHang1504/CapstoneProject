'use client';

import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RefreshCw
} from "lucide-react";
import { ModerationReview } from "@/api/admin/aiModeration/type";
import { getFlaggedReviews, ModerateReview } from "@/api/admin/aiModeration/api";
import { EmptyStateModeration, SkeletonModeration } from "./SkeletonModeration";
import { ReviewCardModeration } from "./ReviewCardModeraion";

const PAGE_SIZE = 5;

export default function ReviewModeration() {
    const [reviews, setReviews] = useState<ModerationReview[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getFlaggedReviews(page, PAGE_SIZE);
            const data = res.data;

            setReviews(data?.items ?? []);
            setTotalPages(data?.totalPages ?? 1);
            setTotalCount(data?.totalCount ?? 0);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleAction = async (id: number, action: 'PUBLISH' | 'CANCEL') => {
        try {
            await ModerateReview(id, action);

            // remove khỏi list cho mượt
            setReviews(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-5">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">
                    {totalCount} đánh giá cần duyệt
                </p>

                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-slate-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading && "animate-spin"}`} />
                    Tải lại
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-4">
                {loading ? (
                    <SkeletonModeration />
                ) : reviews.length === 0 ? (
                    <EmptyStateModeration />
                ) : (
                    reviews.map((review) => (
                        <ReviewCardModeration
                            key={review.id}
                            review={review}
                            onApprove={() => handleAction(review.id, 'PUBLISH')}
                            onReject={() => handleAction(review.id, 'CANCEL')}
                        />
                    ))
                )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="bg-white border rounded-xl px-5 py-4 flex justify-between items-center">

                    <div className="text-sm text-slate-600">
                        Hiển thị{" "}
                        <span className="font-semibold">
                            {(page - 1) * PAGE_SIZE + 1}
                        </span>{" "}
                        -{" "}
                        <span className="font-semibold">
                            {Math.min(page * PAGE_SIZE, totalCount)}
                        </span>{" "}
                        / {totalCount}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                            className="p-2 border rounded-lg disabled:opacity-40"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="p-2 border rounded-lg disabled:opacity-40"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="px-3 text-sm font-medium">
                            {page} / {totalPages}
                        </span>

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="p-2 border rounded-lg disabled:opacity-40"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setPage(totalPages)}
                            disabled={page === totalPages}
                            className="p-2 border rounded-lg disabled:opacity-40"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}