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
      if (!formData.name || !formData.description) {
        toast.error("Vui lòng nhập tên và mô tả");
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
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {mode === 'edit' ? 'Chỉnh sửa địa điểm' : 'Tạo địa điểm mới'}
      </h1> */}

      <p className="text-blue-900 text-center">
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
          className="rounded-[8.33] border border-[#D3D6FF] bg-white px-6 py-2 text-sm font-medium text-[#4C5A8F] disabled:opacity-50"
        >
          Trở về
        </button>

        {step === steps.length ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-[8.33] bg-[#9f5ff2] px-8 py-2 text-sm font-semibold text-white hover:bg-[#8b53fc]"
          >
            {mode === 'edit' ? 'Cập nhật' : 'Hoàn tất'}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="rounded-[8.33] bg-[#9f5ff2] px-8 py-2 text-sm font-semibold text-white hover:bg-[#8b53fc]"
          >
            Tiếp tục
          </button>
        )}
      </div>
    </div>
  )
}