"use client";

import { AdvertisementDetail } from "@/api/admin/type";
import Image from "next/image";
import { ContentCard } from "./ContentCard";
import { VenueCard } from "./VenueCard";
import { OrderCard } from "./OrderCard";
import { RejectionCard } from "./RejectionCard";
import BackButton from "@/components/BackButton";

// Map mood types to Vietnamese
const getMoodLabel = (mood: string) => {
  const moodMap: Record<string, string> = {
    'HAPPY': 'Vui',
    'SAD': 'Buồn',
    'ANGRY': 'Tức giận',
    'SURPRISED': 'Bất ngờ',
    'CONFUSED': 'Bối rối',
    'DISGUSTED': 'Khó chịu',
    'CALM': 'Bình tĩnh',
    'FEAR': 'Sợ hãi',
  };
  return moodMap[mood] || mood;
};

// Map placement types to Vietnamese
const getPlacementLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'HOME_BANNER': 'Banner trang chủ',
    'POPUP': 'Popup',
  };
  return typeMap[type] || type;
};

// Map status to Vietnamese and colors
const getStatusDisplay = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    'PENDING': { label: 'Đang chờ duyệt', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    'APPROVED': { label: 'Đã duyệt', color: 'bg-green-100 text-green-700 border-green-200' },
    'REJECTED': { label: 'Bị từ chối', color: 'bg-red-100 text-red-700 border-red-200' },
    'ACTIVE': { label: 'Đang hoạt động', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    'INACTIVE': { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    'DRAFT': { label: 'Nháp', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  };
  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
};

export default function AdsDetailPage({ data }: { data: AdvertisementDetail }) {
    const statusDisplay = getStatusDisplay(data.status);
    
    return (
        <div className="space-y-6 bg-gradient-to-br from-slate-50 to-purple-50/30 min-h-screen">
            {/* HEADER */}
            <div className="px-6 pt-6">
                <BackButton />
                <h1 className="text-2xl font-bold text-slate-800 mt-4">Chi tiết quảng cáo</h1>
            </div>

            {/* HERO BANNER - FULL WIDTH */}
            <div className="relative w-full h-96">
                <Image
                    src={data.bannerUrl}
                    alt="banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Status Badge - Top Right */}
                <div className="absolute top-6 right-6">
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${statusDisplay.color} backdrop-blur-sm`}>
                        {statusDisplay.label}
                    </span>
                </div>

                {/* Title and Info - Bottom Left */}
                <div className="absolute bottom-8 left-8 text-white space-y-3">
                    <h2 className="text-4xl font-bold drop-shadow-lg">{data.title}</h2>
                    <div className="flex gap-2">
                        <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                            {getMoodLabel(data.moodTypeName)}
                        </span>
                        <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                            {getPlacementLabel(data.placementType)}
                        </span>
                    </div>
                </div>
            </div>

            {/* CONTENT LAYOUT - Single Column for better UX */}
            <div className="max-w-7xl mx-auto px-6 pb-6 space-y-6">
                {/* Mô tả */}
                <ContentCard content={data.content} />
                
                {/* Lịch sử thanh toán quảng cáo */}
                <OrderCard orders={data.adsOrders} />
                
                {/* Địa điểm áp dụng */}
                <VenueCard venues={data.venueLocationAds} />
                
                {/* Lịch sử từ chối (nếu có) */}
                {data.rejectionHistory && data.rejectionHistory.length > 0 && (
                    <RejectionCard history={data.rejectionHistory} />
                )}
            </div>
        </div>
    );
}