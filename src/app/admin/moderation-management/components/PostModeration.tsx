'use client';

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw
} from "lucide-react";
import { ModerationPost } from "@/api/admin/aiModeration/type";
import { getFlaggedPosts, ModeratePost } from "@/api/admin/aiModeration/api";
import { EmptyStateModeration, SkeletonModeration } from "./SkeletonModeration";
import { PostCardModeration } from "./PostCardModeration";
import { toast } from "sonner";

const PAGE_SIZE = 5;

export default function PostModeration() {
  const [posts, setPosts] = useState<ModerationPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getFlaggedPosts(page, PAGE_SIZE);
      const data = res.data;

      setPosts(data.items);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleAction = (id: number, action: 'PUBLISH' | 'CANCEL') => {
    const actionText = action === 'PUBLISH' ? "duyệt" : "chặn";

    toast(`Bạn có chắc muốn ${actionText} bài post này không?`, {
      action: {
        label: action === 'PUBLISH' ? "Cho qua" : "Chặn",
        onClick: async () => {
          try {
            await ModeratePost(id, action);

            // remove khỏi list (UX mượt)
            setPosts(prev => prev.filter(p => p.id !== id));

            toast.success(`Đã ${actionText} bài post`);
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

  return (
    <div className="space-y-5">

      {/* HEADER MINI */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          {totalCount} bài viết cần duyệt
        </p>

        <button
          onClick={fetchData}
          className="flex items-center cursor-pointer gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-slate-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading && "animate-spin"}`} />
          Tải lại
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading ? (
          <SkeletonModeration />
        ) : posts.length === 0 ? (
          <EmptyStateModeration />
        ) : (
          posts.map((post) => (
            <PostCardModeration
              key={post.id}
              post={post}
              onApprove={() => handleAction(post.id, 'PUBLISH')}
              onReject={() => handleAction(post.id, 'CANCEL')}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="bg-white border rounded-xl px-5 py-4 flex justify-between items-center">

          {/* INFO */}
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

          {/* BUTTON */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="p-2 cursor-pointer border rounded-lg disabled:opacity-40"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="p-2 cursor-pointer border rounded-lg disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 text-sm font-medium">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="p-2 cursor-pointer border rounded-lg disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="p-2 cursor-pointer border rounded-lg disabled:opacity-40"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}