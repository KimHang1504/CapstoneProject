"use client";

import { getAllVouchers } from "@/api/admin/api";
import { Voucher } from "@/api/admin/type";
import BackButton from "@/components/BackButton";
import { Plus } from "lucide-react";
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

    const res = await getAllVouchers({
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
      <BackButton />
      <div className="flex gap-5 items-center ">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Quản lí voucher</h2>
        <Link href="/admin/voucher-management/all"
          className="inline-flex items-center gap-2 text-sm bg-violet-600 text-white px-4 py-2 rounded-full shadow hover:bg-violet-700 transition"
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
    <div className="rounded-xl p-5 bg-white shadow-md border border-black">

      <div className="flex justify-between items-center">
        <Link href={`/admin/voucher-management/voucher/${voucher.id}`} className="flex-1">
          <h2 className="font-semibold text-lg">
            {voucher.title}
          </h2>
        </Link>

        <span
          className={`text-xs px-3 py-1 rounded-full ${getStatusColor(voucher.status)} font-bold`}
        >
          {voucher.status}
        </span>

      </div>

      <p className="text-gray-500 text-sm mt-1">
        Code: {voucher.code}
      </p>

      <p className="text-gray-600 mt-2 line-clamp-2">
        {voucher.description}
      </p>

      <div className="flex justify-between mt-4 text-sm">

        <span className="text-[#8093F1] font-medium">
          Points: {voucher.voucherPrice}
        </span>

        <span className="text-[#72DDF7] font-medium">
          {voucher.remainingQuantity}/{voucher.quantity}
        </span>

      </div>

    </div>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-[#72DDF7]/20 text-[#72DDF7]";
    case "APPROVED":
      return "bg-green-500 text-white";
    case "ENDED":
      return "bg-gray-200 text-gray-600";
    case "REJECTED":
      return "bg-red-100 text-red-500";
    case "PENDING":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

function VoucherSkeleton() {
  return (
    <div className="border rounded-xl p-5 animate-pulse">

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
        className="px-4 py-2 rounded disabled:opacity-40 cursor-pointer"
      >
        Prev
      </button>

      <span className="px-4 py-2  font-medium">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 rounded disabled:opacity-40 cursor-pointer"
      >
        Next
      </button>

    </div>
  );
}