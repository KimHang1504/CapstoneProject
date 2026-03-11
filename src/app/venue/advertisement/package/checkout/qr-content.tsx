"use client";

import { getPaymentQrInfo, getPaymentStatus, cancelPayment } from "@/api/venue/payment/api";
import { PaymentQrInfo } from "@/api/venue/payment/type";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QRContent() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get("transactionId");
    const type = searchParams.get("type");
    const router = useRouter();

    const [payment, setPayment] = useState<PaymentQrInfo | null>(null);
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
                        `/payment/success?transactionId=${transactionId}&type=${type}`
                    );
                }

                if (
                    status === "FAILED" ||
                    status === "CANCELLED" ||
                    status === "EXPIRED"
                ) {
                    clearInterval(interval);

                    router.push(
                        `/payment/failure?transactionId=${transactionId}&type=${type}`
                    );
                }
            } catch (err) {
                console.error("Check payment error:", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [transactionId, router, type]);

    const handleCancel = async () => {
        if (!transactionId) return;

        try {
            await cancelPayment(Number(transactionId));

            router.push(
                `/payment/failure?transactionId=${transactionId}&type=${type}`
            );
        } catch (error) {
            console.error("Cancel payment error:", error);
            alert("Không thể huỷ thanh toán");
        }
    };

    if (!payment) return <div>Loading...</div>;

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

      <h1 className="text-2xl font-bold text-center mb-6">
        Thanh toán quảng cáo
      </h1>

      {/* QR CODE */}
      <div className="flex justify-center mb-6">
        <Image
          src={payment.qrCodeUrl}
          alt="QR code for payment"
          width={260}
          height={260}
          className="rounded-lg border"
        />
      </div>

      {/* PAYMENT INFO */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">Số tiền</span>
          <span className="font-semibold">
            {payment.amount.toLocaleString()} đ
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Nội dung CK</span>
          <span className="font-semibold">
            {payment.paymentContent}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Ngân hàng</span>
          <span>{payment.bankInfo.bankName}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Số TK</span>
          <span>{payment.bankInfo.accountNumber}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Chủ TK</span>
          <span>{payment.bankInfo.accountName}</span>
        </div>

      </div>

      {/* NOTE */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Sau khi chuyển khoản thành công hệ thống sẽ tự động xác nhận.
      </p>

      {/* CANCEL BUTTON */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Huỷ thanh toán
        </button>
      </div>

    </div>
  </div>
);
}