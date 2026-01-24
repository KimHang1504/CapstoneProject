'use client';

import { useState, useMemo } from 'react';
import { MOCK_LOCATION } from '@/config/mock/location';
import { Search } from 'lucide-react';

type Status = 'all' | 'active' | 'inactive' | 'pending';

export default function MyLocationPage() {
  const [statusFilter, setStatusFilter] = useState<Status>('all');
  const [keyword, setKeyword] = useState('');

  const stats = useMemo(() => {
    return {
      all: MOCK_LOCATION.length,
      active: MOCK_LOCATION.filter(l => l.status === 'active').length,
      inactive: MOCK_LOCATION.filter(l => l.status === 'inactive').length,
      pending: MOCK_LOCATION.filter(l => l.status === 'pending').length,
    };
  }, []);

  const locations = useMemo(() => {
    return MOCK_LOCATION.filter(l => {
      const matchStatus =
        statusFilter === 'all' || l.status === statusFilter;

      const matchKeyword =
        l.name.toLowerCase().includes(keyword.toLowerCase()) ||
        l.address.toLowerCase().includes(keyword.toLowerCase());

      return matchStatus && matchKeyword;
    });
  }, [statusFilter, keyword]);

  return (
    <div className="flex gap-10 justify-between p-8">
      {/* ================= LEFT ================= */}
      <div className="flex-2 space-y-4">


        {/* LOCATION LIST */}
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

        {locations.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            Không có địa điểm phù hợp
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4 mb-8">
        <div className="flex items-center gap-3 bg-white border border-[#8093F1] rounded-3xl px-4 py-3 mb-4">
          <Search className="text-[#8093F1] w-5 h-5" />

          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {[
          { label: 'Tất cả', value: stats.all, key: 'all' },
          { label: 'Đang mở', value: stats.active, key: 'active' },
          { label: 'Đang đóng', value: stats.inactive, key: 'inactive' },
          { label: 'Chờ duyệt', value: stats.pending, key: 'pending' },
        ].map(item => (
          <div
            key={item.key}
            onClick={() => setStatusFilter(item.key as Status)}
            className={`relative cursor-pointer rounded-[20px] p-5 transition
    ${statusFilter === item.key
                ? 'bg-[#d2c7ff] shadow-[0_10px_20px_rgba(0,0,0,0.25)] -translate-y-0.5'
                : 'bg-[#F8EAFB] hover:bg-[#F3ECFF]'
              }
  `}
          >
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-14 w-1.5 rounded-full
      ${statusFilter === item.key
                  ? 'bg-[#7C5CFC]'
                  : 'bg-[#C9B8FF]'
                }
    `}
            />

            <p className="text-sm text-gray-500 ml-5">{item.label}</p>
            <p className="text-2xl font-bold text-[#5B3DF5] mt-1 ml-5">
              {item.value.toString().padStart(2, '0')}
            </p>
          </div>
        ))}
        <button
          className="
    w-full flex items-center gap-4
    rounded-[28px]
    bg-[#EFE7FF]
    px-5 py-4
]
    transition-all
  "
        >
          {/* ICON */}
          <div className="
    w-14 h-14 rounded-full
    bg-[#A78BFA]
    flex items-center justify-center
    text-white text-3xl
  ">
            +
          </div>

          {/* TEXT */}
          <span className="text-[#6B4EFF] font-medium">
            Thêm địa điểm ngay
          </span>
        </button>

      </div>
    </div>
  );
}
