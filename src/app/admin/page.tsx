'use client';

import { TrendingUp, Users, Building2, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Tổng Venue',
      value: '120',
      change: '+12.5%',
      isPositive: true,
      icon: Building2,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Tổng User',
      value: '1,542',
      change: '+8.2%',
      isPositive: true,
      icon: Users,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Doanh thu',
      value: '$45,890',
      change: '+23.1%',
      isPositive: true,
      icon: DollarSign,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Tăng trưởng',
      value: '18.3%',
      change: '+2.4%',
      isPositive: true,
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-100 group hover:scale-105 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${
                      stat.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Doanh thu theo tháng</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-purple-400 to-pink-400 rounded-t-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 cursor-pointer"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-400">T{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {[
              { user: 'The Coffee House', action: 'Đăng ký venue mới', time: '5 phút trước', color: 'bg-purple-100 text-purple-600' },
              { user: 'Nguyễn Văn A', action: 'Đặt voucher', time: '15 phút trước', color: 'bg-pink-100 text-pink-600' },
              { user: 'Highland Coffee', action: 'Cập nhật thông tin', time: '1 giờ trước', color: 'bg-blue-100 text-blue-600' },
              { user: 'Trần Thị B', action: 'Đăng ký tài khoản', time: '2 giờ trước', color: 'bg-green-100 text-green-600' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 cursor-pointer group">
                <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center font-semibold text-sm group-hover:scale-110 transition-transform`}>
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{activity.user}</p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 p-8 rounded-2xl border border-purple-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Thêm Venue', icon: '🏢' },
            { label: 'Thêm User', icon: '👤' },
            { label: 'Tạo Voucher', icon: '🎫' },
            { label: 'Xem Báo cáo', icon: '📊' },
          ].map((action, i) => (
            <button
              key={i}
              className="bg-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group border border-purple-100"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
              <p className="font-medium text-gray-700 text-sm">{action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
