"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { AdvertisementListItem } from "@/api/venue/advertisement/type";
import { getAdvertisements } from "@/api/venue/advertisement/api";

export default function AdvertisementPage() {
  const router = useRouter();
  const [ads, setAds] = useState<AdvertisementListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdvertisements();
        setAds(res.data);
        console.log(res); // full ApiResponse
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Quản lý quảng cáo
        </h1>

        <button
          onClick={() => router.push("/advertisement/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Tạo mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              onClick={() => router.push(`advertisement/myadvertisement/${ad.id}`)}
              className="border p-4 rounded-lg shadow-sm flex gap-4 "
            >
              <Image
                src={ad.bannerUrl}
                alt={ad.title}
                width={128}
                height={80}
                className="object-cover rounded"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {ad.title}
                </h2>

                <p className="text-sm text-gray-500">
                  Placement: {ad.placementType}
                </p>

                <p className="text-sm text-gray-500">
                  Status: {ad.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}