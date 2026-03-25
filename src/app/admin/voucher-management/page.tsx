"use client";

import { getVouchers } from "@/api/admin/api";
import { Voucher } from "@/api/admin/type";
import { Plus, Hash, AlignLeft, Coins, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);

    const res = await getVouchers({
      PageNumber: page,
      PageSize: pageSize,
      SortBy: "createdAt",
      SortDirection: "desc",
    });

    const data = res.data;

    setVouchers(data.items);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="px-8 py-4 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex gap-5 items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
          Quản lí voucher
        </h2>

        <Link
          href="/admin/voucher-management/voucher/all"
          className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-full shadow hover:opacity-90 transition"
        >
          <Plus size={18} />
          Xem tất cả voucher
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            <VoucherSkeleton />
            <VoucherSkeleton />
            <VoucherSkeleton />
          </>
        ) : vouchers.length === 0 ? (
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
              Không có yêu cầu voucher nào
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {vouchers.map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}

            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}

function VoucherCard({ voucher }: { voucher: any }) {
  return (
    <div className="group rounded-2xl p-5 bg-white border border-violet-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <Link
          href={`/admin/voucher-management/voucher/${voucher.id}`}
          className="flex-1"
        >
          <h2 className="font-semibold text-lg text-gray-800 group-hover:text-violet-600 transition">
            {voucher.title}
          </h2>
        </Link>

        <span
          className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusColor(
            voucher.status
          )}`}
        >
          {voucher.status}
        </span>
      </div>

      {/* Code */}
      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
        <Hash className="w-4 h-4 text-pink-400" />
        <span>
          Code:{" "}
          <span className="font-medium text-gray-700">
            {voucher.code}
          </span>
        </span>
      </div>

      {/* Description */}
      <div className="flex items-start gap-2 mt-2 text-sm text-gray-500">
        <AlignLeft className="w-4 h-4 text-violet-400 mt-0.5" />
        <p className="line-clamp-2">{voucher.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-2 text-sm">
        <span className="flex items-center gap-2 text-gray-500">
          <CalendarDays className="w-4 h-4 text-purple-400" />
          Từ ngày 
        </span>

        <span className="font-medium text-gray-700">
          {voucher.startDate
            ? new Date(voucher.startDate).toLocaleDateString("vi-VN")
            : "Chưa đặt"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center gap-2 text-violet-600 font-medium">
          <Coins className="w-4 h-4" />
          {voucher.voucherPrice}
        </div>

        <div className="text-pink-500 font-medium">
          {voucher.remainingQuantity}/{voucher.quantity}
        </div>
      </div>

    </div>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "DRAFTED":
      return "bg-violet-50 text-violet-600 border-violet-200";
    case "ENDED":
      return "bg-gray-100 text-gray-500 border-gray-200";
    case "REJECTED":
      return "bg-red-50 text-red-500 border-red-200";
    case "PENDING":
      return "bg-amber-50 text-amber-600 border-amber-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

function VoucherSkeleton() {
  return (
    <div className="border border-violet-100 rounded-2xl p-5 animate-pulse bg-white">
      <div className="h-5 bg-gray-300 rounded w-1/3 mb-3"></div>

      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>

      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}) {
  return (
    <div className="flex justify-center gap-3 mt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 disabled:opacity-40"
      >
        Prev
      </button>

      <span className="px-4 py-2 font-medium text-violet-600">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}