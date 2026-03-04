"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Advertisement } from "@/api/venue/advertisement/type";
import { getAdvertisementById } from "@/api/venue/advertisement/api";

export default function AdvertisementDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [ad, setAd] = useState<Advertisement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await getAdvertisementById(Number(id));
                setAd(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAd();
    }, [id]);

    if (loading) return <div className="p-6">Đang tải...</div>;

    if (!ad) return <div className="p-6">Không tìm thấy quảng cáo</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.back()}
                    className="mb-4 text-blue-600"
                >
                    ← Quay lại
                </button>
                {ad.status === "DRAFT" && (
                    <button
                        onClick={() => router.push(`/venue/advertisement/package?adId=${ad.id}`)}
                        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Gửi duyệt & Chọn gói quảng cáo
                    </button>
                )}
            </div>

            <Image
                src={ad.bannerUrl}
                alt={ad.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <h1 className="text-3xl font-bold mb-4">
                {ad.title}
            </h1>

            <p className="text-gray-600 mb-4">
                {ad.content}
            </p>

            <div className="space-y-2 text-sm text-gray-500">
                <p>Placement: {ad.placementType}</p>
                <p>Status: {ad.status}</p>
                <p>Created: {new Date(ad.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(ad.updatedAt).toLocaleString()}</p>
            </div>

            {ad.rejectionReason && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    Lý do từ chối: {ad.rejectionReason}
                </div>
            )}
        </div>
    );
}