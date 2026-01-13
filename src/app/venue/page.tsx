export default function VenueDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Đơn hàng hôm nay</h3>
          <p className="text-3xl font-bold mt-2">25</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Voucher đang hoạt động</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Doanh thu tháng này</h3>
          <p className="text-3xl font-bold mt-2">$12,450</p>
        </div>
      </div>
    </div>
  );
}
