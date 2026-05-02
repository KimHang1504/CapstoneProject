'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { CalendarDays, ChevronRight, MapPin, Plus, Search, Trash2, AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';

import { getMyVenueLocations, deleteDraftVenue } from '@/api/venue/location/api';
import { MyVenueLocation } from '@/api/venue/location/type';
import { resolveLocationStatus } from '@/app/venue/location/resolver';
import { locationStatusMeta } from "@/app/venue/location/locationStatusMeta";
import Loading from '@/components/Loading';
import LocationCardSkeleton from '@/components/skeleton/LocationCardSkeleton';
import SidebarLocationSkeleton from '@/components/skeleton/SidebarLocationSkeleton';
import { toast } from 'sonner';


type StatusFilter = 'all' | 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'EXPIRED' | 'PENDING' | 'DRAFTED';

export default function MyLocationPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [data, setData] = useState<MyVenueLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; venue: MyVenueLocation | null }>({ show: false, venue: null });
  const [deleting, setDeleting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);



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
          label: "Địa điểm đã đóng cửa bởi admin",
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

  const handleDeleteClick = (venue: MyVenueLocation) => {
    setDeleteModal({ show: true, venue });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.venue) return;

    setDeleting(true);
    try {
      await deleteDraftVenue(deleteModal.venue.id);
      toast.success('Xóa địa điểm nháp thành công');
      
      const newData = await getMyVenueLocations();
      setData(newData);
      
      setDeleteModal({ show: false, venue: null });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa địa điểm này');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ show: false, venue: null });
  };


  const isSearching = searchKeyword.trim().length > 0;
  const isEmpty = locations.length === 0;

  return (
    <div>
      <div className="flex gap-10 p-8 items-start">
        <div className="flex-1 min-w-0 space-y-4">
          {loading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <LocationCardSkeleton key={i} />
              ))}
            </>
          ) : isEmpty ? (
            isSearching ? (
              <div className="text-center text-gray-500 py-10">
                Không tìm thấy địa điểm nào phù hợp với "{searchKeyword}"
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                <div className="text-lg font-medium text-gray-700">
                  Chưa có địa điểm nào
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Hãy tạo địa điểm đầu tiên của bạn
                </p>
              </div>
            )
          ) : (
            <>
              {isSearching && (
                <p className="mb-4 text-sm text-gray-500">
                  Tìm thấy {locations.length} địa điểm cho "{searchKeyword}"
                </p>
              )}

              {
                locations.map((loc) => {
                  const sub = getSubscriptionInfo(loc);
                  const displayStatus = resolveLocationStatus(loc);
                  const meta = locationStatusMeta[displayStatus];
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

                          <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-medium uppercase tracking-wide ${meta.color}`}>
                            <span className="relative flex h-2 w-2">
                              {displayStatus === "ACTIVE" && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                              )}
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                            </span>

                            {meta.label}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2"><span className="font-semibold">Mô tả:</span> {loc.description}</p>

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

                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        {loc.status === 'DRAFTED' && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteClick(loc);
                            }}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-red-100 text-red-600 
                              hover:bg-red-600 hover:text-white transition"
                            title="Xóa bản nháp"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <Link href={`/venue/location/mylocation/${loc.id}`}>
                          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-100 text-violet-600 
                        group-hover:bg-violet-600 group-hover:text-white transition">
                            <ChevronRight size={18} />
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })
              }
            </>
          )}
        </div>
        {loading ? <SidebarLocationSkeleton /> : (
          <div className="w-[320px] space-y-2 sticky top-8 self-start">
            <div className="flex items-center gap-2 
                bg-white/70 backdrop-blur
                border border-purple-100 
                rounded-xl px-3 py-2.5 mb-4
                group focus-within:ring-1 focus-within:ring-[#8093F1]
                transition-all">

              {/* Icon */}
              <Search
                size={18}
                className="text-purple-300 group-focus-within:text-[#8093F1] transition"
              />

              {/* Input */}
              <input
                ref={inputRef}
                placeholder="Tìm kiếm địa điểm..."
                className="flex-1 bg-transparent outline-none text-sm 
               placeholder:text-purple-300"
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex cursor-pointer items-center gap-1 px-3 py-1.5 
               rounded-lg text-xs font-semibold text-white
               bg-linear-to-r from-[#8093F1] to-pink-400
               hover:from-[#6f82e8] hover:to-pink-500
               active:scale-[0.97]
               transition-all shadow-sm hover:shadow-md"
              >
                Tìm
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-medium cursor-pointer
               rounded-lg border border-purple-200
               text-purple-500 bg-white/70
               hover:bg-purple-50 hover:border-purple-300
               transition-all"
              >
                Xóa
              </button>
            </div>

            {[
              { key: 'all', label: 'Tất cả', value: stats.all },
              { key: 'DRAFTED', label: 'Bản nháp', value: stats.DRAFTED },
              { key: 'ACTIVE', label: 'Đang hoạt động', value: stats.ACTIVE },
              { key: 'CLOSED', label: 'Tạm ngưng', value: stats.CLOSED },
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.venue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Xóa địa điểm nháp
                </h3>
                <p className="text-sm text-gray-600">
                  Bạn có chắc muốn xóa <strong>{deleteModal.venue.name}</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}