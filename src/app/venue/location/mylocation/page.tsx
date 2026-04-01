'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronRight, MapPin, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { getMyVenueLocations } from '@/api/venue/location/api';
import { MyVenueLocation } from '@/api/venue/location/type';
// import { VENUE_STATUS_CONFIG } from '@/api/venue/location/status';

type StatusFilter = 'all' | 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFTED';

export default function MyLocationPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<MyVenueLocation[]>([]); const [loading, setLoading] = useState(true);
  const statusMap = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-red-100 text-red-700",
    DRAFTED: "bg-gray-100 text-gray-600",
    PENDING: "bg-yellow-100 text-yellow-700",
  };
  function getSubscriptionInfo(loc: MyVenueLocation) {
    const { durationDays, startDate, endDate, status } = loc as any;

    // ❌ Chưa mua gói
    if (!durationDays || !startDate || !endDate) {
      return {
        type: "NOT_PURCHASED",
        label: "Chưa mua gói",
        subLabel: "",
        className: "bg-gray-100 text-gray-600",
        cta: "Mua gói",
      };
    }

    // 🔴 INACTIVE => luôn là hết hạn (KHÔNG cần check date)
    if (status === "INACTIVE") {
      return {
        type: "EXPIRED",
        label: "Gói đã hết hạn",
        subLabel: `Hết hạn ngày ${new Date(endDate).toLocaleDateString("vi-VN")}`,
        className: "bg-red-100 text-red-700",
        cta: "Gia hạn ngay",
      };
    }

    // ✅ ACTIVE / PENDING / DRAFTED nhưng đã có gói
    return {
      type: "ACTIVE",
      label: `Gói ${durationDays} ngày từ ${new Date(startDate).toLocaleDateString("vi-VN")} - ${new Date(endDate).toLocaleDateString("vi-VN")}`,
      subLabel: "",
      className: "bg-blue-50 text-blue-600",
      cta: "Xem chi tiết",
    };
  }


  useEffect(() => {
    getMyVenueLocations()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  console.log("My locations", data);
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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Địa điểm của tôi
      </h1>
      <div className="flex gap-10 p-8 items-start">

        <div className="flex-1 min-w-0 space-y-4">
          {/* Thông báo kết quả hoặc trống */}
          {keyword && (
            locations.length > 0 ? (
              <p className="mb-4 text-sm text-gray-500">
                Tìm thấy {locations.length} địa điểm {keyword ? `cho "${keyword}"` : ''}
              </p>
            ) : (
              <div className="text-center text-gray-500 py-10">
                Không tìm thấy địa điểm nào {keyword ? `phù hợp với "${keyword}"` : ''}
              </div>
            )
          )}

          {locations.map((loc) => {
            const sub = getSubscriptionInfo(loc);
            return (
              <div
                key={loc.id}
                className="group relative flex gap-4 bg-white rounded-2xl p-4 border border-violet-100
            hover:shadow-lg hover:-translate-y-0.5 hover:border-violet-300 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src={
                      loc.coverImage?.[0] && loc.coverImage[0] !== 'string' && loc.coverImage[0].startsWith('http')
                        ? loc.coverImage[0]
                        : "https://i.pinimg.com/736x/36/21/a9/3621a941262c3977faff6f9a47943eee.jpg"
                    }
                    alt={loc.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pr-10">
                  {/* Title + Status */}
                  <div className="flex items-center gap-2">
                    <Link href={`/venue/location/mylocation/${loc.id}`}>
                      <h3 className="font-semibold text-lg text-gray-900 hover:underline">
                        {loc.name}
                      </h3>
                    </Link>

                    {/* Status */}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-medium uppercase tracking-wide ${statusMap[loc.status]}`}
                    >
                      <span className="relative flex h-2 w-2">
                        {loc.status === "ACTIVE" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                        )}
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                      </span>

                      {loc.status === "ACTIVE" && "Đang mở"}
                      {loc.status === "INACTIVE" && "Hết hạn"}
                      {loc.status === "PENDING" && "Chờ duyệt"}
                      {loc.status === "DRAFTED" && "Bản nháp"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {loc.description}
                  </p>

                  <div className="mt-1 space-y-1 text-sm text-gray-500">
                    <div className="flex items-start gap-1">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span className="line-clamp-2">
                        {loc.address}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <CalendarDays size={13} />
                      {new Date(loc.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                  {/* Subscription */}
                  <div className="mt-2">
                    {sub.type === "EXPIRED" ? (
                      <div className="px-3 py-2">
                        <div className="text-sm font-semibold text-red-600">
                          {sub.label}
                        </div>
                        <div className="text-xs text-red-500">
                          {sub.subLabel}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${sub.className}`}
                      >
                        {sub.label}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <Link
                  href={`/venue/location/mylocation/${loc.id}`}
                  className="absolute bottom-4 right-4"
                >
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-100 text-violet-600 
                group-hover:bg-violet-600 group-hover:text-white transition"
                  >
                    <ChevronRight size={18} />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="w-[320px] space-y-2 sticky top-8 self-start">
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
            { key: 'INACTIVE', label: 'Hết hạn', value: stats.INACTIVE },
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
                    <div className="flex items-center justify-center w-full h-full">
                      <Plus size={28} className="text-[#A78BFA]" strokeWidth={2.5} />
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
    </div>

  );
}
