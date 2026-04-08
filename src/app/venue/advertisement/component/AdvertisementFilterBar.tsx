"use client";

import { useRef } from "react";

type Props = {
  searchKeyword: string; // state filter thực sự
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

  const selectClass =
    "border border-violet-200 bg-white rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm";

  return (
    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <div className="flex gap-3">
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="ALL">Tất cả trạng thái</option>
          <option value="DRAFT">Nháp</option>
          <option value="PENDING">Đang chờ</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="REJECTED">Bị từ chối</option>
        </select>
      </div>



      <div className="flex gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm quảng cáo..."
            defaultValue={searchKeyword}
            onChange={(e) => (searchRef.current = e.target.value)}
            className="border border-violet-200 rounded-full pl-9 pr-4 py-2 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-3 py-1 bg-[#8093F1] text-white rounded-xl text-sm"
        >
          Tìm
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1 border border-[#8093F1] text-[#8093F1] rounded-xl text-sm"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}