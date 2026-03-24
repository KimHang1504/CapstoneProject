type Props = {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
};

export default function AdvertisementFilterBar({
  search,
  setSearch,
  status,
  setStatus,
  sort,
  setSort,
}: Props) {
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

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm quảng cáo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-violet-200 rounded-full pl-9 pr-4 py-2 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm"
        />
      </div>
    </div>
  );
}
