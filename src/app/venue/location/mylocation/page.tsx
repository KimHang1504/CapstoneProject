'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { getMyVenueLocations } from '@/api/venue/location/api';
import { VenueLocationListItem } from '@/api/venue/location/type';
// import { VENUE_STATUS_CONFIG } from '@/api/venue/location/status';

type StatusFilter = 'all' | 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFTED';

export default function MyLocationPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<VenueLocationListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyVenueLocations()
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    return {
      all: data.length,
      ACTIVE: data.filter(l => l.status === 'ACTIVE').length,
      INACTIVE: data.filter(l => l.status === 'INACTIVE').length,
      PENDING: data.filter(l => l.status === 'PENDING').length,
      DRAFTED: data.filter(l => l.status === 'DRAFTED').length,
    };
  }, [data]);

  const locations = useMemo(() => {
    return data.filter(l => {
      const matchStatus =
        statusFilter === 'all' || l.status === statusFilter;

      const matchKeyword =
        l.name.toLowerCase().includes(keyword.toLowerCase()) ||
        l.address.toLowerCase().includes(keyword.toLowerCase());

      return matchStatus && matchKeyword;
    });
  }, [data, statusFilter, keyword]);

  if (loading) {
    return <div className="p-8 text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="flex gap-10 justify-between p-8">
      <div className="flex-2 space-y-4">
        {locations.map(loc => {
          // const statusConfig = VENUE_STATUS_CONFIG[loc.status];

          return (
            <div
              key={loc.id}
              className="relative flex gap-4 bg-white rounded-2xl p-4 border border-violet-100
              hover:shadow-md hover:border-violet-200 transition"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <Image
                  src={loc.coverImage?.[0] ?? 'https://i.pinimg.com/736x/36/21/a9/3621a941262c3977faff6f9a47943eee.jpg'}
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

                  {/* <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span> */}
                </div>

                <p className="text-sm text-gray-500 mt-1">{loc.address}</p>
              </div>

              <Link
                href={`/venue/location/mylocation/${loc.id}`}
                className="absolute bottom-4 right-4"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200">
                  <ChevronRight size={18} />
                </div>
              </Link>
            </div>
          );
        })}

        {locations.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            Không có địa điểm phù hợp
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2 mb-8">
        <div className="flex items-center gap-3 bg-white border border-[#8093F1] rounded-3xl px-4 py-3 mb-4">
          <Search className="text-[#8093F1] w-5 h-5" />
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        {[
          { key: 'all', label: 'Tất cả', value: stats.all },
          { key: 'DRAFTED', label: 'Bản nháp', value: stats.DRAFTED },
          { key: 'ACTIVE', label: 'Đang mở', value: stats.ACTIVE },
          { key: 'INACTIVE', label: 'Đang đóng', value: stats.INACTIVE },
          { key: 'PENDING', label: 'Chờ duyệt', value: stats.PENDING },
        ].map(item => (
          <div
            key={item.key}
            onClick={() => setStatusFilter(item.key as StatusFilter)}
            className={`cursor-pointer rounded-[20px] p-3 transition
              ${statusFilter === item.key
                ? 'bg-[#d2c7ff]'
                : 'bg-[#F8EAFB] hover:bg-[#F3ECFF]'
              }`}
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold text-[#5B3DF5]">
              {item.value.toString().padStart(2, '0')}
            </p>
          </div>
        ))}
        <Link href="/venue/location/mylocation/create">
          <div className="mt-5 relative w-full rounded-full p-0.5 bg-linear-to-r from-[#A78BFA] via-[#7DD3FC] to-[#F472B6]
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
