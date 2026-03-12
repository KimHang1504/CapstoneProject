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

  if (!payment) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Thanh toán
      </h1>

      <Image
        src={payment.qrCodeUrl}
        alt="QR code for payment"
        width={256}
        height={256}
        className="w-64 mx-auto mb-6"
      />

      <div className="space-y-2">
        <p>
          <b>Số tiền:</b> {payment.amount.toLocaleString()} đ
        </p>

        <p>
          <b>Nội dung CK:</b> {payment.paymentContent}
        </p>

        <p>
          <b>Ngân hàng:</b> {payment.bankInfo.BankName}
        </p>

        <p>
          <b>Số TK:</b> {payment.bankInfo.AccountNumber}
        </p>

        <p>
          <b>Chủ TK:</b> {payment.bankInfo.AccountName}
        </p>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleCancelPayment}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Hủy thanh toán
        </button>
      </div>
    </div>
  );
}