'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { VenueLocationDetail } from '@/api/venue/location/type';
import { getVenueLocationDetail } from '@/api/venue/location/api';

export default function LocationDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const router = useRouter();

    const [location, setLocation] = useState<VenueLocationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setIsLoading(true);
                const response = await getVenueLocationDetail(id);
                const data = response.data;
                setLocation(data);
            } catch (error) {
                console.error('Error fetching location:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Đang tải...
            </div>
        );
    }

    if (!location) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Không tìm thấy địa điểm
            </div>
        );
    }

    const isPending = location.status === 'PENDING';
    const firstImage = location.coverImage && location.coverImage.length > 0 
        ? location.coverImage[0] 
        : '/placeholder.jpg';

    /* ================= HANDLERS ================= */

    const handleEdit = () => {
        router.push(`/venue/location/mylocation/create?id=${id}`);
    };

    const handleSubmitForApproval = () => {
        if (isPending) return;
        router.push(`/venue/location/subscriptions?locationId=${location.id}`);
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="flex justify-end gap-4 p-6">
                    {/* SUBMIT FOR APPROVAL — PRIMARY */}
                    <button
                        onClick={handleSubmitForApproval}
                        disabled={isPending}
                        className={`px-7 py-2.5 rounded-full font-semibold transition shadow
                        ${isPending
                                ? 'bg-yellow-200 text-gray-600 cursor-not-allowed shadow-none'
                                : 'bg-violet-600 text-white hover:bg-violet-700'
                            }
    `}
                    >
                        {isPending ? 'Đang chờ duyệt' : 'Gửi duyệt'}
                    </button>

                    {/* EDIT BUTTON */}
                    <button
                        onClick={handleEdit}
                        className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100"
                    >
                        Chỉnh sửa
                    </button>
                </div>


                {/* ===== TOP ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* IMAGE */}
                    <div className="bg-white rounded-2xl p-4">
                        <div className="relative w-full h-75 overflow-hidden rounded-xl">
                            <Image src={firstImage} alt={location.name} fill className="object-cover" />
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="bg-white rounded-2xl p-6 space-y-4">
                        <div>
                            <p className="text-sm font-bold mb-1">Tên địa điểm</p>
                            <p className="text-sm text-gray-700">{location.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-bold mb-1">Mô tả</p>
                            <p className="text-sm text-gray-700">{location.description}</p>
                        </div>

                        <div>
                            <p className="text-sm font-bold mb-2">Mood</p>
                            <div className="flex flex-wrap gap-2">
                                {location.coupleMoodTypes.map(mood => (
                                    <span 
                                        key={mood.id}
                                        className="inline-block rounded-2xl bg-[#C9A7FF] px-4 py-1 text-sm font-medium text-white"
                                    >
                                        {mood.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold mb-2">Personality</p>
                            <div className="flex flex-wrap gap-2">
                                {location.couplePersonalityTypes.map(personality => (
                                    <span 
                                        key={personality.id}
                                        className="inline-block rounded-2xl bg-[#A7D7FF] px-4 py-1 text-sm font-medium text-white"
                                    >
                                        {personality.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <span className="text-sm font-bold">Trạng thái:</span>
                            <span className={`text-sm font-medium ${
                                location.status === 'ACTIVE' ? 'text-green-600' :
                                location.status === 'PENDING' ? 'text-yellow-600' :
                                location.status === 'DRAFTED' ? 'text-gray-600' :
                                'text-red-600'
                            }`}>
                                {location.status === 'ACTIVE' ? 'Đang hoạt động' :
                                 location.status === 'PENDING' ? 'Chờ duyệt' :
                                 location.status === 'DRAFTED' ? 'Bản nháp' :
                                 'Không hoạt động'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ADDRESS */}
                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-2">Địa điểm</p>
                        <p className="text-sm text-gray-700">{location.address}</p>
                    </div>

                    {/* PRICE */}
                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-2">Giá cả</p>
                        <p className="text-sm text-gray-700">
                            {location.priceMin.toLocaleString('vi-VN')} đ - {location.priceMax.toLocaleString('vi-VN')} đ
                        </p>
                    </div>
                </div>

                {/* CONTACT INFO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-2">Email</p>
                        <p className="text-sm text-gray-700">{location.email || 'Chưa có'}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-2">Số điện thoại</p>
                        <p className="text-sm text-gray-700">{location.phoneNumber}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-2">Website</p>
                        <p className="text-sm text-gray-700">{location.websiteUrl || 'Chưa có'}</p>
                    </div>
                </div>

                {/* IMAGES */}
                {location.interiorImage && location.interiorImage.length > 0 && (
                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-4">Hình ảnh nội thất</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {location.interiorImage.map((img, idx) => (
                                <div key={idx} className="relative w-full h-40 overflow-hidden rounded-xl">
                                    <Image src={img} alt={`Interior ${idx + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {location.fullPageMenuImage && location.fullPageMenuImage.length > 0 && (
                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-4">Hình ảnh menu</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {location.fullPageMenuImage.map((img, idx) => (
                                <div key={idx} className="relative w-full h-40 overflow-hidden rounded-xl">
                                    <Image src={img} alt={`Menu ${idx + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* WORKING TIME */}
                <div className="bg-white rounded-2xl p-6">
                    <p className="font-semibold mb-2">Giờ hoạt động</p>
                    <p className="text-sm text-gray-700">
                        {location.todayDayName && location.todayOpeningHour 
                            ? `${location.todayDayName}: ${location.todayOpeningHour}`
                            : 'Chưa có thông tin giờ hoạt động'}
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-2">Đánh giá trung bình</p>
                        <p className="text-2xl font-bold text-violet-600">{location.averageRating.toFixed(1)} ⭐</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-2">Số lượt đánh giá</p>
                        <p className="text-2xl font-bold text-violet-600">{location.reviewCount}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                        <p className="font-semibold mb-2">Chi phí trung bình</p>
                        <p className="text-2xl font-bold text-violet-600">
                            {location.avarageCost.toLocaleString('vi-VN')} đ
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
