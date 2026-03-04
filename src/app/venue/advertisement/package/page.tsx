"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdvertisementPackage } from "@/api/venue/advertisement/type";
import { getAdvertisementPackages } from "@/api/venue/advertisement/api";

export default function PackagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const adId = searchParams.get("adId");

  const [packages, setPackages] = useState<AdvertisementPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const res = await getAdvertisementPackages();
      setPackages(res.data);
    };

    fetchPackages();
  }, []);

  const handleContinue = () => {
    if (!selectedPackageId || !adId) return;

    router.push(
      `/checkout?adId=${adId}&packageId=${selectedPackageId}`
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chọn gói để publish quảng cáo</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPackageId(pkg.id)}
            className={`border p-6 rounded-xl cursor-pointer
              ${selectedPackageId === pkg.id ? "border-blue-600" : ""}
            `}
          >
            <h2 className="font-semibold mb-2">{pkg.name}</h2>
            <p className="text-gray-600 mb-3">{pkg.description}</p>

            <div className="text-green-600 font-bold">
              {pkg.price.toLocaleString()} đ
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!selectedPackageId}
        onClick={handleContinue}
        className="mt-8 w-full py-3 bg-blue-600 text-white rounded-lg"
      >
        Tiếp tục thanh toán
      </button>
    </div>
  );
}