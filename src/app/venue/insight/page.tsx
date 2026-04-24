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
            {entry.name}: {entry.value}
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

  useEffect(() => { fetchInsight(timeframe); }, [timeframe]);

  const inner = data?.data;
  const trend = data?.trendAnalysis;

  return (
    <>
      <SubscriptionExpiredModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        message={subscriptionMessage}
      />

      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        {/* Header + Timeframe */}
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
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 border border-violet-100">
                <div className="flex items-center gap-2 mb-1">
                  <Search size={16} className="text-violet-600" />
                  <span className="text-xs text-gray-500">Tìm kiếm</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {inner.topSearches.reduce((sum, s) => sum + s.count, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 border border-pink-100">
                <div className="flex items-center gap-2 mb-1">
                  <Smile size={16} className="text-pink-600" />
                  <span className="text-xs text-gray-500">Tâm trạng</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {inner.hotMoods.reduce((sum, m) => sum + m.count, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-xs text-gray-500">Check-in</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {inner.favoritesAndInteractions.totalCheckIns}
                </p>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-4 border border-sky-100">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart2 size={16} className="text-sky-600" />
                  <span className="text-xs text-gray-500">Danh mục</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {inner.favoritesAndInteractions.topVenueCategories.length}
                </p>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-800">AI Phân tích</h3>
                <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                  AI
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 flex items-center gap-1">
                    <Lightbulb size={12} className="text-violet-600" />
                    Đề xuất chiến lược
                  </p>
                  <ul className="space-y-0.5 text-gray-600">
                    {trend?.businessStrategy.recommendations.slice(0, 2).map((r: string, i: number) => (
                      <li key={i} className="flex gap-1.5 leading-snug">
                        <span className="text-violet-500 shrink-0">•</span>
                        <span className="line-clamp-2">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-600" />
                    Cơ hội phát triển
                  </p>
                  <ul className="space-y-0.5 text-gray-600">
                    {trend?.businessStrategy.opportunities.slice(0, 2).map((o: string, i: number) => (
                      <li key={i} className="flex gap-1.5 leading-snug">
                        <span className="text-emerald-500 shrink-0">•</span>
                        <span className="line-clamp-2">{o}</span>
                      </li>
                    ))}
                  </ul>
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
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Hot Moods */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <SectionTitle icon={Smile}>Tâm trạng nổi bật</SectionTitle>
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
                      <PieChart>
                        <Pie
                          data={inner.hotMoods}
                          dataKey="count"
                          nameKey="moodName"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {inner.hotMoods.map((entry: HotMood, index: number) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {inner.hotMoods.map((mood: HotMood, i: number) => (
                    <div key={mood.moodTypeId} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-xs text-gray-600">{mood.moodName}</span>
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
                        <Bar dataKey="checkInCount" fill="#10b981" radius={[4, 4, 0, 0]} />
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
                  <SectionTitle icon={TrendingUp}>Xu hướng tâm trạng</SectionTitle>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={inner.moodTrendsByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="monthName" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        {inner.moodTrendsByMonth[0]?.moods.slice(0, 4).map((mood: { moodName: string }, idx: number) => (
                          <Line
                            key={mood.moodName}
                            type="monotone"
                            dataKey={(data: MoodTrend) => data.moods.find(m => m.moodName === mood.moodName)?.count || 0}
                            name={mood.moodName}
                            stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        ))}
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
      </div>
    </>
  );
}