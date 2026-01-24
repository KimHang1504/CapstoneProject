'use client';

import { useState, useMemo } from 'react';
import { MOCK_LOCATION } from '@/config/mock/location';

type Status = 'all' | 'active' | 'inactive' | 'pending';

export default function MyLocationPage() {
  const [statusFilter, setStatusFilter] = useState<Status>('all');

  const stats = useMemo(() => {
    return {
      all: MOCK_LOCATION.length,
      active: MOCK_LOCATION.filter(l => l.status === 'active').length,
      inactive: MOCK_LOCATION.filter(l => l.status === 'inactive').length,
      pending: MOCK_LOCATION.filter(l => l.status === 'pending').length,
    };
  }, []);

  const locations = useMemo(() => {
    if (statusFilter === 'all') return MOCK_LOCATION;
    return MOCK_LOCATION.filter(l => l.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-[#FBF6FF] p-8">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tất cả', value: stats.all, key: 'all' },
          { label: 'Đang mở', value: stats.active, key: 'active' },
          { label: 'Đang đóng', value: stats.inactive, key: 'inactive' },
          { label: 'Chờ duyệt', value: stats.pending, key: 'pending' },
        ].map(item => (
          <div
            key={item.key}
            onClick={() => setStatusFilter(item.key as Status)}
            className={`cursor-pointer rounded-xl p-5 border transition
              ${statusFilter === item.key
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white hover:border-purple-400'}
            `}
          >
            <p className="text-sm">{item.label}</p>
            <p className="text-2xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map(loc => (
          <div
            key={loc.id}
            className="bg-white rounded-xl border p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{loc.name}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full
                  ${loc.status === 'active' && 'bg-green-100 text-green-700'}
                  ${loc.status === 'inactive' && 'bg-red-100 text-red-700'}
                  ${loc.status === 'pending' && 'bg-yellow-100 text-yellow-700'}
                `}
              >
                {loc.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">{loc.address}</p>
            <p className="text-sm text-gray-500 mt-1">{loc.description}</p>

            <p className="text-xs text-gray-400 mt-3">
              Mood: {loc.mood}
            </p>
          </div>
        ))}
      </div>

      {locations.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          Không có địa điểm
        </div>
      )}
    </div>
  );
}
