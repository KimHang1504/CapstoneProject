'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, Ticket,
  TrendingUp, ChevronLeft, ChevronRight,
  BarChart2, Megaphone, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, Legend
} from 'recharts';
import { getVenueOwnerDashboardOverview, getVenueSettlementRevenue } from '@/api/venue/dashboard/api';
import { VenueOwnerDashboardOverview, VenuePerformance, RecentAdvertisement, RevenueItem } from '@/api/venue/dashboard/type';
import { getLocationStatusUI } from '@/app/venue/location/locationStatusUI';

// const CHART_COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#0ea5e9', '#f43f5e'];
const ITEMS_PER_PAGE = 6;

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS_VI = ['Th.1','Th.2','Th.3','Th.4','Th.5','Th.6','Th.7','Th.8','Th.9','Th.10','Th.11','Th.12'];

function MiniDatePicker({
  value,
  onChange,
  min,
  max,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.slice(0, 4)) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.slice(5, 7)) - 1 : new Date().getMonth());
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = value ? new Date(value + 'T00:00:00') : null;
  const minDate = min ? new Date(min + 'T00:00:00') : null;
  const maxDate = max ? new Date(max + 'T00:00:00') : null;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    onChange(str);
    setOpen(false);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;
  };

  const displayValue = selected
    ? `${String(selected.getDate()).padStart(2, '0')}/${String(selected.getMonth() + 1).padStart(2, '0')}/${selected.getFullYear()}`
    : label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-[11px] border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 hover:border-violet-300 transition focus:outline-none focus:ring-1 focus:ring-violet-400 bg-white whitespace-nowrap"
      >
        <Calendar size={12} className="text-violet-400 shrink-0" />
        {displayValue}
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-3 w-[220px]">
          {/* Header: prev / month+year / next */}
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100 transition">
              <ChevronLeft size={13} className="text-gray-500" />
            </button>
            <span className="text-[11px] font-semibold text-gray-700">
              {MONTHS_VI[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-gray-100 transition">
              <ChevronRight size={13} className="text-gray-500" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[9px] font-medium text-gray-400 py-0.5">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                disabled={isDisabled(day)}
                onClick={() => selectDay(day)}
                className={`
                  text-[11px] h-7 w-full rounded-lg transition font-medium
                  ${isSelected(day) ? 'bg-violet-500 text-white' : ''}
                  ${!isSelected(day) && !isDisabled(day) ? 'hover:bg-violet-50 text-gray-700' : ''}
                  ${isDisabled(day) ? 'text-gray-300 cursor-not-allowed' : ''}
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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

const CustomTooltip = ({ active, payload, unit = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        {/* <p className="font-medium text-gray-900 text-sm">{payload[0].name}</p> */}
        <p className="text-xs text-gray-600">
          {payload[0].value} {unit}
        </p>
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
function safeImg(src: string[] | string | null | undefined) {
  // Handle array format (new API response)
  if (Array.isArray(src) && src.length > 0) {
    const firstImg = src[0];
    return firstImg && firstImg.startsWith('http') ? firstImg : FALLBACK_IMG;
  }
  // Handle string format (legacy or fallback)
  if (typeof src === 'string' && src.startsWith('http')) {
    return src;
  }
  return FALLBACK_IMG;
}

function VenueRow({ v }: { v: VenuePerformance }) {
  const statusUI = getLocationStatusUI(v);
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
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${statusUI.color}`}>
          {statusUI.label}
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
  const [revenueItems, setRevenueItems] = useState<RevenueItem[]>([]);
  const [revenueFromDate, setRevenueFromDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [revenueToDate, setRevenueToDate] = useState(`${new Date().getFullYear()}-12-31`);
  const [revenueLoading, setRevenueLoading] = useState(false);

  useEffect(() => {
    getVenueOwnerDashboardOverview()
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setRevenueLoading(true);
    getVenueSettlementRevenue(revenueFromDate, revenueToDate, 'day')
      .then(res => setRevenueItems(res.data?.items ?? []))
      .catch(() => setRevenueItems([]))
      .finally(() => setRevenueLoading(false));
  }, [revenueFromDate, revenueToDate]);

  console.log("Dashboard render", { data, loading });

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
    { name: 'Đang hoạt động', value: data.activeVouchers },
    { name: 'Đã đổi', value: data.totalVoucherExchanged },
    { name: 'Đã dùng', value: data.totalVoucherUsed },
  ];

  const engagementData = [
    { name: 'Đánh giá', value: data.totalReviews },
    { name: 'Ghé thăm', value: data.totalCheckIns },
    { name: 'Yêu thích', value: data.totalFavorites },
  ];

  const statusUI: Record<string, { label: string; color: string }> = {
    DRAFT: {
      label: 'Nháp',
      color: 'bg-gray-100 text-gray-600',
    },
    PENDING: {
      label: 'Chờ duyệt',
      color: 'bg-yellow-100 text-yellow-600',
    },
    APPROVED: {
      label: 'Đã duyệt',
      color: 'bg-green-100 text-green-600',
    },
    REJECTED: {
      label: 'Bị từ chối',
      color: 'bg-red-100 text-red-600',
    },
    ACTIVE: {
      label: 'Đang hoạt động',
      color: 'bg-emerald-100 text-emerald-600',
    },
  };


  // Mock revenue data (voucher commission)
  const revenueData = revenueItems.map(item => ({
    label: item.label,
    revenue: item.revenue,
    count: item.count,
  }));

  const totalRevenue = revenueItems.reduce((s, d) => s + d.revenue, 0);
  const totalCount = revenueItems.reduce((s, d) => s + d.count, 0);

  const formatVND = (v: number) => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(0) + 'k';
    return v.toString();
  };

  const RevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs space-y-1">
          <p className="font-semibold text-gray-700 mb-1">{label}</p>
          {payload.map((p: any) => (
            <div key={p.dataKey} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-gray-500">{p.name === 'revenue' ? 'Doanh thu' : 'Số giao dịch'}:</span>
              <span className="font-bold text-gray-800">
                {p.name === 'revenue'
                  ? Number(p.value).toLocaleString('vi-VN') + 'đ'
                  : p.value + ' GD'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4 max-w-350 mx-auto">

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <SectionTitle icon={TrendingUp}>Doanh thu từ hoa hồng Voucher</SectionTitle>
          {/* Date range — compact row */}
          <div className="flex items-center gap-1.5 shrink-0">
            <MiniDatePicker
              value={revenueFromDate}
              max={revenueToDate}
              onChange={setRevenueFromDate}
              label="Từ ngày"
            />
            <span className="text-gray-300 text-xs">→</span>
            <MiniDatePicker
              value={revenueToDate}
              min={revenueFromDate}
              onChange={setRevenueToDate}
              label="Đến ngày"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-violet-50 rounded-lg p-3">
            <p className="text-[11px] text-gray-500">Tổng doanh thu</p>
            <p className="text-lg font-bold text-violet-700">
              {totalRevenue.toLocaleString('vi-VN')}đ
            </p>
          </div>
          <div className="bg-pink-50 rounded-lg p-3">
            <p className="text-[11px] text-gray-500">Số giao dịch</p>
            <p className="text-lg font-bold text-pink-600">{totalCount}</p>
          </div>
        </div>
        <div className="h-64 relative">
          {revenueLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg z-10">
              <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!revenueLoading && revenueData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Không có dữ liệu trong khoảng thời gian này
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatVND} tick={{ fontSize: 10 }} width={45} />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="url(#gradRevenue)"
                  dot={{ r: 3, fill: '#8b5cf6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
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
              <div className="min-w-0 flex flex-col">
                <p className="text-xs text-gray-600 mb-2.5 font-medium">Địa điểm</p>
                <div className="space-y-2.5 flex-1">
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Bản nháp</span>
                      <span className="font-semibold text-slate-600">{data.draftVenues}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalVenues > 0 ? Math.min(100, (data.draftVenues / data.totalVenues) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Chờ duyệt</span>
                      <span className="font-semibold text-yellow-600">{data.pendingVenues}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalVenues > 0 ? Math.min(100, (data.pendingVenues / data.totalVenues) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Đang hoạt động</span>
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
                      <span className="text-gray-700">Tạm ngưng</span>
                      <span className="font-semibold text-orange-600">{data.suspendedVenues}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalVenues > 0 ? Math.min(100, (data.suspendedVenues / data.totalVenues) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Hết hạn</span>
                      <span className="font-semibold text-red-600">{data.expiredVenues}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalVenues > 0 ? Math.min(100, (data.expiredVenues / data.totalVenues) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400">Tổng: <span className="font-bold text-gray-900">{data.totalVenues}</span></p>
                </div>
              </div>

              {/* Ads Status */}
              <div className="min-w-0 flex flex-col">
                <p className="text-xs text-gray-600 mb-2.5 font-medium">Quảng cáo</p>
                <div className="space-y-2.5 flex-1">
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Đang hoạt động</span>
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
                      <span className="text-gray-700">Đang chờ duyệt</span>
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
                      <span className="text-gray-700">Bị từ chối</span>
                      <span className="font-semibold text-red-600">{data.rejectedAdvertisements}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalAdvertisements > 0 ? Math.min(100, (data.rejectedAdvertisements / data.totalAdvertisements) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-700">Bản nháp</span>
                      <span className="font-semibold text-slate-600">{data.draftAdvertisements}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.totalAdvertisements > 0 ? Math.min(100, (data.draftAdvertisements / data.totalAdvertisements) * 100) : 0}%` }}
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
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm h-60 flex flex-col">
              <SectionTitle icon={TrendingUp}>Tương tác</SectionTitle>
              <div className="flex-1">
                {data.activeVenues === 0 ? (
                  <div className="h-full flex items-center text-center justify-center text-gray-400 text-sm">
                    Chưa có tương tác nào do chưa có địa điểm hoạt động.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Lượt', angle: -90, position: 'insideLeft', fontSize: 10 }}
                      />
                      <Tooltip content={<CustomTooltip unit="lượt" />} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Recent Ads */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm h-60 flex flex-col">
              <SectionTitle icon={Megaphone}>Quảng cáo gần đây</SectionTitle>
              <div className="flex-1 overflow-y-auto space-y-2">
                {data.recentAdvertisements.length === 0 && (
                  <p className="text-center text-gray-400 py-6 text-xs">Chưa có quảng cáo nào.</p>
                )}
                {data.recentAdvertisements.slice(0, 3).map((ad: RecentAdvertisement) => {
                  const ui = statusUI[ad.status] ?? {
                    label: ad.status,
                    color: 'bg-gray-100 text-gray-500',
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
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${ui.color}`}
                        >
                          {ui.label}
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
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm h-60 flex flex-col">
            <SectionTitle icon={Ticket}>Voucher</SectionTitle>
            {data.totalVouchers === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500 text-sm">
                  <p className="font-medium">Chưa có dữ liệu voucher</p>
                  <p className="text-xs mt-1">Hãy tạo voucher để xem thống kê tại đây</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={voucherData}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Mã', angle: -90, position: 'insideLeft', fontSize: 10 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="bg-orange-50 rounded-lg p-2">
                    <p className="text-gray-600">Tỉ lệ đổi</p>
                    <p className="font-bold text-orange-600">
                      {data.voucherExchangeRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-2">
                    <p className="text-gray-600">Tỉ lệ dùng</p>
                    <p className="font-bold text-teal-600">
                      {data.voucherUsageRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </>
            )}


          </div>
        </div>

        {/* Right Column - Venues List */}
        <div className="flex flex-col gap-4">

          {/* Top Venue - Larger */}
          {data.topPerformingVenue && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-75 flex flex-col">
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-bold text-base leading-tight mb-1">{data.topPerformingVenue.venueName}</p>
                    <p className="text-xs opacity-90">{data.topPerformingVenue.category ?? '—'}</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-center border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Ghé thăm</p>
                    <p className="font-bold text-lg text-gray-900">{data.topPerformingVenue.checkInCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Đánh giá</p>
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
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
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
