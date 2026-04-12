'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { CalendarDays, ChevronRight, MapPin, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';

import { getMyVenueLocations } from '@/api/venue/location/api';
import { MyVenueLocation } from '@/api/venue/location/type';

type StatusFilter = 'all' | 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'EXPIRED' | 'PENDING' | 'DRAFTED';
type DisplayStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING'
  | 'DRAFTED'
  | 'REJECTED'
  | 'CLOSED'
  | 'EXPIRED';



export default function MyLocationPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [data, setData] = useState<MyVenueLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const statusMap: Record<DisplayStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-red-100 text-red-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    DRAFTED: "bg-gray-100 text-gray-600",
    REJECTED: "bg-red-100 text-red-700",
    CLOSED: "bg-red-100 text-red-700",
    EXPIRED: "bg-red-100 text-red-700",
  };



  function getSubscriptionInfo(loc: MyVenueLocation) {
    const { durationDays, startDate, endDate, status, rejectionDetails } = loc;

    // 👉 NEW: REJECTED (draft nhưng bị từ chối)
    if (status === "DRAFTED" && rejectionDetails && rejectionDetails.length > 0) {
      const rejection = rejectionDetails[0];
      return {
        type: "REJECTED",
        label: "Bị từ chối",
        subLabel: `Lý do: ${rejection.reason}`,
        className: "bg-red-100 text-red-700",
        cta: "Xem chi tiết",
      };
    }

    if (!durationDays || !startDate || !endDate) {
      return {
        type: "NOT_PURCHASED",
        label: "Chưa mua gói",
        subLabel: "",
        className: "bg-gray-100 text-gray-600",
        cta: "Mua gói",
      };
    }

    if (status === "INACTIVE") {
      if (rejectionDetails && rejectionDetails.length > 0) {
        const rejection = rejectionDetails[0];
        return {
          type: "CLOSED",
          label: "Địa điểm đã đóng cửa",
          subLabel: `Lý do: ${rejection.reason}`,
          className: "bg-red-100 text-red-700",
          cta: "Xem chi tiết",
        };
      }
      return {
        type: "EXPIRED",
        label: "Gói đã hết hạn",
        subLabel: `Hết hạn ngày ${new Date(endDate).toLocaleDateString("vi-VN")}`,
        className: "bg-red-100 text-red-700",
        cta: "Gia hạn ngay",
      };
    }

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
    const inactiveLocations = data.filter(l => l.status === 'INACTIVE');
    const closedCount = inactiveLocations.filter(l => {
      const loc = l;
      return loc.rejectionDetails && loc.rejectionDetails.length > 0;
    }).length;
    const expiredCount = inactiveLocations.length - closedCount;

    return {
      all: data.length,
      ACTIVE: data.filter(l => l.status === 'ACTIVE').length,
      CLOSED: closedCount,
      EXPIRED: expiredCount,
      PENDING: data.filter(l => l.status === 'PENDING').length,
      DRAFTED: data.filter(l => l.status === 'DRAFTED').length,
    };
  }, [data]);

  const locations = useMemo(() => {
    return data.filter(l => {
      let matchStatus = false;

      if (statusFilter === 'all') {
        matchStatus = true;
      } else if (statusFilter === 'CLOSED') {
        const loc = l;
        matchStatus = l.status === 'INACTIVE' && (loc.rejectionDetails?.length ?? 0) > 0;
      } else if (statusFilter === 'EXPIRED') {
        const loc = l;
        matchStatus = l.status === 'INACTIVE' && (!loc.rejectionDetails || loc.rejectionDetails.length === 0);
      } else {
        matchStatus = l.status === statusFilter;
      }

      const matchKeyword =
        l.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        l.address.toLowerCase().includes(searchKeyword.toLowerCase());

      return matchStatus && matchKeyword;
    });
  }, [data, statusFilter, searchKeyword]);

  const handleSearch = () => {
    if (inputRef.current) {
      setSearchKeyword(inputRef.current.value);
    }
  };

  const handleReset = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSearchKeyword('');
  };

  function getDisplayStatus(loc: MyVenueLocation): DisplayStatus {
    const hasRejection = !!loc.rejectionDetails?.length;

    if (loc.status === 'DRAFTED' && hasRejection) return 'REJECTED';

    if (loc.status === 'INACTIVE') {
      if (hasRejection) return 'CLOSED';
      return 'EXPIRED';
    }

    return loc.status;
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="flex gap-10 p-8 items-start">
        <div className="flex-1 min-w-0 space-y-4">
          {searchKeyword && (
            locations.length > 0 ? (
              <p className="mb-4 text-sm text-gray-500">
                Tìm thấy {locations.length} địa điểm {searchKeyword ? `cho "${searchKeyword}"` : ''}
              </p>
            ) : (
              <div className="text-center text-gray-500 py-10">
                Không tìm thấy địa điểm nào {searchKeyword ? `phù hợp với "${searchKeyword}"` : ''}
              </div>
            )
          )}

          {locations.map((loc) => {
            const sub = getSubscriptionInfo(loc);
            const displayStatus = getDisplayStatus(loc);
            return (
              <div
                key={loc.id}
                className="group relative flex gap-4 bg-white rounded-2xl p-4 border border-violet-100
                hover:shadow-lg hover:-translate-y-0.5 hover:border-violet-300 transition-all duration-200"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <ImageWithFallback
                    src={loc.coverImage?.[0] && typeof loc.coverImage[0] === 'string' && loc.coverImage[0].startsWith('http') ? loc.coverImage[0] : ''}
                    alt={loc.name}
                    className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="flex-1 pr-10">
                  <div className="flex items-center gap-2">
                    <Link href={`/venue/location/mylocation/${loc.id}`}>
                      <h3 className="font-semibold text-lg text-gray-900 hover:underline">
                        {loc.name}
                      </h3>
                    </Link>

                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-medium uppercase tracking-wide ${statusMap[displayStatus]}`}>
                      <span className="relative flex h-2 w-2">
                        {displayStatus === "ACTIVE" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                        )}
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                      </span>

                      {displayStatus === "ACTIVE" && "Đang mở"}
                      {displayStatus === "PENDING" && "Chờ duyệt"}
                      {displayStatus === "DRAFTED" && "Bản nháp"}
                      {displayStatus === "REJECTED" && "Bị từ chối"}
                      {displayStatus === "CLOSED" && "Đóng cửa"}
                      {displayStatus === "EXPIRED" && "Hết hạn"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{loc.description}</p>

                  <div className="mt-1 space-y-1 text-sm text-gray-500">
                    <div className="flex items-start gap-1">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{loc.address}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <CalendarDays size={13} />
                      {new Date(loc.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  <div className="mt-2">
                    {sub.type === "EXPIRED" || sub.type === "CLOSED" || sub.type === "REJECTED" ? (
                      <div className="px-3 py-2">
                        <div className="text-sm font-semibold text-red-600">{sub.label}</div>
                        <div className="text-xs text-red-500">{sub.subLabel}</div>
                      </div>
                    ) : (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${sub.className}`}>
                        {sub.label}
                      </div>
                    )}
                  </div>
                </div>

                <Link href={`/venue/location/mylocation/${loc.id}`} className="absolute bottom-4 right-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-100 text-violet-600 
                    group-hover:bg-violet-600 group-hover:text-white transition">
                    <ChevronRight size={18} />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="w-[320px] space-y-2 sticky top-8 self-start">
          <div className="flex items-center gap-2 bg-white border border-[#8093F1] rounded-3xl px-4 py-3 mb-4">
            <Search className="text-[#8093F1] w-5 h-5" />

            <input
              ref={inputRef}
              placeholder="Tìm kiếm"
              className="w-full bg-transparent outline-none text-sm"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />

            <button
              onClick={handleSearch}
              className="px-3 py-1 bg-[#8093F1] text-white rounded-xl text-sm"
            >
              Tìm
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1 border border-[#8093F1] text-[#8093F1] rounded-xl text-sm"
            >
              Xóa
            </button>
          </div>

          {[
            { key: 'all', label: 'Tất cả', value: stats.all },
            { key: 'DRAFTED', label: 'Bản nháp', value: stats.DRAFTED },
            { key: 'ACTIVE', label: 'Đang mở', value: stats.ACTIVE },
            { key: 'CLOSED', label: 'Đóng cửa', value: stats.CLOSED },
            { key: 'EXPIRED', label: 'Hết hạn', value: stats.EXPIRED },
            { key: 'PENDING', label: 'Chờ duyệt', value: stats.PENDING },
          ].map(item => (
            <div
              key={item.key}
              onClick={() => setStatusFilter(item.key as StatusFilter)}
              className={`cursor-pointer rounded-[20px] p-3 transition
                ${statusFilter === item.key ? 'bg-[#d2c7ff]' : 'bg-[#F8EAFB] hover:bg-[#F3ECFF]'}`}
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-[#5B3DF5]">{item.value.toString().padStart(2, '0')}</p>
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
                <span className="text-[#6B4EFF] font-medium text-lg">Thêm địa điểm ngay</span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}