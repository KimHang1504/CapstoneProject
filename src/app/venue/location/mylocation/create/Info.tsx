'use client';

import { useEffect, useState } from "react";
import { getCoupleMoodTypes, getCouplePersonalityTypes } from "@/api/mood/api";
import {
  CoupleMoodType,
  CouplePersonalityType,
} from "@/api/mood/type";
import CategoryDropdown from "@/app/venue/location/mylocation/create/CategoryDropdown";
import { Info as InfoCircle } from "lucide-react";


export type VenueFormData = {
  name: string
  description: string
  selectedCategories: number[]
  address: string
  email: string
  phoneNumber: string
  websiteUrl?: string

  priceMin: number
  priceMax: number

  latitude: number
  longitude: number

  coverImage: File | string | null
  interiorImage: (File | string)[]
  fullPageMenuImage: (File | string)[]

  selectedMoods: number[]
  selectedStyles: number[]

  // For edit mode - existing URLs
  existingCoverUrl?: string | null
  existingInteriorUrls?: string[]
  existingMenuUrls?: string[]
  businessLicense?: File | null
  existingBusinessLicenseUrl?: string | null
}




type Props = {
  formData: VenueFormData
  setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>
}


export default function Info({ formData, setFormData }: Props) {

  const [moods, setMoods] = useState<CoupleMoodType[]>([]);
  const [styles, setStyles] = useState<CouplePersonalityType[]>([]);
  

  useEffect(() => {
    async function fetchData() {
      try {

        const [moodRes, styleRes] = await Promise.all([
          getCoupleMoodTypes(),
          getCouplePersonalityTypes()
        ])

        setMoods(moodRes.data)
        setStyles(styleRes.data)

      } finally {
      }
    }

    fetchData()
  }, [])

  function toggleItem(
    list: number[],
    id: number,
    key: "selectedMoods" | "selectedStyles"
  ) {
    setFormData(prev => ({
      ...prev,
      [key]: list.includes(id)
        ? list.filter(i => i !== id)
        : [...list, id],
    }));
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-3xl rounded-3xl  px-6 py-6 md:px-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-blue-900">
          Thông tin địa điểm
        </h1>

        {/* Tên địa điểm */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Tên địa điểm<span className="text-pink-500"> *</span>
          </label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên chủ địa điểm"
            className="w-full rounded-[8.33] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
          />
        </div>

        {/* Mô tả ngắn */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Mô tả ngắn<span className="text-pink-500"> *</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Mô tả ngắn gọn về địa điểm tối đa 150 kí tự"
            className="w-full rounded-[8.33] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-800">
            Danh mục
          </label>

          <CategoryDropdown
            selected={formData.selectedCategories}
            onChange={(ids) =>
              setFormData({
                ...formData,
                selectedCategories: ids
              })
            }
          />
        </div>

        {/* Giá cả */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-800">
            Khoảng giá
          </label>

          <div className="grid grid-cols-2 gap-4">

            {/* PRICE MIN */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₫
              </span>
              <input
                type="number"
                value={formData.priceMin || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priceMin: Number(e.target.value),
                  })
                }
                placeholder="Tối thiểu"
                className="w-full pl-7 rounded-lg border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
              />
            </div>

            {/* PRICE MAX */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₫
              </span>
              <input
                type="number"
                value={formData.priceMax || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priceMax: Number(e.target.value),
                  })
                }
                placeholder="Tối đa"
                className="w-full pl-7 rounded-lg border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
              />
            </div>

          </div>

          <p className="text-xs text-gray-400 mt-2">
            Ví dụ: 50.000đ - 200.000đ
          </p>
        </div>
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium">
            Thẻ tâm trạng
          </label>

          <div className="flex flex-wrap gap-3">
            {moods.map(mood => {
              const active = formData.selectedMoods.includes(mood.id);

              return (
                <div key={mood.id} className="relative group">
                  <button
                    type="button"
                    onClick={() =>
                      toggleItem(
                        formData.selectedMoods,
                        mood.id,
                        "selectedMoods"
                      )
                    }
                    className={`rounded-full px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-all duration-200
            ${active
                        ? "bg-[#9f5ff2] text-white shadow-md hover:shadow-lg hover:scale-105"
                        : "bg-white border border-[#E4D7FF] hover:border-[#9f5ff2] hover:shadow-sm"
                      }`}
                  >
                    {mood.name.toLowerCase()}
                    <InfoCircle size={12} className={`transition-opacity ${active ? 'opacity-80' : 'opacity-40'}`} />
                  </button>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 pointer-events-none">
                    <div className="relative bg-linear-to-br from-purple-600 via-purple-700 to-purple-800 text-white text-xs rounded-lg px-3.5 py-2.5 shadow-xl border border-purple-500/30 backdrop-blur-sm min-w-50 max-w-70">
                      <p className="font-semibold mb-1 text-purple-100">{mood.name}</p>
                      <p className="text-purple-50/90 leading-relaxed text-[11px]">{mood.description}</p>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2">
                        <div className="border-[5px] border-transparent border-t-purple-700" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium">
            Thẻ tính cách
          </label>

          <div className="flex flex-wrap gap-3">
            {styles.map(style => {
              const active = formData.selectedStyles.includes(style.id);

              return (
                <div key={style.id} className="relative group">
                  <button
                    type="button"
                    onClick={() =>
                      toggleItem(
                        formData.selectedStyles,
                        style.id,
                        "selectedStyles"
                      )
                    }
                    className={`rounded-full px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-all duration-200
            ${active
                        ? "bg-[#7C4DFF] text-white shadow-md hover:shadow-lg hover:scale-105"
                        : "bg-white border border-[#E4D7FF] hover:border-[#7C4DFF] hover:shadow-sm"
                      }`}
                  >
                    {style.name.toLowerCase()}
                    <InfoCircle size={12} className={`transition-opacity ${active ? 'opacity-80' : 'opacity-40'}`} />
                  </button>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 pointer-events-none">
                    <div className="relative bg-linear-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white text-xs rounded-lg px-3.5 py-2.5 shadow-xl border border-indigo-500/30 backdrop-blur-sm min-w-50 max-w-70">
                      <p className="font-semibold mb-1 text-indigo-100">{style.name}</p>
                      <p className="text-indigo-50/90 leading-relaxed text-[11px]">{style.description}</p>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2">
                        <div className="border-[5px] border-transparent border-t-indigo-700" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
