"use client";

import { VoucherFilterType, VoucherStatus } from "@/api/venue/vouchers/type";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { Search, Filter, Sparkles, ChevronDown, Check } from "lucide-react";

type Props = {
  filters: VoucherFilterType;
  setFilters: Dispatch<SetStateAction<VoucherFilterType>>;
  onFilter: (f?: VoucherFilterType) => void;
};

const STATUS_OPTIONS: { label: string; value: "" | VoucherStatus }[] = [
  { label: "Tất cả trạng thái", value: "" },
  { label: "Nháp", value: "DRAFTED" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Từ chối", value: "REJECTED" },
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đã kết thúc", value: "ENDED" },
];

export default function VoucherFilter({ filters, setFilters, onFilter }: Props) {
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node))
        setStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? "Tất cả trạng thái";

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
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          onKeyDown={(e) => { if (e.key === "Enter") onFilter(filters); }}
          className="w-full pl-10 pr-4 py-2.5 text-sm
                     border border-purple-100 rounded-xl
                     bg-white/70 backdrop-blur
                     focus:bg-white focus:outline-none
                     focus:ring-2 focus:ring-[#8093F1] focus:border-transparent
                     transition-all placeholder:text-purple-300"
        />
      </div>

      {/* Status Dropdown */}
      <div ref={statusRef} className="relative">
        <button
          onClick={() => setStatusOpen((o) => !o)}
          className="flex items-center gap-2 pl-3 pr-3 py-2.5 text-sm
                     border border-purple-100 rounded-xl
                     bg-white/70 backdrop-blur
                     hover:bg-white hover:border-purple-300
                     focus:outline-none focus:ring-2 focus:ring-[#8093F1] focus:border-transparent
                     transition-all cursor-pointer text-gray-700 whitespace-nowrap w-full md:w-auto"
        >
          <Filter size={15} className="text-purple-300 shrink-0" />
          <span className="flex-1 text-left">{selectedLabel}</span>
          <ChevronDown
            size={13}
            className={`text-purple-300 transition-transform shrink-0 ${statusOpen ? "rotate-180" : ""}`}
          />
        </button>

        {statusOpen && (
          <div className="absolute left-0 mt-1.5 bg-white border border-purple-100 rounded-xl shadow-lg z-30 overflow-hidden min-w-50">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  const newFilters = { ...filters, status: opt.value };
                  setFilters(newFilters);
                  setStatusOpen(false);
                  onFilter(newFilters);
                }}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition
                  ${opt.value === filters.status
                    ? "bg-purple-50 text-purple-600 font-medium"
                    : "text-gray-700 hover:bg-purple-50"
                  }`}
              >
                {opt.label}
                {opt.value === filters.status && (
                  <Check size={13} className="text-purple-500 shrink-0 ml-3" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Button */}
      <button
        onClick={() => onFilter(filters)}
        className="flex items-center justify-center gap-2 px-5 py-2.5 cursor-pointer
                   rounded-xl text-sm font-semibold text-white
                   bg-linear-to-r from-[#8093F1] to-pink-400
                   hover:from-[#6f82e8] hover:to-pink-500
                   active:scale-[0.97]
                   transition-all shadow-md hover:shadow-lg"
      >
        <Sparkles size={16} />
        Lọc
      </button>

      {/* Reset Button */}
      <button
        onClick={() => {
          const newFilters: VoucherFilterType = { ...filters, keyword: "", status: "" };
          setFilters(newFilters);
          onFilter(newFilters);
        }}
        className="px-5 py-2.5 text-sm font-medium cursor-pointer
                   rounded-xl border border-purple-200
                   text-purple-500 bg-white/70 backdrop-blur
                   hover:bg-purple-50 hover:border-purple-300
                   transition-all"
      >
        Xóa
      </button>
    </div>
  );
}
