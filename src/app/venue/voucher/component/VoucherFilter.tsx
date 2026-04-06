"use client";

import { VoucherFilterType, VoucherStatus } from "@/api/venue/vouchers/type";
import { Dispatch, SetStateAction } from "react";
import { Search, Filter, Sparkles } from "lucide-react";

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
    <div className="flex flex-col md:flex-row gap-3">

      {/* Search Input */}
      <div className="flex-1 relative group">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 
                     text-purple-300 group-focus-within:text-[#8093F1] transition"
        />
        <input
          type="text"
          placeholder="Tìm kiếm voucher..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value })
          }
          className="w-full pl-10 pr-4 py-2.5 text-sm 
                     border border-purple-100 rounded-xl 
                     bg-white/70 backdrop-blur
                     focus:bg-white focus:outline-none 
                     focus:ring-2 focus:ring-[#8093F1] focus:border-transparent
                     transition-all placeholder:text-purple-300"
        />
      </div>

      {/* Status Select */}
      <div className="relative flex items-center">
        <Filter
          size={16}
          className="absolute left-3 text-purple-300 pointer-events-none"
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value as "" | VoucherStatus,
            })
          }
          className="appearance-none pl-9 pr-10 py-2.5 text-sm 
                     border border-purple-100 rounded-xl 
                     bg-white/70 backdrop-blur
                     focus:bg-white focus:outline-none 
                     focus:ring-2 focus:ring-[#8093F1] focus:border-transparent
                     transition-all cursor-pointer text-gray-700"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="DRAFTED">Nháp</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="ENDED">Đã kết thúc</option>
        </select>

        {/* Custom arrow */}
        <span className="pointer-events-none absolute right-3 text-purple-300 text-xs">
          ▼
        </span>
      </div>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        className="flex items-center justify-center gap-2 px-5 py-2.5 
                   rounded-xl text-sm font-semibold text-white
                   bg-linear-to-r from-[#8093F1] to-pink-400
                   hover:from-[#6f82e8] hover:to-pink-500
                   active:scale-[0.97]
                   transition-all shadow-md hover:shadow-lg"
      >
        <Sparkles size={16} />
        Lọc
      </button>
    </div>
  );
}