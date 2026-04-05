"use client";

import { useRouter } from "next/navigation";
import { AdvertisementListItem, PLACEMENT_LABEL } from "@/api/venue/advertisement/type";
import ImageWithFallback from "@/components/ImageWithFallback";

type Props = {
  ad: AdvertisementListItem;
};

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  ACTIVE:   { label: "Hoạt động", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  PENDING:  { label: "Chờ duyệt", dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-600 border-amber-200" },
  DRAFT:    { label: "Nháp",      dot: "bg-gray-400",   badge: "bg-gray-50 text-gray-500 border-gray-200" },
  REJECTED: { label: "Từ chối",   dot: "bg-red-400",    badge: "bg-red-50 text-red-500 border-red-200" },
  INACTIVE: { label: "Tạm dừng",  dot: "bg-slate-400",  badge: "bg-slate-50 text-slate-500 border-slate-200" },
  APPROVED: { label: "Đã duyệt",  dot: "bg-violet-400", badge: "bg-violet-50 text-violet-600 border-violet-200" },
};

export default function AdvertisementCard({ ad }: Props) {
  const router = useRouter();
  const status = statusConfig[ad.status] ?? { label: ad.status, dot: "bg-gray-400", badge: "bg-gray-50 text-gray-500 border-gray-200" };
  const placementLabel = PLACEMENT_LABEL[ad.placementType] ?? ad.placementType;

  return (
    <div
      onClick={() => router.push(`/venue/advertisement/myadvertisement/${ad.id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-violet-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Banner with overlay */}
      <div className="relative w-full h-40 overflow-hidden">
        <ImageWithFallback
          src={ad.bannerUrl}
          alt={ad.title}
          width={800}
          height={300}
          className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {/* Placement chip top-left */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-violet-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {placementLabel}
        </span>

        {/* Status badge top-right */}
        <span className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.badge} backdrop-blur-sm bg-opacity-90`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
          {status.label}
        </span>

        {/* Title on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
          <h2 className="text-white font-semibold text-sm line-clamp-1 drop-shadow">{ad.title}</h2>
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-violet-50">
        {/* Venue count */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{ad.venueLocationCount} địa điểm</span>
        </div>

        {/* Start date */}
        {ad.desiredStartDate ? (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(ad.desiredStartDate).toLocaleDateString("vi-VN")}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-300 italic">Chưa đặt ngày</span>
        )}
      </div>

      {/* Footer button */}
      <div className="px-4 py-3 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Cập nhật {new Date(ad.updatedAt).toLocaleDateString("vi-VN")}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-violet-600 group-hover:text-purple-700 transition-colors">
            Quản lý
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
