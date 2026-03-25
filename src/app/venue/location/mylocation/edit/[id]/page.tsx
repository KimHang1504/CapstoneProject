"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import VenueLocationForm from "../../create/VenueLocationForm"
import { getVenueLocationDetail } from "@/api/venue/location/api"
import { VenueFormData } from "../../create/Info"
import toast from "react-hot-toast";

export default function EditPage() {
  const params = useParams()
  const locationId = Number(params.id)

  const [initialData, setInitialData] = useState<Partial<VenueFormData> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoading(true)
        const response = await getVenueLocationDetail(locationId)
        const data = response.data
        console.log("LẤY CHI TIẾT ĐỂ CHỈNH SỬA:", data) // Debug log

        // Extract mood and personality IDs
        const moodIds = data.coupleMoodTypes?.map(m => m.id) || []
        const styleIds = data.couplePersonalityTypes?.map(p => p.id) || []

        setInitialData({
          name: data.name,
          description: data.description,
          selectedCategories: data.categories?.map(c => c.id) || [],
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          email: data.email,

          phoneNumber: data.phoneNumber,
          websiteUrl: data.websiteUrl || "",
          priceMin: data.priceMin,
          priceMax: data.priceMax,
          selectedMoods: moodIds,
          selectedStyles: styleIds,

          // FILE mới = rỗng
          coverImage: null,
          interiorImage: [],
          fullPageMenuImage: [],

          // URL cũ
          existingCoverUrl: data.coverImage?.[0] ?? undefined,
          existingInteriorUrls: data.interiorImage ?? [],
          existingMenuUrls: data.fullPageMenuImage ?? [],
        })
      } catch (error) {
        console.error('Error loading location:', error)
        toast.error('Không thể tải thông tin địa điểm')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocation()
  }, [locationId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy địa điểm</p>
      </div>
    )
  }

  return (
    <VenueLocationForm
      mode="edit"
      locationId={locationId}
      initialData={initialData}
    />
  )
}
