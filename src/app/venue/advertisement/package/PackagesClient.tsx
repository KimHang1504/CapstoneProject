"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdvertisementPackage } from "@/api/venue/advertisement/type";
import { getAdvertisementPackages, submitAdvertisementPayment } from "@/api/venue/advertisement/api";
import SelectVenueModal from "@/app/venue/advertisement/package/component/SelectVenueModal";

export default function PackagesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const adId = searchParams.get("adId");
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  const [packages, setPackages] = useState<AdvertisementPackage[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      const res = await getAdvertisementPackages();
      setPackages(res.data);
    };

    fetchPackages();
  }, []);

  const handleBuyNow = (packageId: number) => {
    setSelectedPackageId(packageId);
    setOpenModal(true);
  };

  const handleConfirmVenue = async (venueId: number) => {
    if (!adId || !selectedPackageId) return;

    try {
      const res = await submitAdvertisementPayment(Number(adId), {
        packageId: selectedPackageId,
        venueId,
      });

      const paymentData = res.data;

      router.push(`/checkout/qr?orderId=${paymentData.adsOrderId}`);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi submit payment");
    } finally {
      setOpenModal(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Chọn gói để publish quảng cáo
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="border p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h2 className="font-semibold mb-2">{pkg.name}</h2>
            <p className="text-gray-600 mb-3">{pkg.description}</p>

            <div className="text-green-600 font-bold text-lg mb-4">
              {pkg.price.toLocaleString()} đ
            </div>

            <button
              onClick={() => handleBuyNow(pkg.id)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Mua ngay
            </button>
          </div>
        ))}
      </div>

      <SelectVenueModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmVenue}
      />
    </div>
  );
}