'use client';

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw
} from "lucide-react";

import { ModerationComment } from "@/api/admin/aiModeration/type";
import { CommentCardModeration } from "./CommentCardModeration";
import { EmptyStateModeration, SkeletonModeration } from "./SkeletonModeration";
import { getFlaggedComments, ModerateComment } from "@/api/admin/aiModeration/api";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function CommentModeration() {
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getFlaggedComments(page, PAGE_SIZE);
      const data = res.data;

      setComments(data?.items ?? []);
      setTotalPages(data?.totalPages ?? 1);
      setTotalCount(data?.totalCount ?? 0);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleAction = (id: number, action: 'PUBLISH' | 'CANCEL') => {
    const actionText = action === 'PUBLISH' ? "duyệt" : "chặn";

    toast(`Bạn có chắc muốn ${actionText} comment này không?`, {
      action: {
        label: action === 'PUBLISH' ? "Cho qua" : "Chặn",
        onClick: async () => {
          try {
            await ModerateComment(id, action);

            setComments(prev => prev.filter(c => c.id !== id));

            toast.success(`Đã ${actionText} comment`);
          } catch (err) {
            console.error(err);
            const errorMessage =
              err instanceof Error ? err.message : `${actionText} thất bại`;
            toast.error(errorMessage);
          }
        },
      },
      cancel: {
        label: "Đóng",
        onClick: () => { },
      },
    });
  };

  const isEmpty = !comments || comments.length === 0;

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          {totalCount} bình luận cần duyệt
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
      <div className="space-y-3">
        {loading && <SkeletonModeration />}

        {!loading && isEmpty && <EmptyStateModeration />}

        {!loading && !isEmpty &&
          comments.map((comment) => (
            <CommentCardModeration
              key={comment.id}
              comment={comment}
              onApprove={() => handleAction(comment.id, 'PUBLISH')}
              onReject={() => handleAction(comment.id, 'CANCEL')}
            />
          ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="bg-white border rounded-xl px-5 py-4 flex justify-between items-center">

          <div className="text-sm text-slate-600">
            {(page - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(page * PAGE_SIZE, totalCount)} / {totalCount}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setPage(1)} disabled={page === 1} className="p-2 border rounded">
              <ChevronsLeft className="w-4 h-4" />
            </button>

            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-2 border rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span>{page}/{totalPages}</span>

            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="p-2 border rounded">
              <ChevronRight className="w-4 h-4" />
            </button>

            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-2 border rounded">
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}