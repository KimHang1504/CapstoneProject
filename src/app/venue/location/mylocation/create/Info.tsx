'use client';

import { useEffect, useState } from "react";
import { getCoupleMoodTypes, getCouplePersonalityTypes } from "@/api/mood/api";
import {
  CoupleMoodType,
  CouplePersonalityType,
} from "@/api/mood/type";


export type VenueFormData = {
  name: string
  description: string
  address: string
  email: string
  phoneNumber: string
  websiteUrl?: string

  priceMin: number
  priceMax: number

  latitude: number
  longitude: number

  coverImage: File | null
  interiorImage: File[]
  fullPageMenuImage: File[]

  selectedMoods: number[]
  selectedStyles: number[]

}




type Props = {
  formData: VenueFormData
  setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>
}


export default function Info({ formData, setFormData }: Props) {

  const [moods, setMoods] = useState<CoupleMoodType[]>([]);
  const [styles, setStyles] = useState<CouplePersonalityType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [moodRes, styleRes] = await Promise.all([
          getCoupleMoodTypes(),
          getCouplePersonalityTypes(),
        ]);

        setMoods(moodRes.data);
        setStyles(styleRes.data);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


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
      <div className="w-full max-w-3xl rounded-3xl  px-6 py-10 md:px-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
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
        

        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium">
            Thẻ tâm trạng *
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
            Thẻ tính cách *
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
