'use client';

import { getInsights } from '@/api/venue/insight/api';
import { InsightData, Timeframe } from '@/api/venue/insight/type';
import { useEffect, useState } from 'react';
import {
  Search, Smile, TrendingUp, MapPin, CheckCircle,
  Lightbulb, BarChart2, Users
} from 'lucide-react';

const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: 'all',   label: 'Tất cả' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'week',  label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year',  label: 'Năm nay' },
];

const MOOD_COLORS = [
  'bg-violet-400', 'bg-pink-400', 'bg-sky-400',
  'bg-emerald-400', 'bg-amber-400', 'bg-rose-400',
];

const BAR_COLORS = [
  'bg-violet-500', 'bg-pink-500', 'bg-sky-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
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

export default function InsightPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('all');
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async (tf: Timeframe) => {
    try {
      setLoading(true);
      const res = await getInsights(tf);
      if (res.code === 200) setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsight(timeframe); }, [timeframe]);

  const inner = data?.data;
  const trend = data?.trendAnalysis;

  return (
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

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl" />)}
        </div>
      )}

      {!loading && inner && trend && (
        <>
          {/* Row 1: Top Searches + Hot Moods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Top Searches */}
            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm">
              <SectionTitle icon={Search}>Từ khóa tìm kiếm</SectionTitle>
              <div className="space-y-3">
                {inner.topSearches.map((item, i) => (
                  <ProgressBar
                    key={item.keyword}
                    label={item.keyword}
                    value={item.percentage}
                    count={item.count}
                    color={BAR_COLORS[i % BAR_COLORS.length]}
                  />
                ))}
              </div>
              {trend.searchTrends.summary && (
                <p className="text-xs text-gray-400 mt-4 italic border-t pt-3">
                  {trend.searchTrends.summary}
                </p>
              )}
            </div>

            {/* Hot Moods */}
            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm">
              <SectionTitle icon={Smile}>Tâm trạng nổi bật</SectionTitle>
              <div className="space-y-3">
                {inner.hotMoods.map((item, i) => (
                  <ProgressBar
                    key={item.moodTypeId}
                    label={item.moodName}
                    value={item.percentage}
                    count={item.count}
                    color={BAR_COLORS[i % BAR_COLORS.length]}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Mood Trends by Month */}
          {inner.moodTrendsByMonth.length > 0 && (
            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm">
              <SectionTitle icon={TrendingUp}>Xu hướng tâm trạng theo tháng</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inner.moodTrendsByMonth.map(month => (
                  <div key={month.month}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">{month.monthName} {month.month.split('-')[0]}</span>
                      <span className="text-xs text-gray-400">{month.totalCount} lượt</span>
                    </div>
                    <div className="space-y-2">
                      {month.moods.map((m, i) => {
                        const pct = Math.round((m.count / month.totalCount) * 100);
                        return (
                          <div key={m.moodName} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${MOOD_COLORS[i % MOOD_COLORS.length]}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-gray-600 truncate">{m.moodName}</span>
                                <span className="text-gray-400 shrink-0 ml-1">{m.count}</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${MOOD_COLORS[i % MOOD_COLORS.length]}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {trend.moodAnalysis.monthlyTrend.find(t => t.month === month.monthName) && (
                      <p className="text-xs text-gray-400 italic mt-2">
                        {trend.moodAnalysis.monthlyTrend.find(t => t.month === month.monthName)?.insight}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row 3: Top Categories + Check-in */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Top Categories */}
            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm">
              <SectionTitle icon={BarChart2}>Danh mục yêu thích</SectionTitle>
              <div className="space-y-3">
                {inner.favoritesAndInteractions.topVenueCategories.map((cat, i) => {
                  const max = inner.favoritesAndInteractions.topVenueCategories[0]?.totalInteractions || 1;
                  const pct = Math.round((cat.totalInteractions / max) * 100);
                  const view = cat.interactionBreakdown.find(b => b.type === 'VIEW')?.count ?? 0;
                  const save = cat.interactionBreakdown.find(b => b.type === 'SAVE')?.count ?? 0;
                  return (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">{cat.category}</span>
                        <span className="text-gray-400 text-xs">{cat.totalInteractions} tương tác</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex gap-3 text-xs text-gray-400">
                        <span>{view} lượt xem</span>
                        <span>{save} lượt lưu</span>
                        <span className="flex items-center gap-1"><Users size={10} />{cat.uniqueUsers} người</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 italic mt-4 border-t pt-3">
                {trend.venuePreferences.userBehavior}
              </p>
            </div>

            {/* Top Check-in Venues */}
            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm">
              <SectionTitle icon={CheckCircle}>Địa điểm check-in nhiều nhất</SectionTitle>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl font-bold text-violet-600">
                  {inner.favoritesAndInteractions.totalCheckIns}
                </span>
                <span className="text-sm text-gray-400">tổng check-in</span>
              </div>
              <div className="space-y-3">
                {inner.favoritesAndInteractions.topCheckInVenues.map((venue, i) => (
                  <div key={venue.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 ${MOOD_COLORS[i % MOOD_COLORS.length]}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{venue.name}</p>
                      <p className="text-xs text-gray-400">{venue.category ?? 'Chưa phân loại'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-gray-900">{venue.checkInCount}</p>
                      <p className="text-xs text-gray-400">check-in</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Business Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm">
              <SectionTitle icon={Lightbulb}>Đề xuất chiến lược</SectionTitle>
              <ul className="space-y-2">
                {trend.businessStrategy.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm">
              <SectionTitle icon={MapPin}>Cơ hội phát triển</SectionTitle>
              <ul className="space-y-2">
                {trend.businessStrategy.opportunities.map((o, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
