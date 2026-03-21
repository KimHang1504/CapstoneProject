"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentQrInfoLocation } from "@/api/venue/location/type";
import { getPaymentQrInfo } from "@/api/venue/location/api";
import { getPaymentStatus } from "@/api/venue/payment/api";
import { cancelPayment } from "@/api/venue/payment/api";

export default function QRContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const locationId = searchParams.get("locationId");
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentQrInfoLocation | null>(null);
  console.log("QR payment:", payment);

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

        console.log("Payment status:", status);

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

  if (!payment) {
    return (
      <div className="flex items-center justify-center bg-[#faf7ff]">
        <p className="text-purple-400 animate-pulse">
          Đang chuẩn bị thanh toán...
        </p>
      </div>
    );
  }

  return (
    <div className=" bg-[#faf7ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-purple-100 p-6">

        {/* Title */}
        <h1 className="text-xl font-semibold text-purple-700 text-center mb-5">
          Thanh toán
        </h1>

        {/* QR */}
        <Image
          src={payment.qrCodeUrl}
          alt="QR code for payment"
          width={240}
          height={240}
          className="mx-auto mb-5 rounded-lg border border-purple-100"
        />

        {/* Info */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Số tiền</span>
            <span className="font-semibold text-purple-600">
              {payment.amount.toLocaleString()} đ
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Ngân hàng</span>
            <span className="text-gray-800">
              {payment.bankInfo.BankName}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Số TK</span>
            <span className="text-gray-800">
              {payment.bankInfo.AccountNumber}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Chủ TK</span>
            <span className="text-gray-800">
              {payment.bankInfo.AccountName}
            </span>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Nội dung CK</p>
            <p className="text-gray-800 break-words">
              {payment.paymentContent}
            </p>
          </div>
        </div>

        {/* Status */}
        <p className="text-center text-xs text-purple-400 mt-4">
          Đang chờ thanh toán...
        </p>

        {/* Button */}
        <div
          onClick={handleCancelPayment}
          className="mt-6 w-full text-center py-3 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
        >
          Hủy thanh toán
        </div>
      </div>
    </div>
  );
}