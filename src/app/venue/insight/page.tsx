'use client';

import { getInsights } from '@/api/venue/insight/api';
import { InsightData, Timeframe, TopSearch, HotMood, MoodTrend, TopVenueCategory, TopCheckInVenue } from '@/api/venue/insight/type';
import { useEffect, useState } from 'react';
import {
  Search, Smile, TrendingUp, MapPin, CheckCircle,
  Lightbulb, BarChart2, Users, Eye, Heart, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import SubscriptionExpiredModal from '@/components/SubscriptionExpiredModal';
import InsightSkeleton from "@/components/skeleton/InsightSkeleton";
import VenueInsightExpiryBadge from '@/components/VenueInsightExpiryBanner';
import { getVenueOwnerSubscriptionInfo } from '@/api/venue/dashboard/api';
import Image from 'next/image';

const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm nay' },
];

const MOOD_COLORS = [
  'bg-violet-400', 'bg-pink-400', 'bg-sky-400',
  'bg-emerald-400', 'bg-amber-400', 'bg-rose-400',
];

const BAR_COLORS = [
  'bg-violet-500', 'bg-pink-500', 'bg-sky-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

const CHART_COLORS = [
  '#8b5cf6', '#ec4899', '#0ea5e9',
  '#10b981', '#f59e0b', '#f43f5e',
  '#6366f1', '#8b5cf6', '#d946ef',
  '#06b6d4', '#14b8a6', '#84cc16',
  '#eab308', '#f97316', '#ef4444',
];

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
        <Icon size={16} className="text-violet-600" />
      </div>
      <h2 className="font-semibold text-gray-800">{children}</h2>
    </div>
  );
}

