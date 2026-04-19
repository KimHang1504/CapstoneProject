"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Wallet, CheckCircle2, XCircle } from "lucide-react";
import { submitAdvertisementPayment } from "@/api/venue/advertisement/api";

export default function ConfirmClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("packageId");
  const advertisementId = searchParams.get("advertisementId");
  const venueIds = searchParams.get("venueIds");
  const quantityParam = searchParams.get("quantity");

  const [status, setStatus] = useState<"confirming" | "processing" | "success" | "error">("confirming");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === "processing") {
      const duration = 5000;
      const interval = 50;
      const increment = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + increment;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [status]);

  const handleConfirm = async () => {
    if (!packageId || !advertisementId || !venueIds) {
      setErrorMessage("Không tìm thấy thông tin gói quảng cáo");
      setStatus("error");
      return;
    }

    setStatus("processing");
    setProgress(0);

    try {
      const venueIdArray = venueIds.split(",").map(id => Number(id));
      const quantity = quantityParam ? Math.max(1, Math.min(200, Math.trunc(Number(quantityParam)))) : 1;
      
      const response = await submitAdvertisementPayment(Number(advertisementId), {
        packageId: Number(packageId),
        venueIds: venueIdArray,
        quantity,
        paymentMethod: 'WALLET'
      });
      
      if (!response.data || !response.data.transactionId) {
        throw new Error('Thanh toán thất bại, vui lòng thử lại');
      }
      
      const payment = response.data;

      await new Promise(resolve => setTimeout(resolve, 5000));
      
      setProgress(100);
      setStatus("success");
      
      setTimeout(() => {
        router.push(
          `/payment/success?transactionId=${payment.transactionId}&type=advertisement&advertisementId=${advertisementId}`
        );
      }, 1500);

    } catch (error: any) {
      console.error("Confirm payment error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi xác nhận thanh toán";
      
      if (errorMsg.includes('pending') || errorMsg.includes('transaction')) {
        setErrorMessage('Bạn đang có giao dịch chưa hoàn thành. Vui lòng hoàn tất hoặc đợi giao dịch hết hạn.');
      } else if (errorMsg.includes('balance') || errorMsg.includes('insufficient')) {
        setErrorMessage('Số dư ví không đủ để thực hiện giao dịch');
      } else {
        setErrorMessage(errorMsg);
      }
      
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
          
          {/* Icon Section */}
          <div className="relative pt-8 pb-6 bg-linear-to-br from-purple-50 to-indigo-50">
            <div className="flex justify-center mb-3">
              {status === "confirming" && (
                <div className="relative">
                  <div className="w-24 h-24 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Wallet className="text-white" size={48} />
                  </div>
                  <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-20" />
                </div>
              )}
              {status === "processing" && (
                <div className="relative">
                  <div className="w-24 h-24 bg-linear-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Wallet className="text-white animate-pulse" size={48} />
                  </div>
                  <svg className="absolute inset-0 w-24 h-24 -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-blue-200"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                      className="text-blue-600 transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
              {status === "success" && (
                <div className="relative">
                  <div className="w-24 h-24 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-once">
                    <CheckCircle2 className="text-white" size={48} />
                  </div>
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
                </div>
              )}
              {status === "error" && (
                <div className="w-24 h-24 bg-linear-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg animate-shake">
                  <XCircle className="text-white" size={48} />
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-2 px-4">
              {status === "confirming" && "Xác nhận thanh toán"}
              {status === "processing" && "Đang xử lý"}
              {status === "success" && "Thành công!"}
              {status === "error" && "Thanh toán thất bại"}
            </h1>

            {/* Description */}
            <p className="text-center text-gray-600 px-6 text-sm md:text-base">
              {status === "confirming" && "Vui lòng xác nhận thanh toán quảng cáo bằng ví của bạn"}
              {status === "processing" && "Đang xử lý giao dịch, vui lòng đợi..."}
              {status === "success" && "Thanh toán đã được xử lý thành công"}
              {status === "error" && errorMessage}
            </p>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Actions */}
            {status === "confirming" && (
              <div className="space-y-3">
                <button
                  onClick={handleConfirm}
                  className="w-full py-4 bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Xác nhận thanh toán
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Hủy
                </button>
              </div>
            )}

            {status === "processing" && (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Đang xử lý</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
                    </div>
                  </div>
                </div>

                {/* Processing Steps */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${progress > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={progress > 0 ? 'text-green-600 font-medium' : ''}>Kiểm tra số dư</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${progress > 33 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={progress > 33 ? 'text-green-600 font-medium' : ''}>Xác thực giao dịch</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${progress > 66 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={progress > 66 ? 'text-green-600 font-medium' : ''}>Hoàn tất thanh toán</span>
                  </div>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 text-green-600 text-sm bg-green-50 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  Đang chuyển hướng...
                </div>
              </div>
            )}

            {status === "error" && (
              <button
                onClick={() => router.back()}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Quay lại
              </button>
            )}
          </div>
        </div>

        {/* Footer Note */}
        {status === "processing" && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Vui lòng không tắt trình duyệt trong quá trình xử lý
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
