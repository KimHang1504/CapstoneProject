'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { VenueLocationDetail } from '@/api/venue/location/type';
import { getVenueLocationDetail } from '@/api/venue/location/api';
import { getMe } from '@/api/auth/api';
import { UserProfile } from '@/api/auth/type';

import ReviewSection from '@/app/venue/review/component/ReviewSection';
import {XCircle, Send, Pencil, Mail, Phone, Globe, MapPin, Edit2, Info } from 'lucide-react';
import { geocodeAddress } from '@/api/geocode/nominatim';
import OpeningHoursModal from './OpeningHoursModal';
import FieldDisplay from '@/components/fielddisplay/FieldDisplay';
import { toast } from 'sonner';
import { checkVenueOwnerVerification, getLocationSubmitErrors } from '@/app/venue/location/utils/venue-location-submit';
import { getLocationStatusUI } from '@/app/venue/location/locationStatusUI';

export default function LocationDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const router = useRouter();

    const [location, setLocation] = useState<VenueLocationDetail | null>(null);
    const [latLon, setLatLon] = useState<{ lat: number, lon: number } | null>(null)
    const [mapLoading, setMapLoading] = useState(false)

    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showOpeningHoursModal, setShowOpeningHoursModal] = useState(false);
    const isOpen = location?.todayOpeningHour?.isClosed === false;
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [openMissingCitizenPopup, setOpenMissingCitizenPopup] = useState(false);




    const moods = Array.from(
        new Map(
            (location?.locationTags ?? [])
                .map(tag => tag.coupleMoodType)
                .filter((mood): mood is NonNullable<typeof mood> => Boolean(mood))
                .map(mood => [mood.id, mood])
        ).values()
    );

    const personalities = Array.from(
        new Map(
            (location?.locationTags ?? [])
                .map(tag => tag.couplePersonalityType)
                .filter((personality): personality is NonNullable<typeof personality> => Boolean(personality))
                .map(personality => [personality.id, personality])
        ).values()
    );

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
    }

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setIsLoading(true);
                const response = await getVenueLocationDetail(id);
                const data = response.data;
                console.log('Fetched location detail:', data);
                setLocation(data);
            } catch (error) {
                console.error('Error fetching location:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, [id]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await getMe();
                setUserProfile(res.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (!location?.address) return;

        const fetchLatLon = async () => {
            try {
                setMapLoading(true);
                const { lat, lon } = await geocodeAddress(location.address);
                setLatLon({ lat, lon });
            } catch {
                console.log("Không lấy được tọa độ");
            } finally {
                setMapLoading(false);
            }
        };

        fetchLatLon();
    }, [location?.address]);

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

    const isPriceEmpty = location.priceMax === null;

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    const redeemLink = `${baseUrl}/staff/redeem?locationId=${location.id}`;

    const isPending = location.status === 'PENDING';
    const canSubmitForApproval =
        location.status === 'DRAFTED' ||
        location.status === 'PENDING' ||
        location.status === 'INACTIVE';
    const allImages = [
        ...(location.coverImage || []),
        ...(location.interiorImage || [])
    ]



    const images = allImages.length > 0 ? allImages : ['https://i.pinimg.com/736x/36/21/a9/3621a941262c3977faff6f9a47943eee.jpg']

    const handleEdit = () => {
        router.push(`/venue/location/mylocation/edit/${id}`);
    };

    const handleSubmitForApproval = () => {
        if (isPending) return;

        const { missingCitizenId } = checkVenueOwnerVerification(userProfile);

        if (missingCitizenId) {
            setOpenMissingCitizenPopup(true);
            return;
        }

        const errors = getLocationSubmitErrors(location);

        if (errors.length > 0) {
            toast.error(
                <div className="flex flex-wrap gap-1">
                    <span>Vui lòng cập nhật:</span>
                    {errors.map((err, i) => (
                        <span
                            key={i}
                            className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs"
                        >
                            {err}
                        </span>
                    ))}
                </div>,
                { duration: 7000 }
            );
            return;
        }

        router.push(`/venue/location/mylocation/subscriptions?locationId=${location.id}`);
    };

    const canShowReview =
        location.status === "ACTIVE" ||
        location.status === "INACTIVE";

    const canEditOpeningHours =
        location.status === "ACTIVE" ||
        location.status === "INACTIVE";

    const handleRefresh = () => {
        const fetchLocation = async () => {
            try {
                const response = await getVenueLocationDetail(id);
                const data = response.data;
                setLocation(data);
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };
        fetchLocation();
    };

    const statusUI = getLocationStatusUI(location);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex gap-4">
                        <p className=" text-gray-900 text-3xl font-bold">{location.name}</p>
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusUI.color}`}
                            >
                                {/* <statusUI.icon size={16} /> */}
                                {statusUI.label}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        {/* SUBMIT */}
                        {canSubmitForApproval && (
                            <button
                                onClick={handleSubmitForApproval}
                                disabled={isPending}
                                className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-all duration-200
                                ${isPending
                                        ? 'bg-amber-100 text-amber-600 cursor-not-allowed'
                                        : 'bg-linear-to-r from-violet-500 to-purple-500 text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                <Send size={18} />
                                {isPending
                                    ? 'Đang chờ duyệt'
                                    : location.status === 'INACTIVE'
                                        ? 'Gia hạn'
                                        : 'Gửi duyệt'
                                }
                            </button>
                        )}

                        {/* EDIT */}
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium
                             bg-gray-100 text-gray-700 border border-gray-200
                             hover:bg-gray-200 hover:shadow-sm transition-all duration-200"
                        >
                            <Pencil size={18} />
                            Chỉnh sửa
                        </button>
                    </div>
                </div>


                {location.rejectionDetails?.length ? (
                    <div className="mt-4 relative overflow-hidden rounded-xl border border-red-200 bg-red-50">

                        {/* Accent bar */}
                        <div className="absolute left-0 top-0 h-full w-1.5 bg-red-500" />

                        <div className="p-4 pl-5">
                            <div className="flex items-start gap-3">

                                {/* Icon */}
                                <div className="mt-0.5 text-red-500">
                                    <XCircle size={18} />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-red-700">
                                        {location.status === 'DRAFTED'
                                            ? 'Bị từ chối duyệt'
                                            : 'Địa điểm bị đóng'}
                                    </p>

                                    <p className="text-sm text-red-600 mt-1">
                                        {location.rejectionDetails[0].reason}
                                    </p>

                                    <p className="text-xs text-red-400 mt-1">
                                        {new Date(location.rejectionDetails[0].rejectedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="bg-white rounded-2xl">
                    <div className="relative w-full h-95 overflow-hidden rounded-xl">

                        <Image
                            src={images[currentImageIndex]}
                            alt={`Image ${currentImageIndex + 1}`}
                            fill
                            unoptimized
                            className="object-cover transition-all duration-500"
                        />

                        {/* LEFT BUTTON */}
                        {images.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2
                bg-white/70 hover:bg-white text-gray-700
                rounded-full p-2 shadow-md transition"
                            >
                                ❮
                            </button>
                        )}

                        {/* RIGHT BUTTON */}
                        {images.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2
                bg-white/70 hover:bg-white text-gray-700
                rounded-full p-2 shadow-md transition"
                            >
                                ❯
                            </button>
                        )}

                        {/* DOTS */}
                        {images.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition
                            ${index === currentImageIndex
                                                ? 'bg-white'
                                                : 'bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6 py-3">
                    <div className="bg-white rounded-2xl space-y-4 col-span-2">
                        <div className="bg-white rounded-2xl">
                            <FieldDisplay
                                value={isPriceEmpty ? null : location.priceMax}
                                label="khoảng giá"
                                onEdit={handleEdit}
                            >
                                <p className="text-2xl text-gray-900 font-bold">
                                    {location.priceMin.toLocaleString('vi-VN')}
                                    {" - "}
                                    {location.priceMax?.toLocaleString('vi-VN')}
                                    {" VND"}
                                </p>
                            </FieldDisplay>
                        </div>
                        {(location.status === 'ACTIVE' || location.status === 'INACTIVE') && (
                            <div className="items-center gap-3">
                                <div className="flex justify-between">
                                    <div
                                        className={`inline-flex items-center gap-2 py-1.5 text-sm font-semibold
                                                 ${isOpen
                                                ? " text-emerald-700"
                                                : "bg-rose-50 text-rose-600 border-rose-200"}
                                                `}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                                        {isOpen && location?.todayOpeningHour ? (
                                            <>
                                                Đang mở cửa từ{" "}
                                                <span className="font-bold">
                                                    {location.todayOpeningHour.openTime.slice(0, 5)}
                                                </span>{" "}
                                                đến{" "}
                                                <span className="font-bold">
                                                    {location.todayOpeningHour.closeTime.slice(0, 5)}
                                                </span>
                                            </>
                                        ) : (
                                            <>Hôm nay đóng cửa</>
                                        )}
                                    </div>
                                    <div>
                                        {canEditOpeningHours && (
                                            <button
                                                onClick={() => setShowOpeningHoursModal(true)}
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition"
                                            >
                                                <Edit2 size={16} />
                                                Cập nhật
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-bold mb-1">Mô tả</p>
                            <p className="text-sm text-gray-700">{location.description}</p>
                        </div>
                        {/* <div className="bg-white rounded-2xl p-4 space-y-3">
                            <p className="font-semibold">Link quét voucher cho nhân viên</p>

                            <div className="flex items-center gap-2">
                                <input
                                    value={redeemLink}
                                    readOnly
                                    className="flex-1 text-sm px-3 py-2 border rounded-lg bg-gray-50"
                                />

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(redeemLink);
                                        toast.success("Đã copy link!");
                                    }}
                                    className="px-3 py-2 bg-violet-500 text-white rounded-lg text-sm hover:bg-violet-600"
                                >
                                    Copy
                                </button>
                            </div>

                            <a
                                href={redeemLink}
                                target="_blank"
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Mở trang redeem →
                            </a>
                        </div> */}
                        {/* <p className="text-sm font-bold mb-2">Danh mục</p> */}

                        {location.categories?.length ? (
                            <div className="flex gap-2 flex-wrap">
                                {location.categories.map(cat => (
                                    <span
                                        key={cat.id}
                                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-500">Chưa có danh mục</span>
                        )}
                        <div>
                            <p className="text-sm font-bold mb-2">Tâm trạng</p>
                            <div className="flex flex-wrap gap-2">
                                {moods.length > 0 ? (
                                    moods.map(mood => (
                                        <div key={mood.id} className="group relative inline-block">
                                            <span
                                                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#95cfff] px-4 py-1 text-sm font-medium text-white"
                                            >
                                                {mood.name}
                                                <Info size={12} className="opacity-80" />
                                            </span>

                                            <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                                                {mood.description || 'Chưa có mô tả cho tâm trạng này'}
                                                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-400 flex items-center gap-2">
                                        <span>Chưa chọn tâm trạng</span>
                                        <button onClick={handleEdit} className="text-violet-500 hover:underline">
                                            Cập nhật ngay
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold mb-2">Tính cách</p>
                            <div className="flex flex-wrap gap-2">
                                {personalities.length > 0 ? (
                                    personalities.map(personality => (
                                        <div key={personality.id} className="group relative inline-block">
                                            <span
                                                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#c493f7] px-4 py-1 text-sm font-medium text-white"
                                            >
                                                {personality.name}
                                                <Info size={12} className="opacity-80" />
                                            </span>

                                            <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                                                {personality.description || 'Chưa có mô tả cho tính cách này'}
                                                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-400 flex items-center gap-2">
                                        <span>Chưa có tag</span>
                                        <button onClick={handleEdit} className="text-violet-500 hover:underline">
                                            Cập nhật ngay
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl">
                            <p className="font-semibold mb-2">Địa điểm</p>
                            <p className="text-sm text-green-700 italic "><MapPin className="inline mr-1" />{location.address}</p>

                            {mapLoading && (
                                <div className="mt-3 h-60 w-full rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                                    Đang tải bản đồ...
                                </div>
                            )}

                            {!mapLoading && latLon && (
                                <iframe
                                    className="mt-3 w-full h-60 rounded-xl"
                                    loading="lazy"
                                    src={`https://www.openstreetmap.org/export/embed.html?marker=${latLon.lat},${latLon.lon}&zoom=17`}
                                />
                            )}
                        </div>
                    </div>
                    <div className="border-l border-gray-200 pl-4">
                        <p className="font-semibold mb-2">Thông tin liên hệ</p>
                        <div className="flex gap-3 items-center bg-white rounded-2xl p-4">
                            <Mail />
                            <FieldDisplay value={location.email} label="email" onEdit={handleEdit}>
                                <p className="text-sm text-gray-700">{location.email}</p>
                            </FieldDisplay>
                        </div>

                        <div className="flex gap-3 items-center bg-white rounded-2xl p-4">
                            <Phone />
                            <FieldDisplay value={location.phoneNumber} label="số điện thoại" onEdit={handleEdit}>
                                <p className="text-sm text-gray-700">{location.phoneNumber}</p>
                            </FieldDisplay>
                        </div>

                        <div className="flex gap-3 items-center bg-white rounded-2xl p-4">
                            <Globe />
                            <FieldDisplay value={location.websiteUrl} label="website" onEdit={handleEdit}>
                                <p className="text-sm text-gray-700">{location.websiteUrl}</p>
                            </FieldDisplay>
                        </div>
                        <div className="bg-linear-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-4 space-y-3">

                            {/* Title + description */}
                            <div>
                                <p className="font-semibold text-gray-900">
                                    Link cho nhân viên quét voucher
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Gửi link này cho nhân viên để họ truy cập trang quét voucher tại địa điểm
                                </p>
                            </div>

                            {/* Link display */}
                            <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
                                <span className="text-sm text-gray-700 truncate flex-1">
                                    {redeemLink}
                                </span>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(redeemLink);
                                        toast.success("Đã copy link cho nhân viên");
                                    }}
                                    className="px-3 py-1.5 bg-violet-500 text-white rounded-md text-xs hover:bg-violet-600 transition"
                                >
                                    Copy
                                </button>
                            </div>

                            {/* Actions */}
                            {/* <div className="flex items-center gap-3 text-xs">
                                <a
                                    href={redeemLink}
                                    target="_blank"
                                    className="text-blue-500 hover:underline"
                                >
                                    Mở thử link →
                                </a>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(redeemLink);
                                        toast.success("Link đã sẵn sàng để gửi qua Zalo / Messenger");
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Copy để gửi
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>

                {location.fullPageMenuImage && location.fullPageMenuImage.length > 0 && (
                    <div className="bg-white rounded-2xl">
                        <p className="font-semibold mb-4">Hình ảnh menu</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {location.fullPageMenuImage.map((img, idx) => (
                                <div key={idx} className="relative w-full h-40 overflow-hidden rounded-xl">
                                    <Image src={img} alt={`Menu ${idx + 1}`} fill unoptimized className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    {canShowReview && (
                        <ReviewSection venueId={location.id} />
                    )}
                </div>


                {/* Opening Hours Modal */}
                {showOpeningHoursModal && (
                    <OpeningHoursModal
                        locationId={location.id}
                        onClose={() => setShowOpeningHoursModal(false)}
                        onSuccess={handleRefresh}
                    />
                )}
            </div>
            {openMissingCitizenPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Thiếu thông tin CCCD
                        </h2>

                        <p className="mt-3 text-sm text-gray-600">
                            Bạn chưa cập nhật CCCD (mặt trước và mặt sau). Vui lòng cập nhật để gửi
                            địa điểm chờ duyệt.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setOpenMissingCitizenPopup(false)}
                                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                            >
                                Để sau
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpenMissingCitizenPopup(false);
                                    window.dispatchEvent(new CustomEvent("openProfileModal"));
                                }}
                                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                            >
                                Cập nhật ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
