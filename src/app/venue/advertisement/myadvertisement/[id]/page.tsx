'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import { Advertisement, PLACEMENT_LABEL } from '@/api/venue/advertisement/type';
import { getAdvertisementById, softDeleteAdvertisement, restoreAdvertisement } from '@/api/venue/advertisement/api';

import { Send, Pencil, Clock, CheckCircle2, XCircle, FileEdit, MapPin, X, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import { checkVenueOwnerVerification } from '@/app/venue/location/utils/venue-location-submit';
import MissingCitizenPopup from '@/app/venue/advertisement/component/MissingCitizenPopup';
import { getMe } from '@/api/auth/api';
import ImageWithFallback from '@/components/ImageWithFallback';
import { toast } from 'sonner';

export default function AdvertisementDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [ad, setAd] = useState<Advertisement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const [openMissingCitizenPopup, setOpenMissingCitizenPopup] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    const contentRef = useRef<HTMLParagraphElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        if (contentRef.current && ad?.content) {
            setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);
        }
    }, [ad?.content]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMe(); // API của bạn
                setUserProfile(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile();
    }, []);

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



    const images = ad.bannerUrl
        ? ad.bannerUrl.split(',').map(url => url.trim()).filter(Boolean)
        : ['/placeholder.jpg'];

    const safeIndex = currentImageIndex % images.length;
    const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);

    const isDraft = ad.status === "DRAFT";
    const canEdit = ad.status === "DRAFT" || ad.status === "REJECTED";
    const isDeleted = ad.isDeleted;
    const hasActiveVenue = ad.venueLocationAds?.some(v => v.status === "ACTIVE");

    const MIN_HOURS_AHEAD = 72;

    const handleSubmit = () => {
        const { missingCitizenId } = checkVenueOwnerVerification(userProfile);

        if (missingCitizenId) {
            setOpenMissingCitizenPopup(true);
            return;
        }

        if (ad.desiredStartDate) {
            const startDate = new Date(ad.desiredStartDate);
            const now = new Date();

            const minDate = new Date(now.getTime() + MIN_HOURS_AHEAD * 60 * 60 * 1000);

            if (startDate < now) {
                toast.error("Ngày bắt đầu không được là quá khứ");
                return;
            }

            if (startDate < minDate) {
                const hoursRemaining = Math.ceil(
                    (minDate.getTime() - now.getTime()) / (60 * 60 * 1000)
                );

                toast.error(
                    `Quảng cáo cần ít nhất ${hoursRemaining} giờ để admin duyệt. Vui lòng chọn lại thời gian.`
                );
                return;
            }
        } else {
            toast.error('Vui lòng chọn ngày bắt đầu quảng cáo.');
            return;
        }

        router.push(`/venue/advertisement/package?adId=${ad.id}`);
    };
    const handleEdit = () => router.push(`/venue/advertisement/myadvertisement/${ad.id}/edit`);

    const handlePause = async () => {
        try {
            await softDeleteAdvertisement(ad.id);
            toast.success("Đã tạm dừng quảng cáo");
            setAd(prev => prev ? { ...prev, isDeleted: true } : prev);
        } catch (err) {
            console.error(err);
            toast.error("Tạm dừng thất bại");
        }
    };

    const handleResume = async () => {
        try {
            await restoreAdvertisement(ad.id);
            toast.success("Đã chạy lại quảng cáo");
            setAd(prev => prev ? { ...prev, isDeleted: false } : prev);
        } catch (err) {
            console.error(err);
            toast.error("Khôi phục thất bại");
        }
    };



    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex gap-4">
                        <p className="text-gray-900 text-3xl font-bold">{ad.title}</p>
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
                            {ad.status === "ACTIVE" ? "Đang chạy"
                                : ad.status === "APPROVED" ? "Đã duyệt"
                                    : ad.status === "PENDING" ? "Chờ duyệt"
                                        : ad.status === "DRAFT" ? "Bản nháp"
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
                        {/* Pause / Resume */}
                        {hasActiveVenue && (
                            isDeleted ? (
                                <button
                                    onClick={handleResume}
                                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium
                bg-emerald-100 text-emerald-700 border border-emerald-200
                hover:bg-emerald-200 transition-all duration-200"
                                >
                                    <Play size={18} />
                                    Chạy tiếp
                                </button>
                            ) : (
                                <button
                                    onClick={handlePause}
                                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium
                bg-amber-100 text-amber-700 border border-amber-200
                hover:bg-amber-200 transition-all duration-200"
                                >
                                    <Pause size={18} />
                                    Tạm dừng
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* REJECTION HISTORY */}
                {ad.status === "REJECTED" && ad.rejectionHistory?.length > 0 && (
                    <div className="relative overflow-hidden border border-rose-200 bg-linear-to-r from-rose-50 to-pink-50 rounded-2xl p-5">
                        <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-brom-rose-400 to-pink-500 rounded-l-2xl" />
                        <div className="pl-3">
                            <div className="flex items-center gap-2 mb-1">
                                <XCircle size={16} className="text-rose-500" />
                                <p className="font-semibold text-rose-700">Quảng cáo bị từ chối</p>
                            </div>
                            <p className="text-sm text-rose-600 leading-relaxed">
                                {ad.rejectionHistory[ad.rejectionHistory.length - 1].reason}
                            </p>
                        </div>
                    </div>
                )}

                {/* BANNER */}
                <div className="relative w-full rounded-3xl overflow-hidden shadow-xl group" style={{ height: '420px' }} onClick={() => setIsLightboxOpen(true)}>
                    <ImageWithFallback
                        src={images[safeIndex]}
                        alt="Advertisement banner"
                        width={1200}
                        height={420}
                        className="object-cover cursor-zoom-in w-full h-full"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-linear-to-rrom-violet-900/25 to-transparent pointer-events-none" />

                    {/* Prev / Next */}
                    {images.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-3 shadow-lg transition-all duration-200 border border-white/30">❮</button>
                            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-3 shadow-lg transition-all duration-200 border border-white/30">❯</button>
                            {/* Dot indicators */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`h-1.5 rounded-full transition-all duration-200 ${i === safeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Zoom hint */}
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Click để phóng to
                    </div>

                    {/* Bottom overlay: content + link */}
                    <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1.5">Nội dung</p>
                            <p
                                ref={contentRef}
                                className={`text-white text-sm leading-relaxed drop-shadow ${!showFullContent ? "line-clamp-2" : ""}`}
                            >
                                {ad.content}
                            </p>
                            {isOverflowing && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowFullContent(prev => !prev); }}
                                    className="text-xs text-white/70 underline mt-1"
                                >
                                    {showFullContent ? "Thu gọn" : "Đọc thêm"}
                                </button>
                            )}
                        </div>
                        <a
                            href={ad.targetUrl}
                            target="_blank"
                            className="flex items-center gap-2 bg-white/15 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/25 transition-all duration-200 shrink-0"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Mở link
                        </a>
                    </div>
                </div>

                {/* LIGHTBOX */}
                {isLightboxOpen && (
                    <div
                        className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-5 right-5 text-white p-2 rounded-full hover:bg-white/20 transition"
                        >
                            <X size={24} />
                        </button>
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition"
                                >❮</button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition"
                                >❯</button>
                            </>
                        )}
                        <div
                            className="relative max-w-[90vw] max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ImageWithFallback
                                src={images[safeIndex]}
                                alt="Full advertisement"
                                width={1200}
                                height={800}
                                className="object-contain rounded-xl max-h-[90vh] w-auto"
                            />
                            {images.length > 1 && (
                                <p className="text-center text-white/60 text-xs mt-3">
                                    {safeIndex + 1} / {images.length}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* INFO STRIP */}
                <div className="grid grid-cols-3 gap-4">
                    {[{
                        label: "Vị trí hiển thị",
                        value: ad.placementType
                            ? (PLACEMENT_LABEL[ad.placementType as keyof typeof PLACEMENT_LABEL] ?? ad.placementType)
                            : "Chưa chọn",
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>,
                        bar: "from-violet-500 to-purple-600",
                        iconBg: "bg-violet-100 text-violet-600",
                    }, {
                        label: "Ngày bắt đầu",
                        value: ad.desiredStartDate ? new Date(ad.desiredStartDate).toLocaleDateString('vi-VN') : 'Chưa đặt',
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                        bar: "from-pink-500 to-rose-500",
                        iconBg: "bg-pink-100 text-pink-600",
                    }, {
                        label: "Ngày tạo",
                        value: new Date(ad.createdAt).toLocaleDateString('vi-VN'),
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                        bar: "from-purple-500 to-indigo-500",
                        iconBg: "bg-purple-100 text-purple-600",
                    }].map((item) => (
                        <div key={item.label} className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden relative">
                            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${item.bar}`} />
                            <div className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                                <p className="text-base font-bold text-gray-800">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* VENUE LOCATIONS */}
                {ad.venueLocationAds?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
                        <div className="bg-linear-to-r from-violet-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <MapPin size={17} className="text-white" />
                                <p className="font-semibold text-white text-sm">Địa điểm đang chạy quảng cáo</p>
                            </div>
                            <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                {ad.venueLocationAds.length}
                            </span>
                        </div>
                        <div className="p-5 flex flex-wrap gap-2.5">
                            {ad.venueLocationAds.map((venue) => (
                                <Link
                                    key={venue.id}
                                    href={`/venue/location/mylocation/${venue.venueId}`}
                                    className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 border border-violet-200 text-sm font-medium text-violet-700 hover:bg-linear-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-md transition-all duration-200"
                                >
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-white/70 transition-colors" />
                                    {venue.venueName}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            <MissingCitizenPopup
                open={openMissingCitizenPopup}
                onClose={() => setOpenMissingCitizenPopup(false)}
                onConfirm={() => {
                    setOpenMissingCitizenPopup(false);
                    window.dispatchEvent(new CustomEvent("openProfileModal"));
                }}
                description="Bạn chưa cập nhật CCCD (mặt trước và mặt sau). Vui lòng cập nhật trước khi gửi duyệt quảng cáo."
            />
        </div>
    );
}
