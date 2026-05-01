"use client"

import { VenueFormData } from "@/app/venue/location/mylocation/create/Info"
import Image from "next/image"
import { Upload, Image as ImageIcon, FileImage, FileCheck, X } from "lucide-react"
import { useState } from "react"

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

    const businessLicensePreview =
        formData.businessLicense ?? formData.existingBusinessLicenseUrl ?? null

    const interiorPreview = [
        ...(formData.existingInteriorUrls ?? []),
        ...(formData.interiorImage ?? [])
    ]

    const menuPreview = [
        ...(formData.existingMenuUrls ?? []),
        ...(formData.fullPageMenuImage ?? [])
    ]
    // ===== REMOVE FUNCTIONS =====
    const removeCover = () => {
        setFormData({
            ...formData,
            coverImage: null,
            existingCoverUrl: null
        })
    }

    const removeInterior = (index: number) => {
        const existingCount = formData.existingInteriorUrls?.length ?? 0

        if (index < existingCount) {
            const updated = [...(formData.existingInteriorUrls ?? [])]
            updated.splice(index, 1)

            setFormData({
                ...formData,
                existingInteriorUrls: updated
            })
            return
        }

        const fileIndex = index - existingCount
        const updated = [...formData.interiorImage]
        updated.splice(fileIndex, 1)

        setFormData({
            ...formData,
            interiorImage: updated
        })
    }

    const removeMenu = (index: number) => {
        const existingCount = formData.existingMenuUrls?.length ?? 0

        if (index < existingCount) {
            const updated = [...(formData.existingMenuUrls ?? [])]
            updated.splice(index, 1)

            setFormData({
                ...formData,
                existingMenuUrls: updated
            })
            return
        }

        const fileIndex = index - existingCount
        const updated = [...formData.fullPageMenuImage]
        updated.splice(fileIndex, 1)

        setFormData({
            ...formData,
            fullPageMenuImage: updated
        })
    }

    const removeBusinessLicense = () => {
        setFormData({
            ...formData,
            businessLicense: null,
            existingBusinessLicenseUrl: null
        })
    }

    const [previewZoom, setPreviewZoom] = useState<string | null>(null)

    console.log('render media', { coverPreview, interiorPreview, menuPreview })
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-4xl px-4 py-4">

                <h1 className="mb-6 text-center text-2xl font-bold text-blue-900">
                    Tải lên phương tiện
                </h1>

                <div className="grid gap-4 md:grid-cols-2">

                    {/* ================= COVER ================= */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-purple-500" />
                            Ảnh bìa <span className="text-pink-500">*</span>
                        </p>

                        <label className="group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500 hover:border-purple-400 hover:bg-purple-50 transition-all">
                            <Upload className="w-6 h-6 text-gray-400 mb-1.5 group-hover:text-purple-500 transition-colors" />
                            <span className="text-gray-600">
                                Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2] font-semibold">chọn</span>
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
                            <div className="relative mt-2 h-20 w-32 group">
                                <Image
                                    src={getPreviewUrl(coverPreview)}
                                    alt="cover-preview"
                                    width={128}
                                    height={80}
                                    className="h-20 w-32 rounded-xl object-cover border border-gray-200 cursor-zoom-in"
                                    unoptimized
                                    onClick={() => setPreviewZoom(getPreviewUrl(coverPreview))}
                                />

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeCover()
                                    }}
                                    className="absolute cursor-pointer right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white text-xs hover:bg-black/80 transition-all"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ================= INTERIOR ================= */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                            <FileImage className="w-4 h-4 text-purple-500" />
                            Ảnh nội thất
                        </p>

                        <label className="group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500 hover:border-purple-400 hover:bg-purple-50 transition-all">
                            <Upload className="w-6 h-6 text-gray-400 mb-1.5 group-hover:text-purple-500 transition-colors" />
                            <span className="text-gray-600">
                                Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2] font-semibold">chọn</span>
                            </span>
                            <span className="mt-1 text-xs text-gray-400">
                                10MB/ảnh
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
                            <div className="mt-2 flex flex-wrap gap-2">
                                {interiorPreview.map((file, i) => (
                                    <div key={i} className="relative h-14 w-14 group">
                                        <Image
                                            src={getPreviewUrl(file)}
                                            alt={`interior-${i}`}
                                            width={56}
                                            height={56}
                                            className="h-14 w-14 rounded-lg object-cover border border-gray-200 cursor-zoom-in"
                                            unoptimized
                                            onClick={() => setPreviewZoom(getPreviewUrl(file))}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeInterior(i)}
                                            className="absolute right-0 top-0 flex h-4 w-4 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80 transition-all"
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ================= MENU ================= */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                            <FileImage className="w-4 h-4 text-purple-500" />
                            Ảnh thực đơn
                        </p>

                        <label className="group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500 hover:border-purple-400 hover:bg-purple-50 transition-all">
                            <Upload className="w-6 h-6 text-gray-400 mb-1.5 group-hover:text-purple-500 transition-colors" />
                            <span className="text-gray-600">
                                Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2] font-semibold">chọn</span>
                            </span>
                            <span className="mt-1 text-xs text-gray-400">
                                10MB/ảnh
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
                            <div className="mt-2 flex flex-wrap gap-2">
                                {menuPreview.map((file, i) => (
                                    <div key={i} className="relative h-14 w-14 group">
                                        <Image
                                            src={getPreviewUrl(file)}
                                            alt={`menu-${i}`}
                                            width={56}
                                            height={56}
                                            className="h-14 w-14 rounded-lg object-cover border border-gray-200"
                                            unoptimized
                                            onClick={() => setPreviewZoom(getPreviewUrl(file))}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeMenu(i)}
                                            className="absolute right-0 top-0 flex h-4 w-4 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80 transition-all"
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ================= BUSINESS LICENSE ================= */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                            <FileCheck className="w-4 h-4 text-purple-500" />
                            Giấy phép kinh doanh
                        </p>

                        <label className="group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500 hover:border-purple-400 hover:bg-purple-50 transition-all">
                            <Upload className="w-6 h-6 text-gray-400 mb-1.5 group-hover:text-purple-500 transition-colors" />
                            <span className="text-gray-600">
                                Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2] font-semibold">chọn</span>
                            </span>
                            <span className="mt-1 text-xs text-gray-400">
                                JPG / PNG - tối đa 10MB
                            </span>

                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null
                                    setFormData({ ...formData, businessLicense: file })
                                }}
                            />
                        </label>

                        {businessLicensePreview && (
                            <div className="relative mt-2 flex items-center gap-2 group">

                                {/* preview */}
                                {typeof businessLicensePreview === "string" &&
                                    businessLicensePreview.endsWith(".pdf") ? (
                                    <a
                                        href={businessLicensePreview}
                                        target="_blank"
                                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 underline text-xs"
                                    >
                                        <FileCheck className="w-3.5 h-3.5" />
                                        Xem file PDF
                                    </a>
                                ) : typeof businessLicensePreview !== "string" &&
                                    businessLicensePreview.type === "application/pdf" ? (
                                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <FileCheck className="w-3.5 h-3.5" />
                                        {businessLicensePreview.name}
                                    </span>
                                ) : (
                                    <Image
                                        src={getPreviewUrl(businessLicensePreview)}
                                        alt="license-preview"
                                        width={100}
                                        height={60}
                                        className="rounded-lg object-cover h-16 border border-gray-200"
                                        unoptimized
                                        onClick={() => setPreviewZoom(getPreviewUrl(businessLicensePreview))}
                                    />
                                )}

                                {/* remove */}
                                <button
                                    type="button"
                                    onClick={removeBusinessLicense}
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white text-xs hover:bg-black/80 transition-all"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            {previewZoom && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                    onClick={() => setPreviewZoom(null)}
                >
                    <img
                        src={previewZoom}
                        className="max-h-[90%] max-w-[90%] rounded-xl shadow-lg"
                    />

                    {/* nút đóng */}
                    <button
                        className="absolute top-4 right-4 text-white text-2xl"
                        onClick={() => setPreviewZoom(null)}
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    )
}