'use client';

import { useEffect, useState } from "react";
import { getCoupleMoodTypes, getCouplePersonalityTypes } from "@/api/mood/api";
import {
  CoupleMoodType,
  CouplePersonalityType,
} from "@/api/mood/type";
import CategoryDropdown from "@/app/venue/location/mylocation/create/CategoryDropdown";


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
  existingCoverUrl?: string
  existingInteriorUrls?: string[]
  existingMenuUrls?: string[]
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
                <button
                  key={mood.id}
                  type="button"
                  onClick={() =>
                    toggleItem(
                      formData.selectedMoods,
                      mood.id,
                      "selectedMoods"
                    )
                  }
                  className={`rounded-full px-4 py-2 text-xs font-medium
            ${active
                      ? "bg-[#9f5ff2] text-white"
                      : "bg-white border border-[#E4D7FF]"
                    }`}
                >
                  {mood.name.toLowerCase()}
                </button>
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
                <button
                  key={style.id}
                  type="button"
                  onClick={() =>
                    toggleItem(
                      formData.selectedStyles,
                      style.id,
                      "selectedStyles"
                    )
                  }
                  className={`rounded-full px-4 py-2 text-xs font-medium
            ${active
                      ? "bg-[#7C4DFF] text-white"
                      : "bg-white border border-[#E4D7FF]"
                    }`}
                >
                  {style.name.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
