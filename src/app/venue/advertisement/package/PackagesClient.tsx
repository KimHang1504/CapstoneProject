"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AdvertisementPackage, AdvertisementPackageGroup } from "@/api/venue/advertisement/type";
import {
    getAdvertisementPackages,
    submitAdvertisementPayment,
} from "@/api/venue/advertisement/api";

import SelectVenueModal from "@/app/venue/advertisement/package/component/SelectVenueModal";

export default function PackagesClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const adId = searchParams.get("adId");

    const [packages, setPackages] = useState<AdvertisementPackageGroup | null>(null);
    const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
    const [openDurationModal, setOpenDurationModal] = useState(false);
    const [selectedPlacementPackages, setSelectedPlacementPackages] = useState<AdvertisementPackage[]>([]);
    const [selectedVenues, setSelectedVenues] = useState<number[]>([]);
    const [openVenueModal, setOpenVenueModal] = useState(false);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await getAdvertisementPackages();
                setPackages(res.data.data);
                console.log("Packages response:", res);
            } catch (error) {
                console.error("Fetch packages error:", error);
            }
        };
        fetchPackages();
    }, []);

    const handleConfirmVenue = async (venueIds: number[]) => {
        if (!adId || !selectedPackageId) return;
        try {
            const res = await submitAdvertisementPayment(Number(adId), {
                packageId: selectedPackageId,
                venueIds: venueIds,
            });
            const transactionId = res.data.transactionId;
            router.push(`/venue/advertisement/package/checkout?transactionId=${transactionId}&type=advertisement`);
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi submit payment");
        }
    };

    function getPreviewImage(placement: string) {
        switch (placement) {
            case "POPUP": return "/popup.jpg";
            case "HOME_BANNER": return "/homebanner.jpg";
            default: return "/banner.png";
        }
    }

    if (!packages) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
                    <p className="text-sm">Đang tải gói quảng cáo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-2">Quảng cáo</p>
                    <h1 className="text-3xl font-bold text-gray-900">Chi tiết các vị trí quảng cáo</h1>
                    <p className="text-gray-400 text-sm mt-2">Chọn vị trí phù hợp để tiếp cận khách hàng hiệu quả nhất</p>
                </div>

                <div className="space-y-10">
                    {Object.entries(packages).map(([placement, pkgs], idx) => {
                        const cheapestPackage = pkgs.reduce((min, p) =>
                            p.durationDays < min.durationDays ? p : min
                        );
                        const isEven = idx % 2 === 0;

                        return (
                            <div key={placement} className="bg-white rounded-3xl border border-violet-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className={`grid md:grid-cols-2 ${isEven ? "" : "md:[&>*:first-child]:order-2"}`}>

                                    {/* TEXT SIDE */}
                                    <div className="p-10 flex flex-col justify-center">
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-violet-500 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full w-fit mb-4">
                                            {placement === "HOME_BANNER" ? "Banner đầu trang" : "Popup"}
                                        </span>

                                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{cheapestPackage.name}</h2>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6">{cheapestPackage.description}</p>

                                        <div className="flex items-baseline gap-1.5 mb-8">
                                            <span className="text-xs text-gray-400 font-medium">Từ</span>
                                            <span className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                                {cheapestPackage.price.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-400">VND / {cheapestPackage.durationDays} ngày</span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedPlacementPackages(pkgs);
                                                setSelectedPackageId(null);
                                                setOpenDurationModal(true);
                                            }}
                                            className="flex items-center gap-2 w-fit px-7 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Mua ngay
                                        </button>
                                    </div>

                                    {/* PREVIEW SIDE */}
                                    <div className="relative h-72 md:h-auto min-h-64 overflow-hidden">
                                        <Image
                                            src={getPreviewImage(placement)}
                                            alt="Advertisement preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                            Preview
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* DURATION MODAL */}
            {openDurationModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        {/* Modal header */}
                        <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-7 py-5">
                            <h2 className="text-lg font-bold text-white">Chọn thời hạn quảng cáo</h2>
                            <p className="text-violet-200 text-xs mt-1">Chọn gói phù hợp với nhu cầu của bạn</p>
                        </div>

                        <div className="p-6 space-y-3">
                            {selectedPlacementPackages
                                .sort((a, b) => a.durationDays - b.durationDays)
                                .map((pkg) => {
                                    const isSelected = selectedPackageId === pkg.id;
                                    return (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setSelectedPackageId(pkg.id)}
                                            className={`relative border-2 rounded-2xl p-4 flex justify-between items-center cursor-pointer transition-all duration-200 ${
                                                isSelected
                                                    ? "border-violet-500 bg-violet-50 shadow-sm"
                                                    : "border-gray-100 hover:border-violet-200 hover:bg-violet-50/40"
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div>
                                                <p className={`font-semibold text-sm ${isSelected ? "text-violet-700" : "text-gray-700"}`}>
                                                    {pkg.durationDays} ngày
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{pkg.name}</p>
                                            </div>
                                            <span className={`font-bold text-base ${isSelected ? "text-violet-600" : "text-gray-700"}`}>
                                                {pkg.price.toLocaleString()} <span className="text-xs font-normal">VND</span>
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>

                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={() => setOpenDurationModal(false)}
                                className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                disabled={!selectedPackageId}
                                onClick={() => {
                                    setOpenDurationModal(false);
                                    setOpenVenueModal(true);
                                }}
                                className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VENUE MODAL */}
            {openVenueModal && (
                <SelectVenueModal
                    selectedIds={selectedVenues}
                    onConfirm={(ids) => {
                        setSelectedVenues(ids);
                        handleConfirmVenue(ids);
                    }}
                    onClose={() => setOpenVenueModal(false)}
                />
            )}
        </div>
    );
}
