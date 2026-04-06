"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyVouchers } from "@/api/venue/vouchers/api";
import { Voucher, VoucherFilterType } from "@/api/venue/vouchers/type";
import VoucherFilter from "@/app/venue/voucher/component/VoucherFilter";
import ListVoucher from "@/app/venue/voucher/component/ListVoucher";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<VoucherFilterType>({
    keyword: "",
    status: "",
  });

  const fetchVouchers = async (page: number = currentPage) => {
    try {
      setLoading(true);
      const res = await getMyVouchers({
        pageNumber: page,
        pageSize: 8,
        keyword: filters.keyword || undefined,
        status: filters.status || undefined,
      });

      setVouchers(res.data.items);
      setTotalPages(res.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vouchers on mount
  useEffect(() => {
    fetchVouchers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchVouchers(page);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý Voucher
          </h1>
          <p className="text-sm text-gray-400 mt-1">Theo dõi và quản lý tất cả voucher của bạn</p>
        </div>

        <Link
          href="/venue/voucher/myvoucher/create"
          className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Tạo mới
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <VoucherFilter
          filters={filters}
          setFilters={setFilters}
          onFilter={() => fetchVouchers(1)}
        />
      </div>

      {/* List */}
      <ListVoucher
        vouchers={vouchers}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? "bg-violet-600 text-white shadow-md"
                  : "border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-white"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      )}

    </div>
  );
}