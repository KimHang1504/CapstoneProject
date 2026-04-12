"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MapPin,
  QrCode,
  Keyboard,
  Phone,
  FileText,
  Globe,
  BadgeCheck,
} from "lucide-react";

import VoucherScan from "@/app/venue/redeem/component/VoucherScan";
import VoucherInput from "@/app/venue/redeem/component/VoucherInput";
import { VenueLocationDetail } from "@/api/venue/location/type";
import { getVenueLocationDetail } from "@/api/venue/location/api";
import Image from "next/image";

export function StaffRedeemLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-white p-6 flex items-center justify-center">
      <div className="text-center bg-white/80 backdrop-blur-sm border border-purple-100 rounded-3xl px-8 py-10 shadow-sm">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-linear-to-br from-purple-100 to-pink-100 animate-pulse" />
        <p className="text-gray-600 font-medium">Đang tải dữ liệu quầy redeem...</p>
      </div>
    </div>
  );
}

export default function StaffRedeemContent() {
  const searchParams = useSearchParams();
  const locationId = Number(searchParams.get("locationId"));
  const [activeTab, setActiveTab] = useState<"scan" | "input">("scan");
  const [location, setLocation] = useState<VenueLocationDetail | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    if (!locationId) return;

    const fetchLocationDetail = async () => {
      try {
        const res = await getVenueLocationDetail(locationId);
        setLocation(res.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết địa điểm:", error);
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchLocationDetail();
  }, [locationId]);

  if (!locationId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-white p-6 flex items-center justify-center">
        <div className="text-center bg-white border border-rose-100 rounded-3xl px-8 py-10 shadow-sm">
          <p className="text-rose-500 font-semibold text-lg">Vị trí không hợp lệ</p>
          <p className="text-sm text-gray-500 mt-2">
            Vui lòng kiểm tra lại đường dẫn hoặc chọn đúng địa điểm làm việc.
          </p>
        </div>
      </div>
    );
  }

  const statusLabel: Record<string, string> = {
    ACTIVE: "Đang hoạt động",
    INACTIVE: "Ngừng hoạt động",
    PENDING: "Chờ duyệt",
    DRAFTED: "Bản nháp",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-white p-15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN - LOCATION INFO */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-100 bg-linear-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white border border-purple-100 flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                    Venue Information
                  </p>
                  <h2 className="text-lg font-bold text-gray-900">
                    Thông tin địa điểm
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-5">
              {loadingLocation ? (
                <div className="space-y-4 animate-pulse">
                  <div className="w-full h-52 rounded-2xl bg-purple-100" />
                  <div className="h-6 w-2/3 rounded bg-pink-100" />
                  <div className="h-4 w-1/2 rounded bg-purple-100" />
                  <div className="h-4 w-full rounded bg-pink-100" />
                  <div className="h-4 w-3/4 rounded bg-purple-100" />
                </div>
              ) : (
                <div className="space-y-5">
                  {location?.coverImage?.[0] && (
                    <Image
                      src={location.coverImage[0]}
                      alt={location.name}
                      width={800}
                      height={400}
                      className="w-full h-56 md:h-72 object-cover rounded-2xl border border-purple-100"
                    />
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {location?.name || `Địa điểm #${locationId}`}
                      </h3>

                      {location?.isOwnerVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 border border-emerald-100">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Đã xác minh
                        </span>
                      )}
                    </div>

                    {location?.address && (
                      <p className="mt-2 text-sm text-gray-600 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />
                        <span>{location.address}</span>
                      </p>
                    )}
                  </div>

                  {location?.description && (
                    <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 mb-1">
                            Mô tả
                          </p>
                          <p className="text-sm text-gray-600">
                            {location.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {location?.phoneNumber && (
                      <div className="rounded-2xl border border-purple-100 bg-white p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="w-4 h-4 text-pink-500" />
                          <p className="text-sm font-semibold text-gray-800">Số điện thoại</p>
                        </div>
                        <p className="text-sm text-gray-600">{location.phoneNumber}</p>
                      </div>
                    )}

                    {location?.websiteUrl && (
                      <div className="rounded-2xl border border-purple-100 bg-white p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="w-4 h-4 text-pink-500" />
                          <p className="text-sm font-semibold text-gray-800">Website</p>
                        </div>
                        <a
                          href={
                            location.websiteUrl.startsWith("http")
                              ? location.websiteUrl
                              : `https://${location.websiteUrl}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-purple-600 hover:underline break-all"
                        >
                          {location.websiteUrl}
                        </a>
                      </div>
                    )}

                    <div className="rounded-2xl border border-purple-100 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-1">Trạng thái</p>
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                        {statusLabel[location?.status || ""] || "Không xác định"}
                      </span>
                    </div>

                    {location && (
                      <div className="rounded-2xl border border-purple-100 bg-white p-4">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Khoảng giá</p>
                        <p className="text-sm font-medium text-pink-600">
                          {location.priceMin.toLocaleString("vi-VN")} -{" "}
                          {location.priceMax?.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    )}
                  </div>

                  {location && (
                    <a
                      href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 px-4 py-3 text-sm font-medium text-purple-700 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Xem trên bản đồ
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - STAFF + REDEEM */}
          <div className="">
            <div className="bg-white/95 backdrop-blur-sm rounded-4xl border border-purple-100 shadow-sm overflow-visible">
              <div className="relative overflow-visible rounded-[30px] bg-purple-300 px-7 py-8 pr-24 md:px-8 md:py-9 md:pr-32 text-gray-700 shadow-lg min-h-55">
                {/* light overlay */}
                <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%)]" />

                {/* content */}
                <div className="relative z-10 max-w-[58%]">
                  <p className="text-sm font-semibold text-gray-500">Hi Staff,</p>

                  <h1 className="mt-2 text-3xl font-extrabold leading-tight">
                    Chào mừng quay trở lại!
                  </h1>

                  <p className="mt-3 text-base leading-7 text-gray-500">
                    Chúc bạn một ngày làm việc hiệu quả. Hãy chọn cách nhập mã voucher để hỗ trợ khách hàng nhanh chóng và chính xác.
                  </p>

                  {location?.name && (
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                      <MapPin className="w-4 h-4" />
                      {location.name}
                    </div>
                  )}
                </div>

                {/* mascot */}
                <div className="pointer-events-none absolute -right-50 -bottom-6 z-20">
                  <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />

                  <Image
                    src="/mascot.png"
                    alt="Staff welcome"
                    width={700}
                    height={320}
                    priority
                    className="relative object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              <div className="p-5">
                {/* Tabs */}
                <div className="mb-5 rounded-2xl border border-purple-100 bg-purple-50/50 p-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveTab("scan")}
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "scan"
                        ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-white"
                        }`}
                    >
                      <Keyboard className="w-4 h-4" />
                      Nhập tay
                    </button>

                    <button
                      onClick={() => setActiveTab("input")}
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "input"
                        ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-white"
                        }`}
                    >
                      <QrCode className="w-4 h-4" />
                      Quét mã QR
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="rounded-2xl border border-purple-100 bg-white p-4 md:p-5">
                  {activeTab === "scan" && (
                    <div className="animate-in fade-in duration-200">
                      <VoucherInput venueLocationId={locationId} />
                    </div>
                  )}

                  {activeTab === "input" && (
                    <div className="animate-in fade-in duration-200">
                      <VoucherScan venueLocationId={locationId} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}