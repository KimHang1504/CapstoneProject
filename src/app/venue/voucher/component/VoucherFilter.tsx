"use client";

import { VoucherFilterType, VoucherStatus } from "@/api/venue/vouchers/type";
import { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";

type Props = {
  filters: VoucherFilterType;
  setFilters: Dispatch<SetStateAction<VoucherFilterType>>;
  onFilter: () => void;
};

export default function VoucherFilter({
  filters,
  setFilters,
  onFilter,
}: Props) {
  return (
    <div className="flex gap-3">

      {/* Search Input */}
      <div className="flex-1 relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm voucher..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value })
          }
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Select */}
      <select
        value={filters.status}
        onChange={(e) =>
          setFilters({
            ...filters,
            status: e.target.value as "" | VoucherStatus,
          })
        }
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="DRAFTED">Nháp</option>
        <option value="PENDING">Chờ duyệt</option>
        <option value="APPROVED">Đã duyệt</option>
        <option value="REJECTED">Từ chối</option>
        <option value="ACTIVE">Đang hoạt động</option>
        <option value="ENDED">Đã kết thúc</option>
      </select>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        Lọc
      </button>

    </div>
  );
}
