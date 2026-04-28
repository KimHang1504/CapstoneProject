"use client";

import { useRef } from "react";
import { Search, Filter, ArrowUpDown, Sparkles } from "lucide-react";

type Props = {
  searchKeyword: string;
  setSearchKeyword: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
};

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

      {/* LEFT: Selects */}
      <div className="flex gap-3 flex-wrap">

        {/* Sort */}
        <div className="relative flex items-center">
          <ArrowUpDown
            size={16}
            className="absolute left-3 text-purple-300 pointer-events-none"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-9 pr-10 py-2.5 text-sm 
                       border border-purple-100 rounded-xl 
                       bg-white/70 backdrop-blur
                       focus:bg-white focus:outline-none 
                       focus:ring-2 focus:ring-[#8093F1] focus:border-transparent
                       transition-all cursor-pointer text-gray-700"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
          <span className="pointer-events-none absolute right-3 text-purple-300 text-xs">
            ▼
          </span>
        </div>

        {/* Status */}
        <div className="relative flex items-center">
          <Filter
            size={16}
            className="absolute left-3 text-purple-300 pointer-events-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none pl-9 pr-10 py-2.5 text-sm 
                       border border-purple-100 rounded-xl 
                       bg-white/70 backdrop-blur
                       focus:bg-white focus:outline-none 
                       focus:ring-2 focus:ring-[#8093F1] focus:border-transparent
                       transition-all cursor-pointer text-gray-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="DRAFT">Nháp</option>
            <option value="PENDING">Đang chờ</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="REJECTED">Bị từ chối</option>
          </select>
          <span className="pointer-events-none absolute right-3 text-purple-300 text-xs">
            ▼
          </span>
        </div>
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
          className="flex items-center gap-2 px-4 py-2.5 
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
          className="px-4 py-2.5 text-sm font-medium
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