"use client"

import { VenueFormData } from "@/app/venue/location/mylocation/create/Info"
import Image from "next/image"

type Props = {
    formData: VenueFormData
    setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>
}

const getPreviewUrl = (file: File | string) => {
    if (typeof file === "string") return file
    return URL.createObjectURL(file)
}

export default function Media({ formData, setFormData }: Props) {

    const coverPreview =
        formData.coverImage ?? formData.existingCoverUrl ?? null

    const interiorPreview = [
        ...(formData.existingInteriorUrls ?? []),
        ...(formData.interiorImage ?? [])
    ]

    const menuPreview = [
        ...(formData.existingMenuUrls ?? []),
        ...(formData.fullPageMenuImage ?? [])
    ]
console.log('render media', { coverPreview, interiorPreview, menuPreview }) 
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-4xl px-6 py-10 md:px-10">

                <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
                    Tải lên phương tiện
                </h1>

                <div className="grid gap-8 md:grid-cols-2">

                    {/* ================= COVER ================= */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-900">
                            Ảnh bìa <span className="text-pink-500">*</span>
                        </p>

                        <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500">
                            <span>
                                Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2]">chọn</span>
                            </span>
                            <span className="mt-1 text-xs text-gray-400">Tối đa 10MB</span>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null
                                    setFormData({ ...formData, coverImage: file })
                                }}
                            />
                        </label>

                        {coverPreview && (
                            <div className="mt-3 relative h-24 w-40">
                                <Image
                                    src={getPreviewUrl(coverPreview)}
                                    alt="cover-preview"
                                    width={160}
                                    height={96}
                                    className="h-24 w-40 rounded-3xl object-cover"
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>

                    {/* ================= INTERIOR ================= */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-900">
                            Ảnh nội thất <span className="text-pink-500">*</span>
                        </p>

                        <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500">
                            <span>
                                Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2]">chọn</span>
                            </span>
                            <span className="mt-1 text-xs text-gray-400">
                                Tối đa 5 ảnh · 10MB/ảnh
                            </span>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files ?? [])
                                    const merged = [...formData.interiorImage, ...files].slice(0, 5)
                                    setFormData({ ...formData, interiorImage: merged })
                                }}
                            />
                        </label>

                        {interiorPreview.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-3">
                                {interiorPreview.map((file, i) => (
                                    <div key={i} className="relative h-16 w-16">
                                        <Image
                                            src={getPreviewUrl(file)}
                                            alt={`interior-${i}`}
                                            width={64}
                                            height={64}
                                            className="h-16 w-16 rounded-[20px] object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ================= MENU ================= */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-900">
                            Ảnh thực đơn <span className="text-pink-500">*</span>
                        </p>

                        <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500">
                            <span>
                                Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2]">chọn</span>
                            </span>
                            <span className="mt-1 text-xs text-gray-400">
                                Tối đa 5 ảnh · 10MB/ảnh
                            </span>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files ?? [])
                                    const merged = [...formData.fullPageMenuImage, ...files].slice(0, 5)
                                    setFormData({ ...formData, fullPageMenuImage: merged })
                                }}
                            />
                        </label>

                        {menuPreview.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-3">
                                {menuPreview.map((file, i) => (
                                    <div key={i} className="relative h-16 w-16">
                                        <Image
                                            src={getPreviewUrl(file)}
                                            alt={`menu-${i}`}
                                            width={64}
                                            height={64}
                                            className="h-16 w-16 rounded-[20px] object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}