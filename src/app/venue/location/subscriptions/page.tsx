'use client';

import { MOCK_SUBSCRIPTION_PACKAGES } from '@/config/mock/subscription';
import { Check } from 'lucide-react';

export default function LocationRegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="mb-10 text-2xl md:text-3xl font-bold text-center text-gray-900">
        Đăng ký địa điểm để được nhiều khách hàng biết đến
      </h1>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl ">
        {MOCK_SUBSCRIPTION_PACKAGES.map((pkg) => (
          <div
            key={pkg.subscriptionId}
            className="flex flex-col h-full rounded-xl overflow-hidden bg-[#B388EB]"
          >
            <div
              key={pkg.subscriptionId}
              className="flex flex-col h-full rounded-xl overflow-hidden bg-[#B388EB]"
            >
              {/* CONTENT */}
              <div className="flex flex-col flex-1 p-8 shadow-md text-white">
                {/* Tên gói */}
                <span className="text-xl font-semibold mb-5">
                  {pkg.namePackage}
                </span>

                {/* Giá */}
                <div className="mb-6">
                  <p className="text-3xl font-bold">
                    {pkg.price.toLocaleString('vi-VN')} VND
                  </p>
                  <p>/ {pkg.durationDays} ngày</p>
                </div>

                {/* Nút mua */}
                <button
                  className="mb-6 rounded-md py-3 text-sm font-semibold bg-white text-[#B388EB] hover:bg-[#fdeaf9]"
                >
                  Mua
                </button>

                {/* FEATURES – đẩy xuống dưới nếu cần */}
                <ul className="space-y-2 text-sm">
                  {pkg.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="text-[#FDC5F5]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FOOTER */}
              <button
                className="bg-[#FDC5F5] py-4 text-gray-800 hover:bg-[#f79fea]"
              >
                Xem chi tiết
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
