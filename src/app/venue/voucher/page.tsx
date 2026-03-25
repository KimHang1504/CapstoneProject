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

  // Auto-fetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVouchers(1);
    }, 500); // Debounce 500ms for keyword search

    return () => clearTimeout(timeoutId);
  }, [filters.keyword, filters.status]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchVouchers(page);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý Voucher
        </h1>

        <Link
          href="/venue/voucher/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Tạo Voucher
        </Link>
      </div>

      {/* Filter */}
      <VoucherFilter
        filters={filters}
        setFilters={setFilters}
        onFilter={() => fetchVouchers(1)}
      />

      {/* List */}
      <ListVoucher
        vouchers={vouchers}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

    </div>
  );
}