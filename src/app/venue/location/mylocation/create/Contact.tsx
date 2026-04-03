"use client"

import { VenueFormData } from "@/app/venue/location/mylocation/create/Info"
import { geocodeAddress, reverseGeocode } from "@/api/geocode/nominatim";
import { useState } from "react";
import dynamic from "next/dynamic";

// Lazy load MapPicker để tránh lỗi SSR với Leaflet
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

type Props = {
  formData: VenueFormData
  setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>
}

export default function Contact({ formData, setFormData }: Props) {
  const [isMapLoading, setIsMapLoading] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  const handleAddressBlur = async () => {
    if (!formData.address) return

    try {
      setIsMapLoading(true)
      setMapError(null)

      const { lat, lon } = await geocodeAddress(formData.address)

      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
      }))
    } catch {
      setMapError("Không xác định được vị trí từ địa chỉ này")
    } finally {
      setIsMapLoading(false)
    }
  }

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
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-900">
          Thông tin liên hệ
        </h1>

        {/* Địa chỉ */}
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Địa chỉ của địa điểm<span className="text-pink-500"> *</span>
          </label>
          <input
            className="w-full rounded-lg border border-[#E4D7FF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C9A7FF]"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            onBlur={handleAddressBlur}
            placeholder="Nhập địa chỉ hoặc click vào bản đồ để chọn vị trí"
          />

          {mapError && (
            <p className="mt-1.5 text-sm text-red-500">{mapError}</p>
          )}

          {isMapLoading ? (
            <div className="mt-3 h-80 w-full rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-500">
              Đang tải bản đồ...
            </div>
          ) : (
            <>
              <p className="mt-1.5 text-xs text-gray-500">
                💡 Click vào bản đồ để chọn vị trí chính xác
              </p>
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
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Số điện thoại hotline
            </label>
            <input
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="03xxxxxxxx"
              className="w-full rounded-lg border border-[#E4D7FF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C9A7FF]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="hehe@gmail.com"
              className="w-full rounded-lg border border-[#E4D7FF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C9A7FF]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Liên kết website
            </label>
            <input
              value={formData.websiteUrl}
              onChange={(e) =>
                setFormData({ ...formData, websiteUrl: e.target.value })
              }
              placeholder="hehe.com"
              className="w-full rounded-lg border border-[#E4D7FF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C9A7FF]"
            />
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
