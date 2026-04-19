"use client"

import { VenueFormData } from "@/app/venue/location/mylocation/create/Info"
import { geocodeAddress, reverseGeocode } from "@/api/geocode/nominatim";
import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Phone, Mail, Globe, Loader2 } from "lucide-react";

// Lazy load MapPicker để tránh lỗi SSR với Leaflet
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

type Props = {
  formData: VenueFormData
  setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>
}

export default function Contact({ formData, setFormData }: Props) {
  const [isMapLoading, setIsMapLoading] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    address: "",
    phone: "",
    email: "",
    website: ""
  });

  const [touched, setTouched] = useState({
    address: false,
    phone: false,
    email: false,
    website: false
  });

  const handleAddressBlur = async () => {
    setTouched(prev => ({ ...prev, address: true }));

    const value = formData.address;

    // validate required trước
    if (!value.trim()) {
      setErrors(prev => ({
        ...prev,
        address: "Không được để trống"
      }));
      return;
    }

    // clear lỗi nếu ok
    setErrors(prev => ({
      ...prev,
      address: ""
    }));

    // gọi API
    try {
      setIsMapLoading(true);
      setMapError(null);

      const { lat, lon } = await geocodeAddress(value);

      setFormData(prev => ({
        ...prev,
        latitude: lat,
        longitude: lon,
      }));
    } catch {
      setMapError("Không xác định được vị trí từ địa chỉ này");
    } finally {
      setIsMapLoading(false);
    }
  };

  const handlePhoneBlur = (value: string) => {
    setTouched(prev => ({ ...prev, phone: true }));

    const err = validatePhone(value);
    setErrors(prev => ({ ...prev, phone: err }));
  };

  const handleEmailBlur = (value: string) => {
    setTouched(prev => ({ ...prev, email: true }));

    const err = validateEmail(value);
    setErrors(prev => ({ ...prev, email: err }));
  };

  const handleWebsiteBlur = (value: string) => {
    setTouched(prev => ({ ...prev, website: true }));

    const err = validateWebsite(value);
    setErrors(prev => ({ ...prev, website: err }));
  };

  const validateAddress = (value: string) => {
    if (!value.trim()) return "Không được để trống";
    return "";
  };

  const validatePhone = (value: string) => {
    if (!value) return "";
    if (!/^(0|\+84)[0-9]{9,10}$/.test(value)) {
      return "Số điện thoại không hợp lệ";
    }
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Email không hợp lệ";
    }
    return "";
  };

  const validateWebsite = (value: string) => {
    if (!value) return "";
    if (!/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/.test(value)) {
      return "Website không hợp lệ";
    }
    return "";
  };

  const handleMapClick = async (lat: number, lon: number) => {
    try {
      setIsMapLoading(true)
      setMapError(null)

      const { displayName } = await reverseGeocode(lat, lon)

      setFormData((prev) => ({
        ...prev,
        address: displayName,
        latitude: lat,
        longitude: lon,
      }))
    } catch {
      setMapError("Không lấy được địa chỉ từ vị trí này")
      // Vẫn lưu tọa độ dù không lấy được địa chỉ
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
      }))
    } finally {
      setIsMapLoading(false)
    }
  }


  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 mb-3 shadow-lg">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900">
            Thông tin liên hệ
          </h1>
          <p className="text-sm text-gray-500 mt-1">Thêm thông tin liên lạc và vị trí của bạn</p>
        </div>

        {/* Địa chỉ */}
        <div className="mb-3">
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <MapPin className="w-4 h-4 text-blue-500" />
            Địa chỉ của địa điểm<span className="text-pink-500"> *</span>
          </label>
          <div className="relative">
            <input
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all
    ${errors.address && touched.address
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#E4D7FF] focus:border-[#C9A7FF] focus:ring-2 focus:ring-blue-100"
                }`}
              value={formData.address}
              onChange={(e) => {
                const value = e.target.value;

                setFormData({ ...formData, address: value });

                if (touched.address) {
                  if (!value.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      address: "Không được để trống"
                    }));
                  } else {
                    setErrors(prev => ({
                      ...prev,
                      address: ""
                    }));
                  }
                }
              }}
              onBlur={handleAddressBlur}
              placeholder="Nhập địa chỉ hoặc click vào bản đồ để chọn vị trí"
            />
            {errors.address && touched.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

          {mapError && (
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              <span>⚠️</span>
              <p>{mapError}</p>
            </div>
          )}

          {isMapLoading ? (
            <div className="mt-3 h-80 w-full rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center text-sm text-gray-500 border border-purple-100">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
              <p>Đang tải bản đồ...</p>
            </div>
          ) : (
            <>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <p>Click vào bản đồ để chọn vị trí chính xác</p>
              </div>
              <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={handleMapClick}
              />
            </>
          )}
        </div>

        {/* Hotline + Website + Email */}
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
              <Phone className="w-4 h-4 text-green-500" />
              Số điện thoại hotline
            </label>
            <input
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value;

                setFormData({ ...formData, phoneNumber: value });

                if (touched.phone) {
                  const err = validatePhone(value);
                  setErrors(prev => ({ ...prev, phone: err }));
                }
              }}
              onBlur={(e) => handlePhoneBlur(e.target.value)}
              placeholder="03xxxxxxxx"
              className={`w-full rounded-[8.33px] border px-4 py-3 text-sm outline-none
  ${errors.phone && touched.phone
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#E4D7FF] focus:border-[#C9A7FF]"
                }`}
            />

            {errors.phone && touched.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
              <Globe className="w-4 h-4 text-blue-500" />
              Liên kết website
            </label>
            <input
              value={formData.websiteUrl}
              onChange={(e) => {
                const value = e.target.value;

                setFormData({ ...formData, websiteUrl: value });

                if (touched.website) {
                  const err = validateWebsite(value);
                  setErrors(prev => ({ ...prev, website: err }));
                }
              }}
              onBlur={(e) => handleWebsiteBlur(e.target.value)}
              placeholder="hehe.com"
              className={`w-full rounded-[8.33px] border px-4 py-3 text-sm outline-none
  ${errors.website && touched.website
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#E4D7FF] focus:border-[#C9A7FF]"
                }`}
            />

            {errors.website && touched.website && (
              <p className="mt-1 text-xs text-red-500">{errors.website}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              value={formData.email}
              onChange={(e) => {
                const value = e.target.value;

                setFormData({ ...formData, email: value });

                if (touched.email) {
                  const err = validateEmail(value);
                  setErrors(prev => ({ ...prev, email: err }));
                }
              }}
              onBlur={(e) => handleEmailBlur(e.target.value)}
              placeholder="hehe@gmail.com"
              className={`w-full rounded-[8.33px] border px-4 py-3 text-sm outline-none
  ${errors.email && touched.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#E4D7FF] focus:border-[#C9A7FF]"
                }`}
            />

            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Thời gian mở cửa */}
        {/* <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Thời gian mở cửa<span className="text-pink-500"> *</span>
          </label>
          <div className="flex flex-wrap gap-3">
            <input
              value={formData.openTime}
              onChange={(e) =>
                setFormData({ ...formData, openTime: e.target.value })
              }
              placeholder="08:00-22:00"
              className="w-40 rounded-[8.33px] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
            />
            <input
              value={formData.openDays}
              onChange={(e) =>
                setFormData({ ...formData, openDays: e.target.value })
              }
              placeholder="Thứ 2- Thứ 6"
              className="w-40 rounded-[8.33px] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
            />
          </div>
        </div> */}
      </div>
    </div>
  )
}
