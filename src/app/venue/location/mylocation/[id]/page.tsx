'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { VenueLocationDetail } from '@/api/venue/location/type';
import { getVenueLocationDetail } from '@/api/venue/location/api';
import ReviewSection from '@/app/venue/review/component/ReviewSection';
import { CheckCircle2, Clock, FileEdit, PauseCircle, XCircle, Send, Pencil, Mail, Phone, Globe, MapPin, Edit2 } from 'lucide-react';
import { geocodeAddress } from '@/api/geocode/nominatim';
import OpeningHoursModal from './OpeningHoursModal';

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

    const isPending = location.status === 'PENDING';
    const canSubmitForApproval =
        location.status === 'DRAFTED' || location.status === 'PENDING';
    const firstImage = location.coverImage && location.coverImage.length > 0
        ? location.coverImage[0]
        : '/placeholder.jpg';

    const allImages = [
        ...(location.coverImage || []),
        ...(location.interiorImage || [])
    ]



    const images = allImages.length > 0 ? allImages : ['/placeholder.jpg']

    const handleEdit = () => {
        router.push(`/venue/location/mylocation/edit/${id}`);
    };

    const handleSubmitForApproval = () => {
        if (isPending) return;

        const errors = [];

        if (!location.name) errors.push("Tên địa điểm");
        if (!location.description) errors.push("Mô tả");
        if (!location.address) errors.push("Địa chỉ");
        if (!location.email) errors.push("Email");
        if (!location.phoneNumber) errors.push("Số điện thoại");
        if (!location.priceMin || !location.priceMax) errors.push("Khoảng giá");
        if (!location.coverImage?.length) errors.push("Hình ảnh bìa");
        if (!location.coupleMoodTypes?.length) errors.push("Tâm trạng");
        if (!location.couplePersonalityTypes?.length) errors.push("Tính cách");

        if (errors.length > 0) {
            alert("Vui lòng hoàn thiện: " + errors.join(", "));
            return;
        }

        router.push(`/venue/location/subscriptions?locationId=${location.id}`);
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

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex gap-4">
                        <p className=" text-gray-900 text-3xl font-bold">{location.name}</p>
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border
                                    ${location.status === 'ACTIVE'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : location.status === 'PENDING'
                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : location.status === 'DRAFTED'
                                                ? 'bg-gray-100 text-gray-600 border-gray-200'
                                                : location.status === 'INACTIVE'
                                                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                                                    : 'bg-rose-50 text-rose-600 border-rose-200'
                                    }`}
                            >
                                {location.status === 'ACTIVE' && <CheckCircle2 size={16} />}
                                {location.status === 'PENDING' && <Clock size={16} />}
                                {location.status === 'DRAFTED' && <FileEdit size={16} />}
                                {location.status === 'INACTIVE' && <PauseCircle size={16} />}
                                {!['ACTIVE', 'PENDING', 'DRAFTED', 'INACTIVE'].includes(location.status) && <XCircle size={16} />}

                                {location.status === 'ACTIVE'
                                    ? 'Đang hoạt động'
                                    : location.status === 'PENDING'
                                        ? 'Chờ duyệt'
                                        : location.status === 'DRAFTED'
                                            ? 'Bản nháp'
                                            : location.status === 'INACTIVE'
                                                ? 'Tạm ngưng'
                                                : 'Không hoạt động'}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        {/* SUBMIT */}
                        {/* SUBMIT */}
                        {canSubmitForApproval && (
                            <button
                                onClick={handleSubmitForApproval}
                                disabled={isPending}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
        ${isPending
                                        ? 'bg-amber-100 text-amber-600 cursor-not-allowed'
                                        : 'bg-linear-to-r from-violet-500 to-purple-500 text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                <Send size={18} />
                                {isPending ? 'Đang chờ duyệt' : 'Gửi duyệt'}
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
                <div className="bg-white rounded-2xl">
                    <div className="relative w-full h-95 overflow-hidden rounded-xl">

                        <Image
                            src={images[currentImageIndex]}
                            alt={`Image ${currentImageIndex + 1}`}
                            fill
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
                            <p className="text-2xl text-gray-900 font-bold">
                                {location.priceMin.toLocaleString('vi-VN')} - {location.priceMax.toLocaleString('vi-VN')} VND
                            </p>
                        </div>
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

                            {/* {location?.todayOpeningHour && !location.todayOpeningHour.isClosed && (
                                <span className="text-sm text-gray-500">
                                    {location.todayOpeningHour.openTime.slice(0, 5)} - {location.todayOpeningHour.closeTime.slice(0, 5)}
                                </span>
                            )} */}
                        </div>
                        <div>
                            <p className="text-sm font-bold mb-1">Mô tả</p>
                            <p className="text-sm text-gray-700">{location.description}</p>
                        </div>

                        <div>
                            <p className="text-sm font-bold mb-2">Danh mục</p>

                            <div className="flex flex-wrap gap-2">
                                {location.category?.map((cat, index) => (
                                    <span
                                        key={index}
                                        className="inline-block rounded-2xl bg-gray-200 px-4 py-1 text-sm font-medium text-gray-700"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold mb-2">Tâm trạng
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {location.coupleMoodTypes.map(mood => (
                                    <span
                                        key={mood.id}
                                        className="inline-block rounded-2xl bg-[#C9A7FF] px-4 py-1 text-sm font-medium text-white"
                                    >
                                        {mood.name.toLocaleLowerCase()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold mb-2">Tính cách</p>
                            <div className="flex flex-wrap gap-2">
                                {location.couplePersonalityTypes.map(personality => (
                                    <span
                                        key={personality.id}
                                        className="inline-block rounded-2xl bg-[#A7D7FF] px-4 py-1 text-sm font-medium text-white"
                                    >
                                        {personality.name.toLocaleLowerCase()}
                                    </span>
                                ))}
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
                            <p className="text-sm text-gray-700">{location.email || 'Chưa có'}</p>
                        </div>

                        <div className="flex gap-3 items-center bg-white rounded-2xl p-4">
                            <Phone />
                            <p className="text-sm text-gray-700">{location.phoneNumber}</p>
                        </div>

                        <div className="flex gap-3 items-center bg-white rounded-2xl p-4">
                            <Globe />
                            <p className="text-sm text-gray-700">{location.websiteUrl || 'Chưa có'}</p>
                        </div>
                    </div>
                </div>

                {location.fullPageMenuImage && location.fullPageMenuImage.length > 0 && (
                    <div className="bg-white rounded-2xl">
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

                {/* <div className="bg-white rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Giờ hoạt động</p>

                    </div>
                    <p className="text-sm text-gray-700">
                        {location.todayDayName && location.todayOpeningHour
                            ? `${location.todayDayName}: ${location.todayOpeningHour}`
                            : 'Chưa có thông tin giờ hoạt động'}
                    </p>
                </div> */}
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
        </div>
    );
}
