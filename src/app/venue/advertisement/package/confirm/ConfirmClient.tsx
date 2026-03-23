"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { submitAdvertisementPayment } from "@/api/venue/advertisement/api";

export default function ConfirmClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("packageId");
  const advertisementId = searchParams.get("advertisementId");
  const venueIds = searchParams.get("venueIds");

  const [status, setStatus] = useState<"confirming" | "processing" | "success" | "error">("confirming");
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirm = async () => {
    if (!packageId || !advertisementId || !venueIds) {
      setErrorMessage("Không tìm thấy thông tin gói quảng cáo");
      setStatus("error");
      return;
    }

    setStatus("processing");

    try {
      const venueIdArray = venueIds.split(",").map(id => Number(id));
      
      const response = await submitAdvertisementPayment(Number(advertisementId), {
        packageId: Number(packageId),
        venueIds: venueIdArray,
        paymentMethod: 'WALLET'
      });

      console.log('Wallet payment response:', response);
      
      if (!response.data || !response.data.transactionId) {
        throw new Error('Thanh toán thất bại, vui lòng thử lại');
      }
      
      const payment = response.data;

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === "confirming" && (
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <Wallet className="text-purple-600" size={40} />
              </div>
            )}
            {status === "processing" && (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="text-blue-600 animate-spin" size={40} />
              </div>
            )}
            {status === "success" && (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={40} />
              </div>
            )}
            {status === "error" && (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-3xl">✕</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {status === "confirming" && "Xác nhận thanh toán"}
            {status === "processing" && "Đang xử lý"}
            {status === "success" && "Thành công!"}
            {status === "error" && "Lỗi"}
          </h1>

          {/* Description */}
          <p className="text-center text-gray-500 mb-6">
            {status === "confirming" && "Vui lòng xác nhận thanh toán quảng cáo bằng ví của bạn"}
            {status === "processing" && "Đang xử lý giao dịch, vui lòng đợi..."}
            {status === "success" && "Thanh toán đã được xử lý thành công"}
            {status === "error" && errorMessage}
          </p>

          {/* Actions */}
          {status === "confirming" && (
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition shadow-lg"
              >
                Xác nhận thanh toán
              </button>
              <button
                onClick={() => router.back()}
                className="w-full py-4 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Hủy
              </button>
            </div>
          )}

          {status === "processing" && (
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ width: "70%" }}></div>
              </div>
              <p className="text-center text-sm text-gray-400">
                Đang xử lý thanh toán...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                Đang chuyển hướng...
              </div>
            </div>
          )}

          {status === "error" && (
            <button
              onClick={() => router.back()}
              className="w-full py-4 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Quay lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
