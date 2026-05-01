'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ChevronLeft, Search, Trash2, Target, Star, Trophy, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { deleteChallenge, getAllChallenges } from '@/api/admin/api';
import { Challenge } from '@/api/admin/type';
import { toast } from 'sonner';

export default function ChallengeListPage() {

  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusMap = {
    INACTIVE: { label: "Không hoạt động", color: "bg-amber-100 text-amber-700" },
    ACTIVE: { label: "Đang hoạt động", color: "bg-emerald-100 text-emerald-700" },
    ENDED: { label: "Đã kết thúc", color: "bg-slate-100 text-slate-700" },
  };

  useEffect(() => {

    setLoading(true);

    getAllChallenges(page, 10)
      .then(res => {

        setData(res.data.items);
        setTotalPages(res.data.totalPages);

      })
      .finally(() => setLoading(false));

  }, [page]);

  const handleDelete = (id: number) => {
    toast("Bạn có chắc muốn xóa thử thách này không?", {
      action: {
        label: "Xóa",
        onClick: async () => {
          try {
            await deleteChallenge(id);

            const res = await getAllChallenges(page, 10);
            setData(res.data.items);
            setTotalPages(res.data.totalPages);

            toast.success("Đã xóa thử thách");
          } catch (error) {
            console.error(error);
            toast.error("Xóa thử thách thất bại");
          }
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => { },
      },
    });
  };

  const challenges = useMemo(() => {

    const key = keyword.toLowerCase();

    return data.filter(c =>
      c.title.toLowerCase().includes(key)
    );

  }, [data, keyword]);

  const formatDate = (date?: string | null) => {

    if (!date) return 'Không giới hạn';

    return new Date(date).toLocaleDateString('vi-VN');

  };

  return (
    <div className="px-8 py-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quản lí thử thách</h2>
      <div className='flex item-center gap-5'>
        <div className="flex items-center gap-3 bg-white border border-[#8093F1] rounded-3xl px-4 py-3 w-[320px]">

          <Search className="text-[#8093F1] w-5 h-5" />

          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm kiếm thử thách"
            className="w-full bg-transparent outline-none text-sm"
          />

        </div>

        <div className='flex item-center'>
          <Link href="/admin/challenge/new"
            className="inline-flex items-center gap-2 text-sm bg-violet-600 text-white px-4 py-2 rounded-full shadow hover:bg-violet-700 transition"
          >
            <Star size={18} />
            Tạo thử thách mới
          </Link>
        </div>

        <div className='flex item-center'>
          <Link href="/admin/challenge/instruction"
            className="inline-flex items-center gap-2 text-sm bg-violet-600 text-white px-4 py-2 rounded-full shadow hover:bg-violet-700 transition"
          >
            <FileQuestion size={18} />
            Hướng dẫn
          </Link>
        </div>
      </div>
      {/* LIST */}
      <div className="space-y-4">

        {loading &&
          [...Array(5)].map((_, i) => (

            <div
              key={i}
              className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-200 animate-pulse"
            >

              <div className="flex-1 space-y-2">

                <div className="h-4 w-1/3 bg-gray-200 rounded" />

                <div className="h-3 w-2/3 bg-gray-200 rounded" />

                <div className="h-3 w-1/2 bg-gray-200 rounded" />

              </div>

            </div>

          ))}

        {!loading &&
          challenges.map(challenge => (

            <div
              key={challenge.id}
              className="relative flex gap-4 bg-white rounded-2xl p-4 border border-violet-100
                            hover:shadow-md hover:border-violet-200 transition"
            >

              {/* CONTENT */}
              <div className="flex-1 pr-10">

                <div className="flex items-center gap-2">
                  <Link href={`/admin/challenge/${challenge.id}`}>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {challenge.title}
                    </h3>
                  </Link>

                  {/* STATUS BADGE */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusMap[challenge.status as keyof typeof statusMap]?.color
                      }`}
                  >
                    {statusMap[challenge.status as keyof typeof statusMap]?.label}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex gap-4 text-sm mt-2">

                  <span className="text-violet-600 font-medium flex gap-2 items-center">
                    <Target size={20} /> Mục tiêu: {challenge.targetGoal}
                  </span>

                  <span className="text-green-600 font-medium flex gap-2 items-center">
                    <Trophy size={20} /> {challenge.rewardPoints} Điểm thưởng
                  </span>

                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {
                    challenge.startDate && challenge.endDate
                      ? `Thời gian: ${formatDate(challenge.startDate)} → ${formatDate(challenge.endDate)}`
                      : challenge.startDate
                        ? `Bắt đầu từ: ${formatDate(challenge.startDate)}`
                        : challenge.endDate
                          ? `Kết thúc vào: ${formatDate(challenge.endDate)}`
                          : "Không giới hạn thời gian"
                  }
                </p>

              </div>

              {/* ARROW */}
              <Link href={`/admin/challenge/${challenge.id}`}>

                <div className="absolute bottom-4 right-4">

                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600">

                    <ChevronRight size={18} />

                  </div>

                </div>

              </Link>

              {/* DELETE */}
              <div className="absolute top-4 right-4">

                <button
                  className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full text-red-500"
                  onClick={() => handleDelete(challenge.id)}
                >

                  <Trash2 size={18} />

                </button>

              </div>

            </div>

          ))}

        {!loading && challenges.length === 0 && (

          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-gray-50 text-center">
            <svg
              className="w-10 h-10 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>

            <p className="text-gray-600 font-medium">
              Không có challenge nào
            </p>

            <p className="text-sm text-gray-400">
              Hãy tạo thử thách mới để bắt đầu.
            </p>
          </div>

        )}

      </div>

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (

        <div className="flex justify-center items-center gap-4 pt-6">

          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 cursor-pointer rounded-lg border disabled:opacity-40"
          >

            <ChevronLeft size={18} />

          </button>

          <span className="text-sm text-gray-600">
            Trang {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 cursor-pointer rounded-lg border disabled:opacity-40"
          >

            <ChevronRight size={18} />

          </button>

        </div>

      )}

    </div>
  );
}