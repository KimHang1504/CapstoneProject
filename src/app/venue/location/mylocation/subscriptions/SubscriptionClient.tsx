'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSubscriptionPackages } from '@/api/venue/subscription/api';
import { submitVenueWithPayment } from '@/api/venue/location/api';
import { SubscriptionPackage } from '@/api/venue/subscription/type';
import { Check, Wallet, QrCode, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LocationRegisterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const locationId = searchParams.get('locationId');

    const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingPackageId, setProcessingPackageId] = useState<number | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
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

    const handleOpenPaymentModal = (pkg: SubscriptionPackage) => {
        setSelectedPackage(pkg);
        setShowPaymentModal(true);
    };

    const handleBuyPackage = async (method: 'WALLET' | 'VIETQR') => {
        if (!locationId || !selectedPackage) {
            toast.error('Không tìm thấy thông tin địa điểm');
            return;
        }

        setShowPaymentModal(false);

        if (method === 'WALLET') {
            // Redirect to wallet confirmation page (will call API there)
            router.push(`/venue/llocationmylocation/subscriptions/confirm?packageId=${selectedPackage.id}&locationId=${locationId}`);
        } else {
            // VietQR: Call API and redirect to checkout
            try {
                setProcessingPackageId(selectedPackage.id);

                const response = await submitVenueWithPayment(Number(locationId), {
                    packageId: selectedPackage.id,
                    quantity: 1,
                    paymentMethod: method
                });
                console.log('Payment submission response:', response);
                const payment = response.data;

                router.push(`/venue/location/subscriptions/checkout?transactionId=${payment.transactionId}&locationId=${locationId}`);
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || error?.message || 'Không thể tạo thanh toán';

                if (errorMessage.includes('pending') || errorMessage.includes('transaction')) {
                    toast.error('Bạn đang có giao dịch chưa hoàn thành. Vui lòng hoàn tất hoặc đợi giao dịch hết hạn.');
                } else {
                    toast.error(errorMessage);
                }
            } finally {
                setProcessingPackageId(null);
            }
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
                                onClick={() => handleOpenPaymentModal(pkg)}
                                disabled={processingPackageId === pkg.id}
                                className="mb-6 rounded-md py-3 text-sm font-semibold bg-white text-[#B388EB] hover:bg-[#fdeaf9] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingPackageId === pkg.id ? 'Đang xử lý...' : 'Mua ngay'}
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

            {/* Payment Modal */}
            {showPaymentModal && selectedPackage && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Chọn phương thức thanh toán
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {selectedPackage.packageName} - {selectedPackage.price.toLocaleString('vi-VN')} VND
                        </p>

                        <div className="space-y-3">
                            {/* Wallet Payment */}
                            <button
                                onClick={() => handleBuyPackage('WALLET')}
                                className="w-full flex items-center gap-4 p-5 border-2 border-purple-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all group"
                            >
                                <div className="w-14 h-14 bg-linear-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                    <Wallet className="text-white" size={28} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-bold text-gray-900 text-lg">Thanh toán bằng Ví</p>
                                    <p className="text-sm text-gray-500">
                                        Nhanh chóng và tiện lợi
                                    </p>
                                </div>
                            </button>

                            {/* VietQR Payment */}
                            <button
                                onClick={() => handleBuyPackage('VIETQR')}
                                className="w-full flex items-center gap-4 p-5 border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                            >
                                <div className="w-14 h-14 bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                    <QrCode className="text-white" size={28} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-bold text-gray-900 text-lg">Chuyển khoản VietQR</p>
                                    <p className="text-sm text-gray-500">
                                        Quét mã QR để thanh toán
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
