"use client";

import { useRef, useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, Sparkles, ChevronDown, Check } from "lucide-react";

type Props = {
  searchKeyword: string;
  setSearchKeyword: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
};

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Cũ nhất", value: "oldest" },
];

const STATUS_OPTIONS = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "Nháp", value: "DRAFT" },
  { label: "Đang chờ", value: "PENDING" },
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Bị từ chối", value: "REJECTED" },
];

function CustomDropdown({
  value,
  onChange,
  options,
  icon: Icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  icon: React.ElementType;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-3 pr-3 py-2.5 text-sm
                   border border-purple-100 rounded-xl
                   bg-white/70 backdrop-blur
                   hover:bg-white hover:border-purple-300
                   focus:outline-none focus:ring-2 focus:ring-[#8093F1] focus:border-transparent
                   transition-all cursor-pointer text-gray-700 whitespace-nowrap"
      >
        <Icon size={15} className="text-purple-300 shrink-0" />
        <span>{selected?.label}</span>
        <ChevronDown
          size={13}
          className={`text-purple-300 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 bg-white border border-purple-100 rounded-xl shadow-lg z-30 overflow-hidden min-w-full">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition
                ${opt.value === value
                  ? "bg-purple-50 text-purple-600 font-medium"
                  : "text-gray-700 hover:bg-purple-50"
                }`}
            >
              {opt.label}
              {opt.value === value && <Check size={13} className="text-purple-500 shrink-0 ml-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdvertisementFilterBar({
  searchKeyword,
  setSearchKeyword,
  status,
  setStatus,
  sort,
  setSort,
}: Props) {
  const searchRef = useRef(searchKeyword);

  const handleSearch = () => {
    setSearchKeyword(searchRef.current);
  };

  const handleReset = () => {
    searchRef.current = "";
    setSearchKeyword("");
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

      {/* LEFT: Dropdowns */}
      <div className="flex gap-3 flex-wrap">
        <CustomDropdown
          value={sort}
          onChange={setSort}
          options={SORT_OPTIONS}
          icon={ArrowUpDown}
        />
        <CustomDropdown
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          icon={Filter}
        />
      </div>

      {/* RIGHT: Search + Actions */}
      <div className="flex gap-2 flex-wrap">

        {/* Search Input */}
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2
                       text-purple-300 group-focus-within:text-[#8093F1] transition"
          />
          <input
            type="text"
            placeholder="Tìm kiếm quảng cáo..."
            defaultValue={searchKeyword}
            onChange={(e) => (searchRef.current = e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-72 pl-10 pr-4 py-2.5 text-sm
                       border border-purple-100 rounded-xl
                       bg-white/70 backdrop-blur
                       focus:bg-white focus:outline-none
                       focus:ring-2 focus:ring-[#8093F1] focus:border-transparent
                       transition-all placeholder:text-purple-300"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-4 py-2.5 cursor-pointer
                     rounded-xl text-sm font-semibold text-white
                     bg-linear-to-r from-[#8093F1] to-pink-400
                     hover:from-[#6f82e8] hover:to-pink-500
                     active:scale-[0.97]
                     transition-all shadow-md hover:shadow-lg"
        >
          <Sparkles size={14} />
          Lọc
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="px-4 py-2.5 text-sm font-medium cursor-pointer
                     rounded-xl border border-purple-200
                     text-purple-500 bg-white/70 backdrop-blur
                     hover:bg-purple-50 hover:border-purple-300
                     transition-all"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
