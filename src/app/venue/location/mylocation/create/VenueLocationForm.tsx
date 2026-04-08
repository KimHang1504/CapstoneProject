"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import Info from "@/app/venue/location/mylocation/create/Info";
import Contact from "@/app/venue/location/mylocation/create/Contact";
import Media from "@/app/venue/location/mylocation/create/Media";
import { VenueFormData } from "@/app/venue/location/mylocation/create/Info";
import { uploadImage } from "@/api/upload";
import { registerVenueLocation, updateVenueLocation } from "@/api/venue/location/api";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const steps = [Info, Contact, Media]

type VenueLocationFormProps = {
  mode: 'create' | 'edit';
  locationId?: number;
  initialData?: Partial<VenueFormData>;
}

export default function VenueLocationForm({ mode, locationId, initialData }: VenueLocationFormProps) {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const [formData, setFormData] = useState<VenueFormData>(() => ({
    name: initialData?.name || "",
    description: initialData?.description || "",
    selectedCategories: initialData?.selectedCategories || [],
    address: initialData?.address || "",
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || "",
    websiteUrl: initialData?.websiteUrl || "",
    priceMin: initialData?.priceMin || 0,
    priceMax: initialData?.priceMax || 0,

    coverImage: null,
    interiorImage: [],
    fullPageMenuImage: [],

    selectedMoods: Array.from(new Set(initialData?.selectedMoods || [])),
    selectedStyles: Array.from(new Set(initialData?.selectedStyles || [])),

    existingCoverUrl: initialData?.existingCoverUrl || "",
    existingInteriorUrls: initialData?.existingInteriorUrls || [],
    existingMenuUrls: initialData?.existingMenuUrls || [],
    businessLicense: null,
    existingBusinessLicenseUrl: initialData?.existingBusinessLicenseUrl || "",
  }))

  const CurrentStep = steps[step - 1]

  function prevStep() {
    if (step === 1) {
      if (mode === "edit" && locationId) {
        // Về trang detail
        router.push(`/venue/location/mylocation/${locationId}`)
      } else {
        // Mode create → về trang danh sách
        router.push("/venue/location/mylocation")
      }
      return
    }

    setStep((s) => s - 1)
  }

  function nextStep() {
    // STEP 1 → check name + description + mood/style
    if (step === 1) {
      if (!formData.name) {
        toast.error("Vui lòng nhập tên");
        return;
      }

      if (!formData.description) {
        toast.error("Vui lòng nhập mô tả");
        return;
      }

      const hasMood = formData.selectedMoods.length > 0;
      const hasStyle = formData.selectedStyles.length > 0;

      if ((hasMood && !hasStyle) || (!hasMood && hasStyle)) {
        toast.error("Vui lòng chọn đầy đủ cả Tâm trạng và Tính cách");
        return;
      }
    }

    // STEP 2 → check address + format contact
    if (step === 2) {
      if (!formData.address) {
        toast.error("Vui lòng nhập địa chỉ");
        return;
      }

      const errors = validateContact(formData);

      if (errors.phone || errors.email || errors.website) {
        toast.error("Vui lòng nhập đúng định dạng thông tin liên hệ");
        return;
      }
    }

    if (step < steps.length) {
      setStep((s) => s + 1);
    }
  }

  function validateContact(formData: VenueFormData) {
    const errors = {
      phone: "",
      email: "",
      website: ""
    };

    if (formData.phoneNumber && !/^(0|\+84)[0-9]{9,10}$/.test(formData.phoneNumber)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (formData.websiteUrl && !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/.test(formData.websiteUrl)) {
      errors.website = "Website không hợp lệ";
    }

    return errors;
  }

  function hasAtLeastOneField(data: VenueFormData) {
    return (
      data.name ||
      data.description ||
      data.address ||
      data.selectedCategories.length > 0 ||
      data.email ||
      data.phoneNumber ||
      data.websiteUrl ||
      data.priceMin > 0 ||
      data.priceMax > 0 ||
      data.businessLicense ||
      data.coverImage ||
      data.interiorImage.length > 0 ||
      data.fullPageMenuImage.length > 0 ||
      data.selectedMoods.length > 0 ||
      data.selectedStyles.length > 0
    );
  }
  async function handleSubmit() {
    try {
      // ===== COVER =====
      let coverUrl = formData.existingCoverUrl || ""

      if (formData.coverImage instanceof File) {
        coverUrl = await uploadImage(formData.coverImage)
      }

      // ===== INTERIOR =====
      let interiorUrls: string[] = [...(formData.existingInteriorUrls || [])]

      if (formData.interiorImage.length > 0) {
        const uploaded = await Promise.all(
          formData.interiorImage.map(async (item) => {
            if (item instanceof File) {
              return await uploadImage(item)
            }
            return item
          })
        )
        interiorUrls = uploaded
      }

      // ===== MENU =====
      let menuUrls: string[] = [...(formData.existingMenuUrls || [])]

      if (formData.fullPageMenuImage.length > 0) {
        const uploaded = await Promise.all(
          formData.fullPageMenuImage.map(async (item) => {
            if (item instanceof File) {
              return await uploadImage(item)
            }
            return item
          })
        )
        menuUrls = uploaded
      }

      // ===== BUSINESS LICENSE =====
      let businessLicenseUrl = formData.existingBusinessLicenseUrl || ""

      if (formData.businessLicense instanceof File) {
        businessLicenseUrl = await uploadImage(formData.businessLicense)
      }

      if (!hasAtLeastOneField(formData)) {
        toast.error("Vui lòng nhập ít nhất một thông tin để lưu bản nháp");
        return;
      }
      const hasMood = formData.selectedMoods.length > 0;
      const hasStyle = formData.selectedStyles.length > 0;

      // Nếu có 1 mà thiếu 1 → lỗi
      if ((hasMood && !hasStyle) || (!hasMood && hasStyle)) {
        toast.error("Vui lòng chọn đầy đủ cả Tâm trạng và Tính cách");
        return;
      }

      const venueTags = Array.from(
        new Map(
          formData.selectedMoods.flatMap(moodId =>
            formData.selectedStyles.map(styleId => {
              const tag = {
                coupleMoodTypeId: moodId,
                couplePersonalityTypeId: styleId,
              };

              return [`${tag.coupleMoodTypeId}-${tag.couplePersonalityTypeId}`, tag] as const;
            })
          )
        ).values()
      );

      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        categoryIds: formData.selectedCategories,
        latitude: formData.latitude,
        longitude: formData.longitude,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        websiteUrl: formData.websiteUrl,
        priceMin: formData.priceMin,
        priceMax: formData.priceMax,
        // isOwnerVerified: true,

        coverImage: coverUrl ? [coverUrl] : [],
        interiorImage: interiorUrls,
        fullPageMenuImage: menuUrls,
        venueTags,
        businessLicenseUrl,
      }

      if (mode === 'edit' && locationId) {
        await updateVenueLocation(locationId, payload)
        toast.success("Cập nhật địa điểm thành công")
        router.push(`/venue/location/mylocation/${locationId}`)
      } else {
        await registerVenueLocation(payload)
        toast.success("Tạo địa điểm thành công")


        router.push("/venue/location/mylocation")
      }

    } catch (e) {
      console.error(e)
      toast.error(mode === 'edit'
        ? "Cập nhật địa điểm thất bại"
        : "Tạo địa điểm thất bại"
      )
    }
  }


  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {mode === 'edit' ? 'Chỉnh sửa địa điểm' : 'Tạo địa điểm mới'}
      </h1> */}

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, index) => {
            const stepNum = index + 1
            const isActive = stepNum === step
            const isCompleted = stepNum < step

            return (
              <div key={stepNum} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${isActive
                        ? "bg-linear-to-br from-purple-500 to-indigo-600 text-white shadow-lg scale-110"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Bước {stepNum}
                  </p>
                </div>
                {stepNum < steps.length && (
                  <div
                    className={`w-16 h-1 mx-2 rounded-full transition-all ${isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <CurrentStep
        formData={formData}
        setFormData={setFormData}
      />

      <div className="flex justify-between mt-6 px-4 gap-3">
        <button
          type="button"
          onClick={prevStep}
          className="cursor-pointer flex items-center gap-2 rounded-lg border-2 border-[#D3D6FF] bg-white px-5 py-2.5 text-sm font-medium text-[#4C5A8F] hover:bg-gray-50 hover:border-purple-300 hover:shadow-md transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Trở về
        </button>

        {step === steps.length ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-purple-600 hover:to-indigo-700 hover:shadow-lg transition-all"
          >
            <Check className="w-4 h-4" />
            {mode === 'edit' ? 'Cập nhật' : 'Hoàn tất'}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="cursor-pointer flex items-center gap-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-purple-600 hover:to-indigo-700 hover:shadow-lg transition-all"
          >
            Tiếp tục
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}