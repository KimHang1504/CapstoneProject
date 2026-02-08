'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSubscriptionPackages } from '@/api/subscription/api';
import { SubscriptionPackage } from '@/api/subscription/type';
import { Check } from 'lucide-react';

export default function LocationRegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locationId = searchParams.get('locationId');

  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await getSubscriptionPackages('VENUE');
        console.log('Subscription response:', response);
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching subscription packages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleBuyPackage = (subscriptionId: number) => {
    if (!locationId) {
      alert('Không tìm thấy thông tin địa điểm');
      return;
    }
    router.push(`/venue/location/subscriptions/checkout?locationId=${locationId}&subscriptionId=${subscriptionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="mb-10 text-2xl md:text-3xl font-bold text-center text-gray-900">
        Đăng ký địa điểm để được nhiều khách hàng biết đến
      </h1>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl ">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="flex flex-col h-full rounded-xl overflow-hidden bg-[#B388EB]"
          >
            {/* CONTENT */}
            <div className="flex flex-col flex-1 p-8 shadow-md text-white">
              {/* Tên gói */}
              <span className="text-xl font-semibold mb-5">
                {pkg.packageName}
              </span>

              {/* Giá */}
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  {pkg.price.toLocaleString('vi-VN')} VND
                </p>
                <p>/ {pkg.durationDays} ngày</p>
              </div>

              {/* Mô tả */}
              <div className="mb-6">
                <p className="text-sm">{pkg.description}</p>
              </div>

              {/* Nút mua */}
              <button
                onClick={() => handleBuyPackage(pkg.id)}
                className="mb-6 rounded-md py-3 text-sm font-semibold bg-white text-[#B388EB] hover:bg-[#fdeaf9]"
              >
                Mua
              </button>

              {/* FEATURES */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="text-[#FDC5F5] flex-shrink-0" />
                  <span>Hiển thị trên ứng dụng</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-[#FDC5F5] flex-shrink-0" />
                  <span>Thời hạn {pkg.durationDays} ngày</span>
                </div>
                {pkg.packageName.includes('PRO') && (
                  <>
                    <div className="flex items-start gap-2">
                      <Check className="text-[#FDC5F5] flex-shrink-0" />
                      <span>Ưu tiên hiển thị</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="text-[#FDC5F5] flex-shrink-0" />
                      <span>Báo cáo khách hàng</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <button
              className="bg-[#FDC5F5] py-4 text-gray-800 hover:bg-[#f79fea]"
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
