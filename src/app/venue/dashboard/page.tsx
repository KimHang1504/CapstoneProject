'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, MapPin, Heart, CheckCircle, Ticket, Users,
  TrendingUp, TrendingDown, Calendar, BookOpen,
  BarChart2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { getVenueOwnerDashboardOverview } from '@/api/venue/dashboard/api';
import { VenueOwnerDashboardOverview, VenuePerformance } from '@/api/venue/dashboard/type';

function StatCard({
  label, value, sub, icon: Icon, color, trend
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-violet-100 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend !== undefined && (
          <span className={`flex items-center text-xs font-medium mb-0.5 ${trend >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
      <span className="w-1 h-4 rounded-full bg-violet-400 inline-block" />
      {children}
    </h2>
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
      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-violet-50 transition cursor-pointer">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
          <Image
            src={safeImg(v.coverImage)}
            alt={v.venueName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{v.venueName}</p>
          <p className="text-xs text-gray-400 truncate">{v.area ?? v.category ?? '—'}</p>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold shrink-0">
          <Star size={13} fill="currentColor" />
          {v.averageRating.toFixed(1)}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[v.status] ?? 'bg-gray-100 text-gray-500'}`}>
          {v.status}
        </span>
        <div className="text-xs text-gray-500 shrink-0 text-right">
          <div>{v.checkInCount} check-in</div>
          <div>{v.reviewCount} review</div>
        </div>
      </div>
    </Link>
  );
}

export default function VenueDashboardPage() {
  const [data, setData] = useState<VenueOwnerDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVenueOwnerDashboardOverview()
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-gray-500">Không thể tải dữ liệu dashboard.</div>;
  }

  const top = data.topPerformingVenue;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">

      {/* Venue Stats */}
      <section>
        <SectionTitle>Tổng quan địa điểm</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Tổng địa điểm" value={data.totalVenues} icon={MapPin} color="bg-violet-400" />
          <StatCard label="Đang hoạt động" value={data.activeVenues} icon={CheckCircle} color="bg-emerald-400" />
          <StatCard label="Không hoạt động" value={data.inactiveVenues} icon={MapPin} color="bg-gray-400" />
          <StatCard
            label="Đánh giá trung bình"
            value={data.averageRating.toFixed(1)}
            icon={Star}
            color="bg-amber-400"
            trend={data.ratingTrend}
          />
        </div>
      </section>

      {/* Review & Engagement */}
      <section>
        <SectionTitle>Tương tác & Đánh giá</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Tổng đánh giá"
            value={data.totalReviews}
            sub={`+${data.newReviewsThisMonth} tháng này`}
            icon={Star}
            color="bg-pink-400"
            trend={data.reviewGrowthRate}
          />
          <StatCard
            label="Tổng check-in"
            value={data.totalCheckIns}
            sub={`+${data.newCheckInsThisMonth} tháng này`}
            icon={CheckCircle}
            color="bg-sky-400"
            trend={data.checkInGrowthRate}
          />
          <StatCard label="Yêu thích" value={data.totalFavorites} icon={Heart} color="bg-rose-400" />
          <StatCard label="Khách hàng duy nhất" value={data.uniqueCustomers} sub={`${data.returningCustomers} quay lại`} icon={Users} color="bg-indigo-400" />
        </div>
      </section>

      {/* Voucher */}
      <section>
        <SectionTitle>Voucher</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Tổng voucher" value={data.totalVouchers} icon={Ticket} color="bg-violet-400" />
          <StatCard label="Đang hoạt động" value={data.activeVouchers} icon={Ticket} color="bg-emerald-400" />
          <StatCard
            label="Đã đổi"
            value={data.totalVoucherExchanged}
            sub={`Tỉ lệ: ${(data.voucherExchangeRate * 100).toFixed(1)}%`}
            icon={TrendingUp}
            color="bg-orange-400"
          />
          <StatCard
            label="Đã sử dụng"
            value={data.totalVoucherUsed}
            sub={`Tỉ lệ: ${(data.voucherUsageRate * 100).toFixed(1)}%`}
            icon={BarChart2}
            color="bg-teal-400"
          />
        </div>
      </section>

      {/* Engagement */}
      <section>
        <SectionTitle>Kế hoạch & Bộ sưu tập</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Trong kế hoạch hẹn hò" value={data.totalDatePlanInclusions} icon={Calendar} color="bg-fuchsia-400" />
          <StatCard label="Lưu vào bộ sưu tập" value={data.totalCollectionSaves} icon={BookOpen} color="bg-cyan-400" />
        </div>
      </section>

      {/* Top Venue + Venue List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Performing */}
        {top && (
          <section className="lg:col-span-1">
            <SectionTitle>Địa điểm nổi bật nhất</SectionTitle>
            <Link href={`/venue/location/mylocation/${top.venueId}`}>
              <div className="bg-white rounded-2xl border border-violet-100 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="relative w-full h-40">
                  <Image
                    src={safeImg(top.coverImage)}
                    alt={top.venueName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-semibold text-base leading-tight">{top.venueName}</p>
                    <p className="text-xs opacity-80">{top.area ?? top.category ?? '—'}</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Đánh giá', value: `${top.averageRating.toFixed(1)} ★` },
                    { label: 'Reviews', value: top.reviewCount },
                    { label: 'Check-in', value: top.checkInCount },
                    { label: 'Yêu thích', value: top.favoriteCount },
                    { label: 'Kế hoạch', value: top.datePlanCount },
                    { label: 'Bộ sưu tập', value: top.collectionCount },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="font-semibold text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* All Venues */}
        <section className={top ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <SectionTitle>Tất cả địa điểm</SectionTitle>
          <div className="bg-white rounded-2xl border border-violet-100 shadow-sm divide-y divide-gray-50">
            {data.venues.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">Chưa có địa điểm nào.</p>
            )}
            {data.venues.map(v => (
              <VenueRow key={v.venueId} v={v} />
            ))}
          </div>
        </section>
      </div>

      {/* Weekly Activity */}
      <section>
        <SectionTitle>Hoạt động tuần này</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <Star size={18} className="text-pink-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Review mới tuần này</p>
              <p className="text-2xl font-bold text-gray-900">{data.newReviewsThisWeek}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-sky-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-in mới tuần này</p>
              <p className="text-2xl font-bold text-gray-900">{data.newCheckInsThisWeek}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
