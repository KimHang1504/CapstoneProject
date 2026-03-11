'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSubscriptionPackages } from '@/api/venue/subscription/api';
import { submitVenueWithPayment } from '@/api/venue/location/api';
import { SubscriptionPackage } from '@/api/venue/subscription/type';
import { Check } from 'lucide-react';

export default function LocationRegisterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const locationId = searchParams.get('locationId');

    const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingPackageId, setProcessingPackageId] = useState<number | null>(null);
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

    const handleBuyPackage = async (pkg: SubscriptionPackage) => {
        if (!locationId) {
            alert('Không tìm thấy thông tin địa điểm');
            return;
        }

        try {
            setProcessingPackageId(pkg.id);

            const response = await submitVenueWithPayment(Number(locationId), {
                packageId: pkg.id,
                quantity: 1
            });
            console.log('Payment submission response:', response);
             const payment = response.data;

            router.push(`/venue/location/subscriptions/checkout?transactionId=${payment.transactionId}&locationId=${locationId}`);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Không thể tạo thanh toán';

            if (errorMessage.includes('pending') || errorMessage.includes('transaction')) {
                alert('Bạn đang có giao dịch chưa hoàn thành. Vui lòng hoàn tất hoặc đợi giao dịch hết hạn.');
            } else {
                alert(errorMessage);
            }
        } finally {
            setProcessingPackageId(null);
        }
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
                        {/* Tên gói */}
                        <span className="text-xl text-center font-extrabold mb-5 bg-[#f4ace9] p-4 text-white ">
                            {pkg.packageName}
                        </span>
                        <div className="flex flex-col flex-1 p-8 shadow-md text-white">


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
                                onClick={() => handleBuyPackage(pkg)}
                                // disabled={isProcessing}
                                className="mb-6 rounded-md py-3 text-sm font-semibold bg-white text-[#B388EB] hover:bg-[#fdeaf9] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Mua
                            </button>

                            {/* FEATURES */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <Check className="text-[#FDC5F5] shrink-0" />
                                    <span>Hiển thị trên ứng dụng</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="text-[#FDC5F5] shrink-0" />
                                    <span>Thời hạn {pkg.durationDays} ngày</span>
                                </div>
                                {pkg.packageName.includes('PRO') && (
                                    <>
                                        <div className="flex items-start gap-2">
                                            <Check className="text-[#FDC5F5] shrink-0" />
                                            <span>Ưu tiên hiển thị</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="text-[#FDC5F5] shrink-0" />
                                            <span>Báo cáo khách hàng</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* <button
              className="bg-[#FDC5F5] py-4 text-gray-800 hover:bg-[#f79fea]"
            >
              Xem chi tiết
            </button> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
