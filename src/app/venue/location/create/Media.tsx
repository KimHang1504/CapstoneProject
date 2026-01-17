"use client"

import { VenueFormData } from "@/app/venue/location/create/Info"
import Image from "next/image"

type Props = {
    formData: VenueFormData
    setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>
}

export default function Media({ formData, setFormData }: Props) {
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-4xl px-6 py-10 md:px-10">

                <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
                    Tải lên phương tiện
                </h1>
                <div className="grid gap-8 md:grid-cols-2">

                    {/* Ảnh bìa */}
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

                        {formData.coverImage && (
                            <div className="mt-3 relative h-24 w-40">
                                <Image
                                    src={URL.createObjectURL(formData.coverImage)}
                                    alt="cover-preview"
                                    width={160}
                                    height={96}
                                    className="h-24 w-40 rounded-3xl object-cover"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, coverImage: null })
                                    }
                                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px] text-white"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Ảnh đại diện */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-900">
                            Ảnh đại diện <span className="text-pink-500">*</span>
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
                                    setFormData({ ...formData, avatarImage: file })
                                }}
                            />
                        </label>

                        {formData.avatarImage && (
                            <div className="mt-3 relative h-24 w-40">
                                <Image
                                    src={URL.createObjectURL(formData.avatarImage)}
                                    alt="avatar-preview"
                                    width={160}
                                    height={96}
                                    className="h-24 w-40 rounded-3xl object-cover"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, avatarImage: null })
                                    }
                                    className
                                    ="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px] text-white"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Ảnh nội thất */}
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
                                    const merged = [...formData.interiorImages, ...files].slice(0, 5)
                                    setFormData({ ...formData, interiorImages: merged })
                                }}
                            />

                        </label>

                        {formData.interiorImages.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-3">
                                {formData.interiorImages.map((file, i) => (
                                    <div key={i} className="relative h-16 w-16">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`menu-${i}`}
                                            width={64}
                                            height={64}
                                            className="h-16 w-16 rounded-[20px] object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const next = formData.interiorImages.filter((_, idx) => idx !== i)
                                                setFormData({ ...formData, interiorImages: next })
                                            }}
                                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px] text-white"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Ảnh thực đơn */}
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
                                    const merged = [...formData.menuImages, ...files].slice(0, 5)
                                    setFormData({ ...formData, menuImages: merged })
                                }}

                            />
                        </label>

                        {formData.menuImages.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-3">
                                {formData.menuImages.map((file, i) => (
                                    <div key={i} className="relative h-16 w-16">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`menu-${i}`}
                                            width={64}
                                            height={64}
                                            className="h-16 w-16 rounded-[20px] object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const next = formData.menuImages.filter((_, idx) => idx !== i)
                                                setFormData({ ...formData, menuImages: next })
                                            }}
                                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px] text-white"
                                        >
                                            ×
                                        </button>
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
