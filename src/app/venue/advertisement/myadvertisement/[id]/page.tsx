'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Advertisement, PLACEMENT_LABEL } from '@/api/venue/advertisement/type';
import { getAdvertisementById } from '@/api/venue/advertisement/api';

import { Send, Pencil, Clock, CheckCircle2, XCircle, FileEdit, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AdvertisementDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [ad, setAd] = useState<Advertisement | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);



    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await getAdvertisementById(id);
                setAd(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Đang tải...
            </div>
        );
    }

    if (!ad) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Không tìm thấy quảng cáo
            </div>
        );
    }

    const images = ad.bannerUrl ? [ad.bannerUrl] : ['/placeholder.jpg'];

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    };
    const isDraft = ad.status === "DRAFT";
    const canEdit = ad.status === "DRAFT" || ad.status === "REJECTED";
    const handleSubmit = () => {
        router.push(`/venue/advertisement/package?adId=${ad.id}`);
    };

    const handleEdit = () => {
        router.push(`/venue/advertisement/myadvertisement/${ad.id}/edit`);
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">

                    <div className="flex gap-4">

                        <p className="text-gray-900 text-3xl font-bold">
                            {ad.title}
                        </p>

                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border
                                 ${ad.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : ad.status === "APPROVED"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : ad.status === "PENDING"
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : ad.status === "DRAFT"
                                                ? "bg-gray-100 text-gray-600 border-gray-200"
                                                : "bg-rose-50 text-rose-600 border-rose-200"
                                }`}
                        >
                            {ad.status === "ACTIVE" && <CheckCircle2 size={16} />}
                            {ad.status === "APPROVED" && <CheckCircle2 size={16} />}
                            {ad.status === "PENDING" && <Clock size={16} />}
                            {ad.status === "DRAFT" && <FileEdit size={16} />}
                            {ad.status === "REJECTED" && <XCircle size={16} />}

                            {ad.status === "ACTIVE"
                                ? "Đang chạy"
                                : ad.status === "APPROVED"
                                    ? "Đã duyệt"
                                    : ad.status === "PENDING"
                                        ? "Chờ duyệt"
                                        : ad.status === "DRAFT"
                                            ? "Bản nháp"
                                            : "Từ chối"}
                        </span>

                    </div>


                    <div className="flex justify-end gap-3">

                        {isDraft && (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
                                bg-linear-to-r from-violet-500 to-purple-500 text-white
                                hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                                transition-all duration-200"
                            >
                                <Send size={18} />
                                Gửi duyệt
                            </button>
                        )}

                        {canEdit && (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium
                                 bg-gray-100 text-gray-700 border border-gray-200
                                 hover:bg-gray-200 hover:shadow-sm transition-all duration-200"
                            >
                                <Pencil size={18} />
                                Chỉnh sửa
                            </button>
                        )}

                    </div>

                </div>
                {ad.status === "REJECTED" && ad.rejectionHistory?.length > 0 && (
                    <div className="border border-rose-200 bg-rose-50 text-rose-700 rounded-lg p-4">
                        <p className="font-medium">Quảng cáo bị từ chối</p>
                        <p className="text-sm mt-1">
                            Lý do: {ad.rejectionHistory[ad.rejectionHistory.length - 1].reason}
                        </p>
                    </div>
                )}

                {/* BANNER */}
                <div className="bg-white rounded-2xl">

                    <div className="relative w-full h-95 overflow-hidden rounded-xl">

                        <Image
                            src={images[currentImageIndex]}
                            alt="Advertisement banner"
                            fill
                            className="object-cover"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2
                                    bg-white/70 hover:bg-white text-gray-700
                                    rounded-full p-2 shadow-md"
                                >
                                    ❮
                                </button>

                                <button
                                    onClick={nextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2
                                    bg-white/70 hover:bg-white text-gray-700
                                    rounded-full p-2 shadow-md"
                                >
                                    ❯
                                </button>
                            </>
                        )}

                    </div>
                </div>
                {ad.venueLocationAds?.length > 0 && (
                    <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">

                        <div className="flex items-center gap-2 mb-3">
                            <MapPin size={18} className="text-indigo-600" />
                            <p className="font-semibold text-indigo-700">
                                Địa điểm đang chạy quảng cáo
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {ad.venueLocationAds.map((venue) => (
                                <Link
                                    key={venue.id}
                                    href={`/venue/location/mylocation/${venue.venueId}`}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-sm font-medium text-gray-800 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
                                >
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    {venue.venueName}
                                </Link>
                            ))}
                        </div>

                    </div>
                )}

                <p className="text-gray-800 leading-relaxed text-[15px] whitespace-pre-line">
                    {ad.content}
                </p>
                {/* CONTENT */}
                {/* <div className="bg-linear-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-6 space-y-4">

                    <p className="text-sm font-semibold text-violet-700 uppercase tracking-wide">
                        Nội dung quảng cáo
                    </p>

                    <p className="text-gray-800 leading-relaxed text-[15px] whitespace-pre-line">
                        {ad.content}
                    </p>

                </div> */}


                {/* TARGET URL */}
                <a
                    href={ad.targetUrl}
                    target="_blank"
                    className="block group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                >

                    <p className="text-xs font-semibold text-gray-500 mb-1">
                        LINK ĐÍCH
                    </p>

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-blue-600 break-all group-hover:underline">
                            {ad.targetUrl}
                        </p>

                        <span className="text-xs text-gray-400 group-hover:text-gray-600">
                            mở →
                        </span>

                    </div>

                </a>


                {/* INFO */}
                <div className="grid md:grid-cols-3 gap-5">

                    {/* PLACEMENT */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">

                        <p className="text-xs text-gray-500 uppercase mb-1">
                            Vị trí hiển thị
                        </p>

                        <p className="text-lg font-semibold text-gray-900">
                            {PLACEMENT_LABEL[ad.placementType]}
                        </p>

                    </div>


                    {/* START DATE */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">

                        <p className="text-xs text-gray-500 uppercase mb-1">
                            Ngày bắt đầu
                        </p>

                        <p className="text-lg font-semibold text-gray-900">

                            {ad.desiredStartDate
                                ? new Date(ad.desiredStartDate).toLocaleDateString('vi-VN')
                                : 'Chưa đặt'}

                        </p>

                    </div>


                    {/* CREATED */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">

                        <p className="text-xs text-gray-500 uppercase mb-1">
                            Ngày tạo
                        </p>

                        <p className="text-lg font-semibold text-gray-900">
                            {new Date(ad.createdAt).toLocaleDateString('vi-VN')}
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
}