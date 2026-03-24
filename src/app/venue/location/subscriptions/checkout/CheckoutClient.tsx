"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentQrInfoLocation } from "@/api/venue/location/type";
import { getPaymentQrInfo } from "@/api/venue/location/api";
import { getPaymentStatus } from "@/api/venue/payment/api";
import { cancelPayment } from "@/api/venue/payment/api";
import { QrCode, Clock, X } from "lucide-react";

export default function QRContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const locationId = searchParams.get("locationId");
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentQrInfoLocation | null>(null);

  useEffect(() => {
    if (!transactionId) return;

    const fetchQr = async () => {
      const res = await getPaymentQrInfo(Number(transactionId));
      setPayment(res.data);
    };

    fetchQr();
  }, [transactionId]);

  useEffect(() => {
    if (!transactionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getPaymentStatus(Number(transactionId));
        const status = res.data.status;

        if (status === "SUCCESS") {
          clearInterval(interval);
          router.push(
            `/payment/success?transactionId=${transactionId}&type=location&locationId=${locationId}`
          );
        }

        if (
          status === "FAILED" ||
          status === "CANCELLED" ||
          status === "EXPIRED"
        ) {
          clearInterval(interval);
          router.push(
            `/payment/failure?transactionId=${transactionId}&type=location&locationId=${locationId}`
          );
        }
      } catch (err) {
        console.error("Check payment error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [transactionId, router, locationId]);

  const handleCancelPayment = async () => {
    if (!transactionId) return;

    try {
      await cancelPayment(Number(transactionId));
      router.push(`/venue/location/mylocation/${locationId}`);
    } catch (err) {
      console.error("Cancel payment error:", err);
      alert("Không thể hủy thanh toán");
    }
  };

  useEffect(() => {
    if (!transactionId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handlePopState = async () => {
      const confirmLeave = window.confirm(
        "Nếu bạn thoát đơn hàng sẽ bị hủy"
      );

      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.href);
      } else {
        try {
          await cancelPayment(Number(transactionId));
        } catch (err) {
          console.error("Auto cancel error:", err);
        }
      }
    };

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [transactionId]);

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-purple-600 font-medium animate-pulse">
            Đang chuẩn bị thanh toán...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl mb-2 shadow-lg">
            <QrCode className="text-white" size={24} />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            Quét mã QR để thanh toán
          </h1>
          <p className="text-gray-500 text-xs">
            Sử dụng ứng dụng ngân hàng để quét mã
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
          
          <div className="grid md:grid-cols-2 gap-0">
            {/* QR Section */}
            <div className="relative p-4 md:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
              <div className="relative w-full max-w-[280px] aspect-square">
              <div className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl shadow-lg p-4">
                <Image
                  src={payment.qrCodeUrl}
                  alt="QR code for payment"
                  width={240}
                  height={240}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-75 animate-scan" />
              </div>

              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-purple-500 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-purple-500 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-purple-500 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-purple-500 rounded-br-2xl" />
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4 md:p-6 space-y-3 flex flex-col justify-between">
            <div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-100 mb-3">
                <p className="text-xs text-gray-500 mb-1">Số tiền thanh toán</p>
                <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {payment.amount.toLocaleString()} ₫
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Ngân hàng</span>
                  <span className="font-semibold text-gray-900">
                    {payment.bankInfo.BankName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Số tài khoản</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {payment.bankInfo.AccountNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Chủ tài khoản</span>
                  <span className="font-semibold text-gray-900">
                    {payment.bankInfo.AccountName}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-gray-500 mb-1.5">Nội dung chuyển khoản</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <p className="font-mono text-xs text-amber-900 break-all">
                      {payment.paymentContent}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 py-1.5">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-purple-600 font-medium">Đang chờ thanh toán</span>
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              
              <button
                onClick={handleCancelPayment}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all duration-200 group"
              >
                <X size={14} className="group-hover:rotate-90 transition-transform duration-200" />
                Hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
          <p className="text-xs text-gray-400">
            Giao dịch được bảo mật và xử lý tự động
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}