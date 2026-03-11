"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AdvertisementPackage } from "@/api/venue/advertisement/type";
import {
    getAdvertisementPackages,
    submitAdvertisementPayment,
} from "@/api/venue/advertisement/api";

import SelectVenueModal from "@/app/venue/advertisement/package/component/SelectVenueModal";

export default function PackagesClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const adId = searchParams.get("adId");

    const [packages, setPackages] = useState<AdvertisementPackage[]>([]);

    const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

    const [openDurationModal, setOpenDurationModal] = useState(false);
    const [selectedPlacementPackages, setSelectedPlacementPackages] =
        useState<AdvertisementPackage[]>([]);

    const [openVenueModal, setOpenVenueModal] = useState(false);

    // fetch packages
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await getAdvertisementPackages();
                setPackages(res.data);
            } catch (error) {
                console.error("Fetch packages error:", error);
            }
        };

        fetchPackages();
    }, []);

    // group packages by placement
    function groupPackagesByPlacement(packages: AdvertisementPackage[]) {
        const grouped: Record<string, AdvertisementPackage[]> = {};

        packages.forEach((pkg) => {
            if (!grouped[pkg.placement]) {
                grouped[pkg.placement] = [];
            }

            grouped[pkg.placement].push(pkg);
        });

        return grouped;
    }

    const groupedPackages = groupPackagesByPlacement(packages);

    // confirm venue -> create transaction
    const handleConfirmVenue = async (venueId: number) => {
        if (!adId || !selectedPackageId) return;

        try {
            const res = await submitAdvertisementPayment(Number(adId), {
                packageId: selectedPackageId,
                venueId,
            });
            console.log("Payment submission response:", res); // log full response

            const transactionId = res.data.transactionId;

            router.push(
                `/venue/advertisement/package/checkout?transactionId=${transactionId}&type=advertisement`
            );
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi submit payment");
        } finally {
            setOpenVenueModal(false);
        }
    };


    function getPreviewImage(placement: string) {
        switch (placement) {
            case "LIST":
                return "/list.png";

            case "BANNER":
                return "/banner.png";

            case "VOUCHER":
                return "/voucher.png";

            default:
                return "/ads/default.png";
        }
    }
    return (
        <div className="p-6 max-w-6xl mx-auto">

            <h1 className="text-2xl font-bold mb-12">
                Chi tiết các vị trí quảng cáo
            </h1>

            <div className="space-y-20">

                {Object.entries(groupedPackages).map(([placement, pkgs]) => {
                    const oneDayPackage = pkgs.find((p) => p.durationDays === 1);

                    if (!oneDayPackage) return null;

                    return (
                        <div
                            key={placement}
                            className="grid md:grid-cols-2 gap-10 items-center"
                        >

                            {/* LEFT TEXT */}
                            <div>

                                <h2 className="text-xl font-semibold text-blue-600 mb-3">
                                    {oneDayPackage.name}
                                </h2>

                                <p className="text-gray-600 mb-4">
                                    {oneDayPackage.description}
                                </p>

                                <div className="text-lg font-bold text-blue-500 mb-6">
                                    Từ {oneDayPackage.price.toLocaleString()} VND / ngày
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedPlacementPackages(pkgs);
                                        setSelectedPackageId(null);
                                        setOpenDurationModal(true);
                                    }}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Mua
                                </button>

                            </div>

                            {/* PREVIEW */}
                            <div className="h-75 rounded-xl overflow-hidden ">
                                <Image
                                    src={getPreviewImage(placement)}
                                    alt="Advertisement preview"
                                    width={600}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                        </div>
                    );
                })}

            </div>

            {/* DURATION MODAL */}
            {openDurationModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl p-6 w-105">

                        <h2 className="text-lg font-semibold mb-4">
                            Chọn thời hạn quảng cáo
                        </h2>

                        <div className="space-y-3">

                            {selectedPlacementPackages
                                .sort((a, b) => a.durationDays - b.durationDays)
                                .map((pkg) => {

                                    const isSelected = selectedPackageId === pkg.id;

                                    return (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setSelectedPackageId(pkg.id)}
                                            className={`border rounded-lg p-3 flex justify-between cursor-pointer transition
                      ${isSelected
                                                    ? "border-indigo-500 bg-indigo-50"
                                                    : "hover:bg-gray-50"
                                                }`}
                                        >

                                            <span>{pkg.durationDays} ngày</span>

                                            <span className="font-semibold text-blue-600">
                                                {pkg.price.toLocaleString()} VND
                                            </span>

                                        </div>
                                    );
                                })}

                        </div>

                        <div className="flex gap-3 mt-6">

                            <button
                                onClick={() => setOpenDurationModal(false)}
                                className="flex-1 py-2 border rounded-lg"
                            >
                                Hủy
                            </button>

                            <button
                                disabled={!selectedPackageId}
                                onClick={() => {
                                    setOpenDurationModal(false);
                                    setOpenVenueModal(true);
                                }}
                                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400"
                            >
                                Tiếp tục
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* VENUE MODAL */}
            <SelectVenueModal
                open={openVenueModal}
                onClose={() => setOpenVenueModal(false)}
                onConfirm={handleConfirmVenue}
            />

        </div>
    );
}