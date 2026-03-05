"use client";

import { useSearchParams } from "next/navigation";

export default function QRContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Thanh toán quảng cáo
      </h1>

      <p>Order ID: {orderId}</p>
    </div>
  );
}