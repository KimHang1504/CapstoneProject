'use client';

import { useState, useMemo } from 'react';
import { MOCK_LOCATION } from '@/config/mock/location';
import { ChevronRight, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
      <div className="flex-2 space-y-4">


        {/* thẻ location */}
        {locations.map(loc => (
          <div
            key={loc.id}
            className="relative flex gap-4 bg-white rounded-2xl p-4 border border-violet-100
             hover:shadow-md hover:border-violet-200 transition cursor-pointer"
          >
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <Image
                src={loc.image}
                alt={loc.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 pr-10">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {loc.name}
                </h3>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium
            ${loc.status === "active" && "bg-green-100 text-green-700"}
            ${loc.status === "inactive" && "bg-red-100 text-red-700"}
            ${loc.status === "pending" && "bg-yellow-100 text-yellow-700"}
          `}
                >
                  {loc.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-0.5">
                {loc.address}
              </p>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {loc.description}
              </p>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={14} />
                Thứ {loc.workingDays.from}–{loc.workingDays.to}
                <span className="mx-1 text-gray-300">•</span>
                {loc.workingHours.open} – {loc.workingHours.close}
              </span>



              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium capitalize">
                  {loc.mood}
                </span>

              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600
               group-hover:bg-violet-200">
                <ChevronRight size={18} color="#7C5CFC" />
              </div>
            </div>
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
                ? 'bg-[#d2c7ff]'
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
        <Link href="/venue/location/mylocation/create">
          <div className="relative w-full rounded-full p-0.5 bg-linear-to-r from-[#A78BFA] via-[#7DD3FC] to-[#F472B6]
           shadow-[0_6px_16px_rgba(167,139,250,0.45)]">
            <button className="relative cursor-pointer w-full h-18 flex items-center rounded-full bg-white pl-24 pr-6 transition-all">
              <div className="absolute -left-1 w-23 h-23 rounded-full bg-linear-to-r from-[#A78BFA] via-[#7DD3FC] to-[#F472B6] flex items-center justify-center
               text-white text-3xl shadow-lg">
                <div className="rounded-full bg-white w-15 h-15">
                  <div className="flex items-center justify-center w-full h-full text-[#A78BFA]">
                  +
                  </div>
                </div>
              </div>
              <span className="text-[#6B4EFF] font-medium text-lg">
                Thêm địa điểm ngay
              </span>
            </button>
          </div>
        </Link>

      </div>
    </div>
  );
}
