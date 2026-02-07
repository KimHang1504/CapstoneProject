"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import Info from "@/app/venue/location/mylocation/create/Info";
import Contact from "@/app/venue/location/mylocation/create/Contact";
import Media from "@/app/venue/location/mylocation/create/Media";
// import LocationVerify from "@/app/venue/location/mylocation/create/LocationVerify";
import { VenueFormData } from "@/app/venue/location/mylocation/create/Info";
import { uploadImage } from "@/api/upload";
import { registerVenueLocation } from "@/api/venue/location/api";


const steps = [Info, Contact, Media]
export default function CreatePage() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const [formData, setFormData] = useState<VenueFormData>({
    name: "",
    description: "",

    address: "",
    latitude: 0,
    longitude: 0,

    email: "",
    phoneNumber: "",
    websiteUrl: "",

    priceMin: 0,
    priceMax: 0,

    coverImage: null as File | null,
    interiorImage: [] as File[],
    fullPageMenuImage: [] as File[],

    selectedMoods: [],
    selectedStyles: [],

  });



  const CurrentStep = steps[step - 1]

  function nextStep() {
    if (step < steps.length) setStep((s) => s + 1)
  }

  function prevStep() {
    if (step > 1) setStep((s) => s - 1)
  }

  async function handleSubmit() {
    try {
      const coverUrl = formData.coverImage
        ? await uploadImage(formData.coverImage)
        : null

      const interiorUrls = await Promise.all(
        formData.interiorImage.map(uploadImage)
      )

      const menuUrls = await Promise.all(
        formData.fullPageMenuImage.map(uploadImage)
      )
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



      await registerVenueLocation({
        name: formData.name,
        description: formData.description,
        address: formData.address,
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
      })

      router.push("/venue/location/mylocation")
    } catch (e) {
      console.error(e)
      alert("Tạo địa điểm thất bại")
    }
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-gray-900 mb-4">Tạo địa điểm mới</h1>
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
            Hoàn tất
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
