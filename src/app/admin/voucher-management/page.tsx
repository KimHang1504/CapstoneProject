"use client";

import { getVouchers } from "@/api/admin/api";
import { Voucher } from "@/api/admin/type";
import { Plus, Hash, AlignLeft, Coins, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import VoucherCard from "./components/VoucherCard";
import VoucherSkeleton from "./components/VoucherSkeleton";
import Pagination from "./components/VoucherPagination";
import VoucherPagination from "./components/VoucherPagination";

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

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
      Keyword: keyword,
    });

    const data = res.data;

    setVouchers(data.items);
    setTotalPages(data.totalPages);
    setLoading(false);
  };


  useEffect(() => {
    setPage(1);
  }, [keyword]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 500); 

    return () => clearTimeout(delay);
  }, [keyword, page]);



  return (
    <div className="px-8 py-4 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
          Quản lí voucher
        </h2>

        <Link
          href="/admin/voucher-management/voucher/all"
          className="inline-flex items-center gap-2 text-sm bg-linear-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-full shadow hover:opacity-90 transition"
        >
          <Plus size={18} />
          Xem tất cả voucher
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">

        {/* Search */}
        <input
          type="text"
          placeholder="Tìm kiếm voucher..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />

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

            <VoucherPagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}


