"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import VoucherScan from "@/app/venue/redeem/component/VoucherScan";
import VoucherInput from "@/app/venue/redeem/component/VoucherInput";

export default function StaffRedeemPage() {
  const searchParams = useSearchParams();
  const locationId = Number(searchParams.get("locationId"));
  const [activeTab, setActiveTab] = useState<"scan" | "input">("scan");

  if (!locationId) {
    return (
      <div className="min-h-screen p-6 max-w-xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Vị trí không hợp lệ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Quét / nhập mã voucher
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Chọn cách để nhập mã voucher
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("scan")}
            className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "scan"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            📱 Quét mã QR
          </button>
          <button
            onClick={() => setActiveTab("input")}
            className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "input"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            ⌨️ Nhập tay
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {activeTab === "scan" && (
          <div className="animate-in fade-in duration-200">
            <VoucherScan venueLocationId={locationId} />
          </div>
        )}

        {activeTab === "input" && (
          <div className="animate-in fade-in duration-200">
            <VoucherInput venueLocationId={locationId} />
          </div>
        )}
      </div>
    </div>
  );
}