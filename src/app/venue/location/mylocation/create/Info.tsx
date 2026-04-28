'use client';

import { useEffect, useState } from "react";
import { getCoupleMoodTypes, getCouplePersonalityTypes } from "@/api/mood/api";
import {
  CoupleMoodType,
  CouplePersonalityType,
} from "@/api/mood/type";
import CategoryDropdown from "@/app/venue/location/mylocation/create/CategoryDropdown";
import { Info as InfoCircle, MapPin, FileText, Tag, DollarSign, Sparkles, Heart } from "lucide-react";


export type VenueFormData = {
  name: string
  description: string
  selectedCategories: number[]
  address: string
  email: string
  phoneNumber: string
  websiteUrl?: string

  priceMin: number | null
  priceMax: number | null

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


  //lỗi onblur
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    priceMin: false,
    priceMax: false,
  });

  const [errors, setErrors] = useState({
    priceMin: "",
    priceMax: "",
    name: "",
    description: "",
  });
  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));

    const err = validateName(formData.name);
    setErrors(prev => ({ ...prev, name: err }));
  };

  const handleDescriptionBlur = () => {
    setTouched(prev => ({ ...prev, description: true }));

    const err = validateDescription(formData.description);
    setErrors(prev => ({ ...prev, description: err }));
  };

  const handlePriceMinBlur = () => {
    setTouched(prev => ({ ...prev, priceMin: true }));
    validatePrice(formData.priceMin, formData.priceMax);
  };

  const handlePriceMaxBlur = () => {
    setTouched(prev => ({ ...prev, priceMax: true }));
    validatePrice(formData.priceMin, formData.priceMax);
  };

  function validateName(value: string) {
    if (value.length > 500) {
      return "Tối đa 500 ký tự";
    }
    return "";
  }

  function validateDescription(value: string) {
    if (value.length > 2000) {
      return "Tối đa 2000 ký tự";
    }
    return "";
  }

  function validatePrice(min: number | null, max: number | null) {
    let priceMinError = "";
    let priceMaxError = "";
    if (Object.is(min, -0)) {
      priceMinError = "Giá tối thiểu không được âm";
    }
    if (min !== null && min < 0) {
      priceMinError = "Giá tối thiểu không được âm";
    }

    if (max !== null && max <= 0) {
      priceMaxError = "Giá tối đa không được âm";
    }

    if (min !== null && max !== null && min > max) {
      priceMinError = "Giá tối thiểu phải ≤ giá tối đa";
    }

    setErrors(prev => ({
      ...prev,
      priceMin: priceMinError,
      priceMax: priceMaxError,
    }));
  }

  // console.log(typeof formData.priceMin)

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
    <div className="flex items-center justify-center">
      <div className="w-full max-w-3xl px-4 py-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 mb-3 shadow-lg">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900">
            Thông tin địa điểm
          </h1>
          <p className="text-sm text-gray-500 mt-1">Điền thông tin cơ bản về địa điểm của bạn</p>
        </div>

        {/* Tên địa điểm */}
        <div className="mb-3">
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <MapPin className="w-4 h-4 text-purple-500" />
            Tên địa điểm<span className="text-pink-500"> *</span>
          </label>
          <div className="relative">
            <input
              value={formData.name}
              onBlur={handleNameBlur}
              onChange={(e) => {
                const value = e.target.value;

                setFormData(prev => ({ ...prev, name: value }));

                if (touched.name) {
                  const err = validateName(value);
                  setErrors(prev => ({ ...prev, name: err }));
                }
              }} placeholder="Nhập tên địa điểm"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all
                  ${errors.name && touched.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#E4D7FF] focus:ring-purple-100"
                }`} />
            {errors.name && touched.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Mô tả ngắn */}
        <div className="mb-3">
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <FileText className="w-4 h-4 text-purple-500" />
            Mô tả ngắn<span className="text-pink-500"> *</span>
          </label>
          <div className="relative">
            <textarea
              value={formData.description}
              onBlur={handleDescriptionBlur}
              onChange={(e) => {
                const value = e.target.value;

                setFormData(prev => ({
                  ...prev,
                  description: value,
                }));

                if (touched.description) {
                  setErrors(prev => ({
                    ...prev,
                    description: validateDescription(value),
                  }));
                }
              }}
              rows={5}
              placeholder="Mô tả ngắn gọn về địa điểm"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all resize-none
  ${errors.description && touched.description
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#E4D7FF] focus:ring-purple-100"
                }`} />
            {errors.description && touched.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        {/* CATEGORY */}
        <div className="mb-3">
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <Tag className="w-4 h-4 text-purple-500" />
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
        <div className="mb-8">
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <DollarSign className="w-4 h-4 text-purple-500" />
            Khoảng giá
          </label>

          <div className="grid grid-cols-2 gap-3">

            {/* PRICE MIN */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm font-semibold">
                ₫
              </span>
              <input
                type="number"
                min={0}
                max={100000000}
                value={formData.priceMin ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? null : Number(e.target.value);

                  const newMin = value;
                  const newMax = formData.priceMax;

                  setFormData(prev => ({
                    ...prev,
                    priceMin: newMin,
                  }));

                  if (touched.priceMin || touched.priceMax) {
                    validatePrice(newMin, newMax);
                  }
                }}
                onBlur={handlePriceMinBlur}
                className={`w-full pl-7 rounded-lg border px-4 py-2.5 text-sm outline-none transition-all
    ${errors.priceMin
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#E4D7FF] focus:ring-purple-100"
                  }`}
              />
              <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                {errors.priceMin}
              </p>
            </div>

            {/* PRICE MAX */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm font-semibold">
                ₫
              </span>
              <input
                type="number"
                min={0}
                max={100000000}
                value={formData.priceMax ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? null : Number(e.target.value);

                  const newMax = value;
                  const newMin = formData.priceMin;

                  setFormData(prev => ({
                    ...prev,
                    priceMax: newMax,
                  }));

                  if (touched.priceMin || touched.priceMax) {
                    validatePrice(newMin, newMax);
                  }
                }}
                onBlur={handlePriceMaxBlur}
                className={`w-full pl-7 rounded-lg border px-4 py-2.5 text-sm outline-none transition-all
    ${errors.priceMax
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#E4D7FF] focus:ring-purple-100"
                  }`}
              />
              <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                {errors.priceMax}
              </p>
            </div>

          </div>

          {/* <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <InfoCircle className="w-3 h-3" />
            Ví dụ: 50.000đ - 200.000đ
          </p> */}
        </div>

        <div className="mb-4">
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <Heart className="w-4 h-4 text-purple-500" />
            Không gian của bạn mang lại tâm trạng gì cho khách?
          </label>

          <div className="flex flex-wrap gap-2 ">
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
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all duration-200
            ${active
                        ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        : "bg-white border border-[#E4D7FF] text-gray-700 hover:border-purple-400 hover:shadow-md hover:scale-102"
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
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Địa điểm của bạn phù hợp với phong cách nào của cặp đôi?
          </label>

          <div className="flex flex-wrap gap-2">
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
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all duration-200
            ${active
                        ? "bg-linear-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        : "bg-white border border-[#E4D7FF] text-gray-700 hover:border-indigo-400 hover:shadow-md hover:scale-102"
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
