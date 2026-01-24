"use client"

import { VenueFormData } from "@/app/venue/location/mylocation/create/Info"

type Props = {
  formData: VenueFormData
  setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>
}

export default function Contact({ formData, setFormData }: Props) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-6 py-10 md:px-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Thông tin liên hệ
        </h1>

        {/* Địa chỉ */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Địa chỉ của địa điểm<span className="text-pink-500"> *</span>
          </label>
          <input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Nhập tên chỗ địa điểm"
            className="w-full rounded-[8.33px] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
          />
        </div>

        {/* Google Maps */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Liên kết trên Google Maps<span className="text-pink-500"> *</span>
          </label>
          <input
            value={formData.googleMapUrl}
            onChange={(e) =>
              setFormData({ ...formData, googleMapUrl: e.target.value })
            }
            placeholder="https://maps.app.goo.gl/examplevenue"
            className="w-full rounded-[8.33px] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
          />
        </div>

        {/* Ảnh cover: tạm thời là khung, sau bạn gắn upload */}
        <div className="mb-6">
          <div className="h-40 w-full rounded-3xl bg-gray-200" />
        </div>

        {/* Hotline + Website */}
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Số điện thoại hotline<span className="text-pink-500"> *</span>
            </label>
            <input
              value={formData.hotline}
              onChange={(e) =>
                setFormData({ ...formData, hotline: e.target.value })
              }
              placeholder="03xxxxxxxx"
              className="w-full rounded-[8.33px] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Liên kết website
            </label>
            <input
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="hehe.com"
              className="w-full rounded-[8.33px] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
            />
          </div>
        </div>

        {/* Thời gian mở cửa */}
        <div className="mb-4">
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
        </div>
      </div>
    </div>
  )
}
