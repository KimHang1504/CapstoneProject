'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, MapPin, Heart, CheckCircle, Ticket, Users,
  TrendingUp, ChevronLeft, ChevronRight,
  BarChart2, Sparkles, Megaphone
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { getVenueOwnerDashboardOverview } from '@/api/venue/dashboard/api';
import { VenueOwnerDashboardOverview, VenuePerformance, RecentAdvertisement } from '@/api/venue/dashboard/type';

const CHART_COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#0ea5e9', '#f43f5e'];
const ITEMS_PER_PAGE = 5;

function StatCard({
  label, value, icon: Icon, color
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-200 flex items-center gap-3 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900 text-sm">{payload[0].name}</p>
        <p className="text-xs text-gray-600">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
          <Icon size={14} className="text-violet-600" />
        </div>
      )}
      <h2 className="text-sm font-semibold text-gray-800">{children}</h2>
    </div>
  );
}

const FALLBACK_IMG = 'https://i.pinimg.com/736x/36/21/a9/3621a941262c3977faff6f9a47943eee.jpg';
function safeImg(src: string | null | undefined) {
  return src && src.startsWith('http') ? src : FALLBACK_IMG;
}

function VenueRow({ v }: { v: VenuePerformance }) {
  const statusColor: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-600',
    INACTIVE: 'bg-gray-100 text-gray-500',
    PENDING: 'bg-yellow-100 text-yellow-600',
    DRAFTED: 'bg-blue-100 text-blue-500',
  };
  return (
    <Link href={`/venue/location/mylocation/${v.venueId}`}>
      <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-violet-50 transition cursor-pointer">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
          <Image
            src={safeImg(v.coverImage)}
            alt={v.venueName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">{v.venueName}</p>
          <p className="text-xs text-gray-400 truncate">{v.category ?? '—'}</p>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold shrink-0">
          <Star size={11} fill="currentColor" />
          {v.averageRating.toFixed(1)}
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[v.status] ?? 'bg-gray-100 text-gray-500'}`}>
          {v.status}
        </span>
        <div className="text-[10px] text-gray-500 shrink-0 text-right">
          <div>{v.checkInCount} check-in</div>
        </div>
      </div>
    </Link>
  );
}

export default function VenueDashboardPage() {
  const [data, setData] = useState<VenueOwnerDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getVenueOwnerDashboardOverview()
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-gray-500 text-sm">Không thể tải dữ liệu dashboard.</div>;
  }

  // Pagination
  const totalPages = Math.ceil(data.venues.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVenues = data.venues.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Chart data
  const voucherData = [
    { name: 'Tổng', value: data.totalVouchers },
    { name: 'Active', value: data.activeVouchers },
    { name: 'Đã đổi', value: data.totalVoucherExchanged },
    { name: 'Đã dùng', value: data.totalVoucherUsed },
  ];

  const engagementData = [
    { name: 'Reviews', value: data.totalReviews },
    { name: 'Check-ins', value: data.totalCheckIns },
    { name: 'Favorites', value: data.totalFavorites },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400">Tổng quan hoạt động của bạn</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 px-3 py-1.5 rounded-lg border border-purple-200">
          <Sparkles size={14} className="text-purple-600" />
          <span className="text-xs font-medium text-purple-700">AI Insights</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard label="Địa điểm" value={data.totalVenues} icon={MapPin} color="bg-violet-500" />
        <StatCard label="Active" value={data.activeVenues} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard label="Đánh giá" value={data.averageRating.toFixed(1)} icon={Star} color="bg-amber-500" />
        <StatCard label="Check-in" value={data.totalCheckIns} icon={CheckCircle} color="bg-sky-500" />
        <StatCard label="Yêu thích" value={data.totalFavorites} icon={Heart} color="bg-rose-500" />
        <StatCard label="Khách hàng" value={data.uniqueCustomers} icon={Users} color="bg-indigo-500" />
        <StatCard label="Quảng cáo" value={data.totalAdvertisements} icon={Megaphone} color="bg-purple-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Status Overview - Simple Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <SectionTitle icon={BarChart2}>Trạng thái tổng quan</SectionTitle>
            <div className="grid grid-cols-2 gap-6 mt-3">
              {/* Venue Status */}
              <div className="min-w-0">
                <p className="text-xs text-gray-600 mb-2.5 font-medium">Địa điểm</p>
                <div className="space-y-2.5">
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Active</span>
                      <span className="font-semibold text-emerald-600">{data.activeVenues}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalVenues > 0 ? Math.min(100, (data.activeVenues / data.totalVenues) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Inactive</span>
                      <span className="font-semibold text-gray-600">{data.inactiveVenues}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-400 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalVenues > 0 ? Math.min(100, (data.inactiveVenues / data.totalVenues) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  {/* Spacer để cân bằng với cột bên phải */}
                  <div className="h-[30px]"></div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400">Tổng: <span className="font-bold text-gray-900">{data.totalVenues}</span></p>
                </div>
              </div>

              {/* Ads Status */}
              <div className="min-w-0">
                <p className="text-xs text-gray-600 mb-2.5 font-medium">Quảng cáo</p>
                <div className="space-y-2.5">
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Active</span>
                      <span className="font-semibold text-emerald-600">{data.activeAdvertisements}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalAdvertisements > 0 ? Math.min(100, (data.activeAdvertisements / data.totalAdvertisements) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Pending</span>
                      <span className="font-semibold text-yellow-600">{data.pendingAdvertisements}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalAdvertisements > 0 ? Math.min(100, (data.pendingAdvertisements / data.totalAdvertisements) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Rejected</span>
                      <span className="font-semibold text-red-600">{data.rejectedAdvertisements}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalAdvertisements > 0 ? Math.min(100, (data.rejectedAdvertisements / data.totalAdvertisements) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400">Tổng: <span className="font-bold text-gray-900">{data.totalAdvertisements}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement + Recent Ads */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Engagement Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm h-[240px] flex flex-col">
              <SectionTitle icon={TrendingUp}>Tương tác</SectionTitle>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Ads */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm h-[240px] flex flex-col">
              <SectionTitle icon={Megaphone}>Quảng cáo gần đây</SectionTitle>
              <div className="flex-1 overflow-y-auto space-y-2">
                {data.recentAdvertisements.length === 0 && (
                  <p className="text-center text-gray-400 py-6 text-xs">Chưa có quảng cáo nào.</p>
                )}
                {data.recentAdvertisements.slice(0, 3).map((ad: RecentAdvertisement) => {
                  const statusColor: Record<string, string> = {
                    DRAFT: 'bg-gray-100 text-gray-600',
                    PENDING: 'bg-yellow-100 text-yellow-600',
                    APPROVED: 'bg-green-100 text-green-600',
                    REJECTED: 'bg-red-100 text-red-600',
                    ACTIVE: 'bg-emerald-100 text-emerald-600',
                  };
                  return (
                    <Link key={ad.id} href={`/venue/advertisement/myadvertisement/${ad.id}`}>
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-violet-50 transition cursor-pointer border border-gray-100">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <Image
                            src={ad.bannerUrl}
                            alt={ad.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-gray-900 truncate">{ad.title}</p>
                          <p className="text-[10px] text-gray-400">{ad.venueCount} địa điểm</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[ad.status] ?? 'bg-gray-100 text-gray-500'}`}>
                          {ad.status}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {data.recentAdvertisements.length > 0 && (
                <Link href="/venue/advertisement/myadvertisement" className="mt-2 text-center">
                  <button className="w-full text-xs text-violet-600 hover:text-violet-700 font-medium py-2 hover:bg-violet-50 rounded-lg transition">
                    Xem tất cả →
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Voucher Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm h-[240px] flex flex-col">
            <SectionTitle icon={Ticket}>Voucher</SectionTitle>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={voucherData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="bg-orange-50 rounded-lg p-2">
                <p className="text-gray-600">Tỉ lệ đổi</p>
                <p className="font-bold text-orange-600">{data.voucherExchangeRate.toFixed(1)}%</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-2">
                <p className="text-gray-600">Tỉ lệ dùng</p>
                <p className="font-bold text-teal-600">{data.voucherUsageRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Venues List */}
        <div className="space-y-4">
          
          {/* Top Venue - Larger */}
          {data.topPerformingVenue && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[300px] flex flex-col">
              <div className="p-3 pb-2">
                <SectionTitle icon={Star}>Địa điểm nổi bật</SectionTitle>
              </div>
              <Link href={`/venue/location/mylocation/${data.topPerformingVenue.venueId}`} className="flex-1 flex flex-col">
                <div className="relative w-full flex-1 group cursor-pointer">
                  <Image
                    src={safeImg(data.topPerformingVenue.coverImage)}
                    alt={data.topPerformingVenue.venueName}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-bold text-base leading-tight mb-1">{data.topPerformingVenue.venueName}</p>
                    <p className="text-xs opacity-90">{data.topPerformingVenue.category ?? '—'}</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-center border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Check-in</p>
                    <p className="font-bold text-lg text-gray-900">{data.topPerformingVenue.checkInCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Reviews</p>
                    <p className="font-bold text-lg text-gray-900">{data.topPerformingVenue.reviewCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Yêu thích</p>
                    <p className="font-bold text-lg text-gray-900">{data.topPerformingVenue.favoriteCount}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Venues List with Pagination */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[438px] flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <SectionTitle icon={BarChart2}>Địa điểm ({data.venues.length})</SectionTitle>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {paginatedVenues.length === 0 && (
                <p className="text-center text-gray-400 py-6 text-xs">Chưa có địa điểm nào.</p>
              )}
              {paginatedVenues.map(v => (
                <VenueRow key={v.venueId} v={v} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="p-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  <ChevronLeft size={14} />
                  Trước
                </button>
                <span className="text-xs text-gray-500">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Sau
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
