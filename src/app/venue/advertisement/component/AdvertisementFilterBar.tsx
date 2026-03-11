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
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left */}
      <div className="flex gap-3">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="newest">Sắp xếp: Mới nhất</option>
          <option value="oldest">Sắp xếp: Cũ nhất</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="ALL">Tất cả</option>
          <option value="DRAFT">Nháp</option>
          <option value="PENDING">Đang chờ</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="REJECTED">Bị từ chối</option>
        </select>
      </div>

      {/* Right */}
      <input
        type="text"
        placeholder="Tìm kiếm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-full px-4 py-2 w-72"
      />
    </div>
  );
}