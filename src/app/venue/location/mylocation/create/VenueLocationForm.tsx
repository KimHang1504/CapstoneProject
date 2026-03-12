"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import Info from "@/app/venue/location/mylocation/create/Info";
import Contact from "@/app/venue/location/mylocation/create/Contact";
import Media from "@/app/venue/location/mylocation/create/Media";
import { VenueFormData } from "@/app/venue/location/mylocation/create/Info";
import { uploadImage } from "@/api/upload";
import { registerVenueLocation, updateVenueLocation } from "@/api/venue/location/api";

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

    selectedMoods: initialData?.selectedMoods || [],
    selectedStyles: initialData?.selectedStyles || [],

    existingCoverUrl: initialData?.existingCoverUrl || "",
    existingInteriorUrls: initialData?.existingInteriorUrls || [],
    existingMenuUrls: initialData?.existingMenuUrls || [],
  }))

  const CurrentStep = steps[step - 1]

  function nextStep() {
    if (step < steps.length) setStep((s) => s + 1)
  }

  function prevStep() {
    if (step > 1) setStep((s) => s - 1)
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

      if (!formData.selectedMoods.length) {
        alert("Vui lòng chọn ít nhất 1 tâm trạng");
        return;
      }

      if (!formData.selectedStyles.length) {
        alert("Vui lòng chọn ít nhất 1 tính cách");
        return;
      }

      const venueTags = formData.selectedMoods.flatMap(moodId =>
        formData.selectedStyles.map(styleId => ({
          coupleMoodTypeId: moodId,
          couplePersonalityTypeId: styleId,
        }))
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
        isOwnerVerified: true,
        coverImage: coverUrl ? [coverUrl] : [],
        interiorImage: interiorUrls,
        fullPageMenuImage: menuUrls,
        venueTags,
      }

      if (mode === 'edit' && locationId) {
        await updateVenueLocation(locationId, payload)
        alert('Cập nhật địa điểm thành công')
      } else {
        await registerVenueLocation(payload)
        alert('Tạo địa điểm thành công')
      }

      router.push("/venue/location/mylocation")

    } catch (e) {
      console.error(e)
      alert(mode === 'edit'
        ? "Cập nhật địa điểm thất bại"
        : "Tạo địa điểm thất bại"
      )
    }
  }


  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-gray-900 mb-4">
        {mode === 'edit' ? 'Chỉnh sửa địa điểm' : 'Tạo địa điểm mới'}
      </h1>

      <p className="text-blue-900 mb-4 text-center">
        Bước {step} / {steps.length}
      </p>

      <CurrentStep
        formData={formData}
        setFormData={setFormData}
      />

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 1}
          className="rounded-[8.33] border border-[#D3D6FF] bg-white px-6 py-2 text-sm font-medium text-[#4C5A8F] disabled:opacity-50"
        >
          Trở về
        </button>

        {step === steps.length ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-[8.33] bg-[#9f5ff2] px-8 py-2 text-sm font-semibold text-white hover:bg-[#b28bff]"
          >
            {mode === 'edit' ? 'Cập nhật' : 'Hoàn tất'}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="rounded-[8.33] bg-[#9f5ff2] px-8 py-2 text-sm font-semibold text-white hover:bg-[#b28bff]"
          >
            Tiếp tục
          </button>
        )}
      </div>
    </div>
  )
}