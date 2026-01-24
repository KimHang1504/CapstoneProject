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
            className={`flex flex-col rounded-xl bg-[#B388EB]`}
            style={{overflow: 'hidden', height: 'fit-content'}}
          >
            
            <div
            className={`flex flex-col p-8 shadow-md text-white bg-[#B388EB]`}>
            {/* Tên gói */}
              <span className="text-xl text-white font-semibold mb-5 ">
                {pkg.namePackage}
              </span>


            {/* Giá */}
            <div className="mb-6">
              <p className="text-3xl text-white font-bold">
                {pkg.price.toLocaleString('vi-VN')} VND
              </p>
              <p className={'text-white'}>
                / {pkg.durationDays} ngày
              </p>
            </div>

            {/* Nút Mua */}
            <button
              className='mb-6 rounded-md py-3 text-center text-sm font-semibol bg-white text-[#B388EB] cursor-pointer hover:bg-[#fdeaf9]'
            >
              Mua
            </button>

            {/* Features */}
            <ul className="mb-6 space-y-2 text-sm ">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className='text-[#FDC5F5]'/>
                  <span className= 'text-white'>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
              
            </div>

            {/* Xem chi tiết */}
            <button
              className='bg-[#FDC5F5] w-full flex-1 py-4 text-gray-800 cursor-pointer hover:bg-[#f79fea]'
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
