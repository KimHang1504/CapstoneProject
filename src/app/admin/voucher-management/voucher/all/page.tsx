"use client";

import { getAllVouchers } from "@/api/admin/api";
import { Voucher } from "@/api/admin/type";
import BackButton from "@/components/BackButton";
import { Plus, Hash, AlignLeft, Coins, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import VoucherCard from "../../components/VoucherCard";
import VoucherSkeleton from "../../components/VoucherSkeleton";
import VoucherPagination from "../../components/VoucherPagination";
import StatusDropdown from "../../components/StatusDropdown";

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);

    const res = await getAllVouchers({
      PageNumber: page,
      PageSize: pageSize,
      SortBy: "createdAt",
      SortDirection: "desc",
      Keyword: keyword,
      Status: status,
    });

    const data = res.data;

    setVouchers(data.items);
    setTotalPages(data.totalPages);
    setTotalItems(data.totalCount);
    setLoading(false);
  };

  const fetchPendingCount = async () => {
    const res = await getAllVouchers({
      PageNumber: 1,
      PageSize: 1,
      SortBy: "createdAt",
      SortDirection: "desc",
      Status: "PENDING",
    });
    setPendingCount(res.data.totalCount);
  };

  useEffect(() => {
    fetchData();
    fetchPendingCount();
  }, [page, keyword, status]);

  useEffect(() => {
    setPage(1);
  }, [keyword, status]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delay);
  }, [keyword, status, page]);


  return (
    <div className="px-8 py-4 min-h-screen space-y-6">
      <BackButton />

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
          Tất cả voucher
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Đang chờ duyệt: <span className="font-semibold text-yellow-600">{pendingCount}</span> / Tổng số: <span className="font-semibold">{totalItems}</span>
        </p>
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

        {/* Status Filter */}
        <StatusDropdown value={status} onChange={setStatus} />

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