function ProgressBar({ label, value, count, color = 'bg-violet-500' }: {
  label: string; value: number; count?: number; color?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 truncate max-w-[60%]">{label}</span>
        <span className="text-gray-500 shrink-0">{count !== undefined ? `${count} · ` : ''}{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.value} {entry.name}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InsightPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('all');
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Kiểm tra quyền truy cập khi load trang
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await getVenueOwnerSubscriptionInfo();
        if (res.code === 200 && res.data) {
          const { venueInsightAccess } = res.data;

          // Nếu không có quyền truy cập hoặc hết hạn (0 ngày)
          if (!venueInsightAccess?.hasAccess || (venueInsightAccess.daysRemaining !== null && venueInsightAccess.daysRemaining <= 0)) {
            setSubscriptionMessage('Gói chiến lược tăng trưởng của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng.');
            setShowSubscriptionModal(true);
          }
        }
      } catch (error) {
        console.error('Check access error:', error);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, []);

  const fetchInsight = async (tf: Timeframe) => {
    try {
      setLoading(true);
      const res = await getInsights(tf);

      // Kiểm tra code 402 - gói không hỗ trợ
      if (res.code === 402) {
        setSubscriptionMessage(res.message);
        setShowSubscriptionModal(true);
        return;
      }

      if (res.code === 200) {
        setData(res.data);
      }
    } catch (error: any) {
      console.error('Fetch insight error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCheckingAccess && !showSubscriptionModal) {
      fetchInsight(timeframe);
    }
  }, [timeframe, isCheckingAccess, showSubscriptionModal]);

  const inner = data?.data;
  const trend = data?.trendAnalysis;

  const handleModalClose = () => {
    // Nếu không có quyền truy cập, không cho đóng modal và chuyển về trang dashboard
    if (showSubscriptionModal && subscriptionMessage.includes('hết hạn')) {
      window.location.href = '/venue/dashboard';
    } else {
      setShowSubscriptionModal(false);
    }
  };

  const formatMonth = (month: number) => {
    return `Tháng ${month}`;
  };

  return (
    <>
      <SubscriptionExpiredModal
        isOpen={showSubscriptionModal}
        onClose={handleModalClose}
        message={subscriptionMessage}
      />

      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        {/* Subscription Expiry Bannenr */}
        {!isCheckingAccess && !showSubscriptionModal && <VenueInsightExpiryBadge />}

        {/* Loading state while checking access */}
        {isCheckingAccess && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
            <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
          </div>
        )}

        {/* Header + Timeframe */}
        {!isCheckingAccess && !showSubscriptionModal && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Insight</h1>
                {inner && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Cập nhật lúc {new Date(inner.generatedAt).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {TIMEFRAME_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeframe(opt.value)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition
                ${timeframe === opt.value
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <InsightSkeleton />
            ) : inner && trend ? (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 border border-violet-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Search size={16} className="text-violet-600" />
                      <span className="text-xs text-gray-500">Lượt tìm kiếm</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inner.topSearches.reduce((sum, s) => sum + s.count, 0)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={16} className="text-emerald-600" />
                      <span className="text-xs text-gray-500">Top Check-in</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inner.favoritesAndInteractions.totalCheckIns}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-4 border border-sky-100">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart2 size={16} className="text-sky-600" />
                      <span className="text-xs text-gray-500">Danh mục yêu thích</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inner.favoritesAndInteractions.topVenueCategories.length}
                    </p>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 shadow-lg">

                  {/* glow effect */}
                  <div className="absolute inset-0 opacity-30 blur-xl bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400" />

                  <div className="relative bg-white/95 backdrop-blur rounded-2xl p-5">

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md">
                        <Sparkles size={18} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-violet-500 font-semibold">
                          TÓM TẮT BẰNG AI
                        </p>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                          Tổng quan & đề xuất chiến lược
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Phân tích quan trọng giúp tối ưu hiệu quả kinh doanh
                        </p>
                      </div>

                      <Image
                        src="/AI.jpg"
                        alt="AI"
                        width={50}
                        height={50}
                        className="rounded-xl"
                      />

                    </div>

                    {/* Content */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">

                      {/* Strategy */}
                      <div className="bg-violet-50 rounded-xl p-3 border border-violet-200">
                        <p className="font-semibold text-violet-700 flex items-center gap-2 mb-2">
                          <Lightbulb size={14} />
                          Chiến lược đề xuất
                        </p>

                        <ul className="space-y-2 text-gray-800 text-xs">
                          {trend?.businessStrategy.recommendations.slice(0, 2).map((r: string, i: number) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-1 w-2 h-2 bg-violet-500 rounded-full shrink-0" />
                              <span className="line-clamp-2">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Opportunities */}
                      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                        <p className="font-semibold text-emerald-700 flex items-center gap-2 mb-2">
                          <MapPin size={14} />
                          Cơ hội phát triển
                        </p>

                        <ul className="space-y-2 text-gray-800 text-xs">
                          {trend?.businessStrategy.opportunities.slice(0, 2).map((o: string, i: number) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-1 w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                              <span className="line-clamp-2">{o}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Phân tích tự động từ dữ liệu hệ thống</span>
                      <span className="text-violet-600 font-semibold">AI Insight</span>
                    </div>

                  </div>
                </div>

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                  {/* Top Searches */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <SectionTitle icon={Search}>Từ khóa tìm kiếm</SectionTitle>
                    <div className="h-56">
                      {inner.topSearches.length === 0 ? (
                        <div className="h-56 flex items-center justify-center text-sm text-gray-500 text-center px-4">
                          {trend.searchTrends.summary}
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={inner.topSearches.slice(0, 5)} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <XAxis type="number" tick={{ fontSize: 11 }} />
                            <YAxis dataKey="keyword" type="category" width={80} tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip  />} />
                            <Bar dataKey="count" name="lượt" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Hot Moods */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <SectionTitle icon={Smile}>Tâm trạng cá nhân nổi bật hiện tại</SectionTitle>
                    <div className="h-56">
                      {inner.hotMoods.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                          <Smile size={28} className="text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">
                            Không có dữ liệu tâm trạng
                          </p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={inner.hotMoods}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="moodName" tick={false} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="thành viên" radius={[4, 4, 0, 0]}>
                              {inner.hotMoods.map((entry: HotMood, index: number) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2 max-h-20 overflow-y-auto">
                      {inner.hotMoods.map((mood: HotMood, i: number) => (
                        <div key={mood.moodTypeId} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span className="text-xs text-gray-600">{mood.moodName} ({mood.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Check-in */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <SectionTitle icon={CheckCircle}>Top Check-in</SectionTitle>
                    <div className="h-56">
                      {inner.favoritesAndInteractions.topVenueCategories.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-sm text-gray-500 text-center px-4">
                          {trend.venuePreferences.userBehavior}
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={inner.favoritesAndInteractions.topCheckInVenues.slice(0, 5)}>
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="checkInCount" name="lượt check-in" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mood Trends + Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

{/* Mood Trends - Line Chart */}
{inner.moodTrendsByMonth.length > 0 && (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <SectionTitle icon={TrendingUp}>Xu hướng tâm trạng cặp đôi</SectionTitle>

    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={inner.moodTrendsByMonth.map(item => ({
            ...item,
            monthLabel: `Tháng ${item.month}`, // 👈 format tại đây
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          {/* 👇 dùng monthLabel thay vì monthName */}
          <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />

          <YAxis tick={{ fontSize: 11 }} />

          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />

          {inner.moodTrendsByMonth[0]?.moods.slice(0, 4).map(
            (mood: { moodName: string }, idx: number) => (
              <Line
                key={mood.moodName}
                type="monotone"
                dataKey={(data: MoodTrend) =>
                  data.moods.find(m => m.moodName === mood.moodName)?.count || 0
                }
                name={mood.moodName}
                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)}

                  {/* Top Categories */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <SectionTitle icon={BarChart2}>Danh mục yêu thích</SectionTitle>
                    <div className="h-64">
                      {inner.favoritesAndInteractions.topVenueCategories.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                          <BarChart2 size={28} className="text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">
                            Chưa có dữ liệu danh mục
                          </p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={inner.favoritesAndInteractions.topVenueCategories.slice(0, 6)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="totalInteractions" name="Tương tác" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="uniqueUsers" name="Người dùng" fill="#ec4899" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}