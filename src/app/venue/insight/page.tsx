'use client';

import { getInsights } from '@/api/venue/insight/api';
import { InsightData, Timeframe } from '@/api/venue/insight/type';
import { useEffect, useState } from 'react';

export default function InsightPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('all');
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async (tf: Timeframe) => {
    try {
      setLoading(true);
      const res = await getInsights(tf);

      if (res.code === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Fetch insight error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight(timeframe);
  }, [timeframe]);

  return (
    <div className="p-6 space-y-6">

      {/* TIMEFRAME SELECT */}
      <select
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value as Timeframe)}
        className="border p-2 rounded"
      >
        <option value="all">All time</option>
        <option value="today">Today</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>

      {loading && <p>Loading...</p>}

      {data && (
        <>
          {/* TOP SEARCH */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-4">Top Search 🔥</h2>

            {data.topSearches.map((item) => (
              <div key={item.keyword} className="mb-3">
                <div className="flex justify-between">
                  <span>{item.keyword}</span>
                  <span>{item.percentage}%</span>
                </div>

                <div className="bg-gray-200 h-2 rounded">
                  <div
                    className="bg-red-400 h-2 rounded"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* HOT MOOD */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-4">Hot Mood</h2>

            {data.hotMoods.map((item) => (
              <div key={item.moodTypeId} className="mb-3">
                <div className="flex justify-between">
                  <span>{item.moodName}</span>
                  <span>{item.percentage}%</span>
                </div>

                <div className="bg-gray-200 h-2 rounded">
                  <div
                    className="bg-green-400 h-2 rounded"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}