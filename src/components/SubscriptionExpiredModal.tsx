  'use client';

  import { useState, useEffect } from 'react';
  import { getSubscriptionPackages, purchaseVenueOwnerSubscription } from '@/api/venue/subscription/api';
  import { SubscriptionPackage } from '@/api/venue/subscription/type';
  import { 
    Check, Wallet, QrCode, X, AlertCircle, CheckCircle2, Clock, 
    Sparkles, Shield, Crown, Star, ArrowLeft, Loader2, CreditCard, 
    Building2, ChevronRight, Banknote, Timer, TrendingUp, Zap
  } from 'lucide-react';
  import toast from 'react-hot-toast';
  import Image from 'next/image';
  import { getPaymentQrInfo, getPaymentStatus, cancelPayment } from '@/api/venue/payment/api';
  import { PaymentQrInfo } from '@/api/venue/payment/type';

  interface SubscriptionExpiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
  }

  type ModalStep = 'packages' | 'payment-method' | 'wallet-confirm' | 'wallet-processing' | 'qr-payment';

  export default function SubscriptionExpiredModal({ isOpen, onClose, message }: SubscriptionExpiredModalProps) {
    const [step, setStep] = useState<ModalStep>('packages');
    const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
    const [processingPackageId, setProcessingPackageId] = useState<number | null>(null);
    
    const [walletProgress, setWalletProgress] = useState(0);
    const [walletStatus, setWalletStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [walletError, setWalletError] = useState('');
    const [walletTransactionId, setWalletTransactionId] = useState<number | null>(null);
    
    const [qrPayment, setQrPayment] = useState<PaymentQrInfo | null>(null);
    const [transactionId, setTransactionId] = useState<number | null>(null);

    useEffect(() => {
      if (isOpen) {
        fetchPackages();
        setStep('packages');
      }
    }, [isOpen]);

    useEffect(() => {
      if (step === 'wallet-processing' && walletStatus === 'processing') {
        const duration = 5000;
        const interval = 50;
        const increment = (interval / duration) * 100;
        
        const timer = setInterval(() => {
          setWalletProgress((prev) => {
            if (prev >= 100) {
              clearInterval(timer);
              return 100;
            }
            return prev + increment;
          });
        }, interval);

        return () => clearInterval(timer);
      }
    }, [step, walletStatus]);

    useEffect(() => {
      if (step === 'qr-payment' && transactionId) {
        const interval = setInterval(async () => {
          try {
            const res = await getPaymentStatus(transactionId);
            const status = res.data.status;

            if (status === "SUCCESS") {
              clearInterval(interval);
              toast.success('Thanh toán thành công!');
              onClose();
              window.location.reload();
            }

            if (status === "FAILED" || status === "CANCELLED" || status === "EXPIRED") {
              clearInterval(interval);
              toast.error('Thanh toán thất bại');
              setStep('packages');
            }
          } catch (err) {
            console.error("Check payment error:", err);
          }
        }, 5000);

        return () => clearInterval(interval);
      }
    }, [step, transactionId, onClose]);

    // Cleanup: Cancel pending transactions on unmount
    useEffect(() => {
      return () => {
        // Cancel wallet transaction if still processing
        if (walletTransactionId && walletStatus !== 'success') {
          cancelPayment(walletTransactionId).catch(err => 
            console.error('Cleanup: Cancel wallet payment error:', err)
          );
        }
        // Cancel QR transaction if still pending
        if (transactionId && step === 'qr-payment') {
          cancelPayment(transactionId).catch(err => 
            console.error('Cleanup: Cancel QR payment error:', err)
          );
        }
      };
    }, [walletTransactionId, walletStatus, transactionId, step]);

    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await getSubscriptionPackages('VENUEOWNER');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching subscription packages:', error);
        toast.error('Không thể tải danh sách gói');
      } finally {
        setIsLoading(false);
      }
    };

    const handleSelectPackage = (pkg: SubscriptionPackage) => {
      setSelectedPackage(pkg);
      setStep('payment-method');
    };

    const handlePaymentMethod = (method: 'WALLET' | 'VIETQR') => {
      if (!selectedPackage) return;

      if (method === 'WALLET') {
        // Chuyển sang bước confirm cho wallet
        setStep('wallet-confirm');
      } else {
        // VietQR: gọi API ngay
        handleVietQRPayment();
      }
    };

    const parseErrorMessage = (errorMessage: string): string => {
      // Parse "Insufficient wallet balance. Available: 3,420 VND, Required: 4,000 VND"
      const balanceMatch = errorMessage.match(/Available:\s*([\d,]+)\s*VND.*Required:\s*([\d,]+)\s*VND/i);
      if (balanceMatch) {
        const available = balanceMatch[1];
        const required = balanceMatch[2];
        return `Số dư ví không đủ. Bạn có ${available} VND, cần ${required} VND. Vui lòng nạp thêm ${(parseInt(required.replace(/,/g, '')) - parseInt(available.replace(/,/g, ''))).toLocaleString('vi-VN')} VND.`;
      }

      // Parse other common errors
      if (errorMessage.includes('Insufficient') || errorMessage.includes('balance')) {
        return 'Số dư ví không đủ để thanh toán. Vui lòng nạp thêm tiền vào ví.';
      }
      
      if (errorMessage.includes('pending') || errorMessage.includes('transaction')) {
        return 'Bạn đang có giao dịch chưa hoàn thành. Vui lòng hoàn tất hoặc đợi giao dịch hết hạn.';
      }

      if (errorMessage.includes('expired') || errorMessage.includes('hết hạn')) {
        return 'Phiên giao dịch đã hết hạn. Vui lòng thử lại.';
      }

      // Return original message if no match
      return errorMessage;
    };

    const handleWalletConfirm = async () => {
      if (!selectedPackage) return;

      setStep('wallet-processing');
      setWalletProgress(0);
      setWalletStatus('processing');
      setProcessingPackageId(selectedPackage.id);

      try {
        const response = await purchaseVenueOwnerSubscription({
          packageId: selectedPackage.id,
          quantity: 1,
          paymentMethod: 'WALLET'
        });

        // Check response code và isSuccess
        if (response.code !== 200 || !response.data.isSuccess) {
          throw new Error(response.data.message || response.message || 'Không thể tạo thanh toán');
        }

        const payment = response.data;
        
        // Lưu transaction ID để có thể cancel sau này
        setWalletTransactionId(payment.transactionId);

        // Simulate processing
        setTimeout(() => {
          setWalletProgress(100);
          setWalletStatus('success');
          setTimeout(() => {
            toast.success('Thanh toán thành công!');
            onClose();
            window.location.reload();
          }, 1500);
        }, 3000);
      } catch (error: any) {
        const errorMessage = error?.message || 'Không thể tạo thanh toán';
        const friendlyMessage = parseErrorMessage(errorMessage);
        
        setWalletStatus('error');
        setWalletError(friendlyMessage);
        
        // Show toast with friendly message
        toast.error(friendlyMessage);
      } finally {
        setProcessingPackageId(null);
      }
    };

    const handleVietQRPayment = async () => {
      if (!selectedPackage) return;

      setProcessingPackageId(selectedPackage.id);

      try {
        const response = await purchaseVenueOwnerSubscription({
          packageId: selectedPackage.id,
          quantity: 1,
          paymentMethod: 'VIETQR'
        });

        // Check response code và isSuccess
        if (response.code !== 200 || !response.data.isSuccess) {
          throw new Error(response.data.message || response.message || 'Không thể tạo thanh toán');
        }

        const payment = response.data;
        setTransactionId(payment.transactionId);
        const qrRes = await getPaymentQrInfo(payment.transactionId);
        setQrPayment(qrRes.data);
        setStep('qr-payment');
      } catch (error: any) {
        const errorMessage = error?.message || 'Không thể tạo thanh toán';
        const friendlyMessage = parseErrorMessage(errorMessage);
        
        toast.error(friendlyMessage);
        setStep('payment-method');
      } finally {
        setProcessingPackageId(null);
      }
    };

    const handleBack = () => {
      if (step === 'payment-method') {
        setStep('packages');
        setSelectedPackage(null);
      } else if (step === 'wallet-confirm') {
        setStep('payment-method');
      } else if (step === 'qr-payment') {
        // Cancel QR transaction if exists
        if (transactionId) {
          cancelPayment(transactionId).catch(err => console.error('Cancel QR payment error:', err));
        }
        setStep('payment-method');
        setQrPayment(null);
        setTransactionId(null);
      } else if (step === 'wallet-processing') {
        // Cancel wallet transaction if exists and not success
        if (walletTransactionId && walletStatus !== 'success') {
          cancelPayment(walletTransactionId).catch(err => console.error('Cancel wallet payment error:', err));
        }
        setStep('wallet-confirm');
        setWalletStatus('processing');
        setWalletError('');
        setWalletTransactionId(null);
      }
    };

    const handleClose = () => {
      // Cancel any pending transactions before closing
      if (step === 'wallet-processing' && walletTransactionId && walletStatus !== 'success') {
        cancelPayment(walletTransactionId).catch(err => console.error('Cancel wallet payment error:', err));
      }
      if (step === 'qr-payment' && transactionId) {
        cancelPayment(transactionId).catch(err => console.error('Cancel QR payment error:', err));
      }
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 rounded-lg p-1.5"
          >
            <X size={20} />
          </button>

          {step === 'packages' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {message || 'Chọn gói phù hợp để tiếp tục trải nghiệm'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">Nâng cấp để truy cập đầy đủ tính năng</p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin text-purple-600 mb-3" size={40} />
                  <p className="text-gray-600">Đang tải gói...</p>
                </div>
              ) : packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
                  {packages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      className="relative bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      {index === 0 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <div className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                            <Sparkles size={12} />
                            Phổ biến nhất
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <Crown className="text-purple-600" size={20} />
                        </div>
                        <div className="text-right bg-gray-50 px-2.5 sm:px-3 py-1.5 rounded-lg">
                          <div className="text-xs text-gray-500 mb-0.5">Thời hạn</div>
                          <div className="text-sm sm:text-base font-bold text-gray-900">{pkg.durationDays} ngày</div>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{pkg.packageName}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 min-h-[36px] sm:min-h-[40px]">{pkg.description}</p>

                      <div className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="text-purple-600" size={14} />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-700">Truy cập toàn bộ Insight</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="text-purple-600" size={14} />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-700">Báo cáo & phân tích AI</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="text-purple-600" size={14} />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-700">Theo dõi xu hướng</span>
                        </div>
                      </div>

                      <div className="pt-4 sm:pt-5 border-t border-gray-200">
                        <div className="flex items-baseline justify-center gap-1 mb-3 sm:mb-4">
                          <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                            {pkg.price.toLocaleString('vi-VN')}
                          </span>
                          <span className="text-base sm:text-lg font-medium text-gray-500">VND</span>
                        </div>
                        
                        <button className="w-full bg-purple-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 group-hover:shadow-md text-sm sm:text-base">
                          Chọn gói này
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="text-gray-400 mx-auto mb-3" size={40} />
                  <p className="text-gray-600">Không có gói nào khả dụng</p>
                </div>
              )}
            </div>
          )}

          {step === 'payment-method' && selectedPackage && (
            <div className="p-6">
              <button 
                onClick={handleBack} 
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-xl mb-3">
                  <CreditCard className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Chọn phương thức thanh toán
                </h2>
                <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-gray-700 font-medium">{selectedPackage.packageName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xl font-bold text-gray-900">
                    {selectedPackage.price.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <button
                  onClick={() => handlePaymentMethod('WALLET')}
                  disabled={processingPackageId !== null}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Wallet className="text-purple-600" size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900">Thanh toán bằng Ví</p>
                    <p className="text-sm text-gray-600">Thanh toán nhanh chóng</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </button>

                <button
                  onClick={() => handlePaymentMethod('VIETQR')}
                  disabled={processingPackageId !== null}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <QrCode className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900">VietQR</p>
                    <p className="text-sm text-gray-600">Quét mã QR</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 'wallet-confirm' && selectedPackage && (
            <div className="p-6">
              <button 
                onClick={handleBack} 
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>

              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <Wallet className="text-purple-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Xác nhận thanh toán
                  </h2>
                  <p className="text-gray-600">Vui lòng kiểm tra thông tin trước khi thanh toán</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Gói đăng ký</span>
                    <span className="font-bold text-gray-900">{selectedPackage.packageName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Thời hạn</span>
                    <span className="font-semibold text-gray-900">{selectedPackage.durationDays} ngày</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Phương thức</span>
                    <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-purple-600" />
                      <span className="font-semibold text-gray-900">Ví điện tử</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-medium">Tổng thanh toán</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {selectedPackage.price.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <p>Số tiền sẽ được trừ trực tiếp từ ví của bạn. Vui lòng đảm bảo số dư đủ để thanh toán.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleWalletConfirm}
                    disabled={processingPackageId !== null}
                    className="w-full bg-purple-600 text-white py-3.5 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingPackageId ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                  </button>
                  
                  <button
                    onClick={handleBack}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'wallet-processing' && (
            <div className="p-6">
              <div className="max-w-md mx-auto text-center py-8">
                <div className="flex justify-center mb-6">
                  {walletStatus === 'processing' && (
                    <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
                      <Wallet className="text-white" size={40} />
                    </div>
                  )}
                  {walletStatus === 'success' && (
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="text-white" size={40} />
                    </div>
                  )}
                  {walletStatus === 'error' && (
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="text-white" size={40} />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {walletStatus === 'processing' && 'Đang xử lý thanh toán...'}
                  {walletStatus === 'success' && 'Thanh toán thành công!'}
                  {walletStatus === 'error' && 'Thanh toán thất bại'}
                </h2>

                {walletStatus === 'processing' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-purple-600 transition-all duration-300 rounded-full"
                        style={{ width: `${walletProgress}%` }}
                      />
                    </div>
                    <p className="text-sm font-mono text-gray-700">{Math.round(walletProgress)}%</p>
                  </div>
                )}

                {walletStatus === 'success' && (
                  <div className="space-y-3">
                    <p className="text-green-600">Đang chuyển hướng...</p>
                    <Loader2 className="animate-spin text-green-600 mx-auto" size={24} />
                  </div>
                )}

                {walletStatus === 'error' && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="text-red-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-red-900 mb-1">Không thể thanh toán</h3>
                          <p className="text-sm text-red-700 leading-relaxed">{walletError}</p>
                        </div>
                      </div>
                      
                      {walletError.includes('Số dư ví không đủ') && (
                        <div className="mt-4 pt-4 border-t border-red-200">
                          <p className="text-sm text-red-800 mb-3 font-medium">Bạn có thể:</p>
                          <div className="space-y-2 text-sm text-red-700">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                              <span>Nạp thêm tiền vào ví</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                              <span>Chọn phương thức thanh toán VietQR</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={handleBack} 
                      className="w-full bg-gray-600 text-white py-3.5 rounded-lg font-bold hover:bg-gray-700 transition-colors"
                    >
                      Thử phương thức khác
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'qr-payment' && qrPayment && (
            <div className="p-6">
              <button 
                onClick={handleBack} 
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-xl mb-3">
                  <QrCode className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Quét mã thanh toán</h2>
                <p className="text-gray-600">Sử dụng ứng dụng ngân hàng của bạn</p>
              </div>

              <div className="max-w-2xl mx-auto grid md:grid-cols-[300px_1fr] gap-6">
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-200 mb-4">
                    <Image 
                      src={qrPayment.qrCodeUrl} 
                      alt="QR Code" 
                      width={260} 
                      height={260} 
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                    <Loader2 className="text-blue-600 animate-spin" size={16} />
                    <span className="text-sm text-blue-900 font-medium">Đang chờ thanh toán...</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-3">
                  <div className="bg-purple-600 rounded-lg p-4 text-white">
                    <div className="text-sm mb-1 opacity-90">Số tiền thanh toán</div>
                    <div className="text-3xl font-bold">
                      {qrPayment.amount.toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Nội dung chuyển khoản</div>
                    <div className="bg-white px-3 py-2 rounded border border-gray-200">
                      <p className="font-mono text-sm font-semibold text-gray-900">{qrPayment.paymentContent}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-amber-600" size={16} />
                      <span className="text-sm font-medium text-amber-900">Hết hạn lúc</span>
                    </div>
                    <p className="text-amber-800 font-semibold">
                      {new Date(qrPayment.expireAt).toLocaleString('vi-VN')}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="text-gray-600" size={16} />
                      <span className="text-sm font-bold text-gray-900">Chuyển khoản thủ công</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngân hàng</span>
                        <span className="font-semibold text-gray-900">{qrPayment.bankInfo.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">STK</span>
                        <span className="font-mono font-semibold text-gray-900">{qrPayment.bankInfo.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chủ TK</span>
                        <span className="font-semibold text-gray-900">{qrPayment.bankInfo.accountName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
