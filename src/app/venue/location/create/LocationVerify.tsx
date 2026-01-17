"use client";

import { VenueFormData } from "@/app/venue/location/create/Info";
import Image from "next/image";

type Props = {
  formData: VenueFormData;
  setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>;
};

export default function LocationVerify({ formData, setFormData }: Props) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl px-6 py-10 md:px-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Xác minh chủ sở hữu
        </h1>

        {/* Họ tên */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-900">
            Họ và tên chủ sở hữu <span className="text-pink-500">*</span>
          </p>
          <input
            value={formData.ownerFullName}
            onChange={(e) =>
              setFormData({ ...formData, ownerFullName: e.target.value })
            }
            placeholder="Nhập tên chủ địa điểm"
            className="mt-2 w-full rounded-2xl border border-[#D3D6FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
            {/* CCCD mặt trước */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900">
                Căn cước công dân mặt trước <span className="text-pink-500">*</span>
              </p>
              <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500">
                <span>
                  Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2]">chọn</span>
                </span>
                <span className="mt-1 text-xs text-gray-400">Tối đa 10MB</span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setFormData({ ...formData, frontIdCard: file });
                  }}
                />
              </label>

              {formData.frontIdCard && (
                <div className="mt-3 relative h-24 w-40">
                  <Image
                    src={URL.createObjectURL(formData.frontIdCard)}
                    alt="front-id-preview"
                    width={160}
                    height={96}
                    className="h-24 w-40 rounded-3xl object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, frontIdCard: null })
                    }
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px] text-white"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* CCCD mặt sau */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900">
                Căn cước công dân mặt sau <span className="text-pink-500">*</span>
              </p>
              <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500">
                <span>
                  Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2]">chọn</span>
                </span>
                <span className="mt-1 text-xs text-gray-400">Tối đa 10MB</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                    className="hidden"  
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData({ ...formData, backIdCard: file });
                    }}
                />
              </label>
                {formData.backIdCard && (
                    <div className="mt-3 relative h-24 w-40">
                        <Image
                            src={URL.createObjectURL(formData.backIdCard)}
                            alt="back-id-preview"
                            width={160}
                            height={96}
                            className="h-24 w-40 rounded-3xl object-cover"
                            unoptimized
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({ ...formData, backIdCard: null })
                            }
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px] text-white"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
            {/* Giấy phép kinh doanh */}
            <div className="mb-6 col-span-full">
              <p className="text-sm font-semibold text-gray-900">
                Giấy phép kinh doanh <span className="text-pink-500">*</span>
              </p>
              <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D3D6FF] bg-white text-sm text-gray-500">
                <span>
                  Kéo thả tệp vào đây hoặc <span className="text-[#9f5ff2]">chọn</span>
                </span>
                <span className="mt-1 text-xs text-gray-400">Tối đa 10MB</span>

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData({ ...formData, businessLicense: file });
                    }}
                />
              </label>
                {formData.businessLicense && (
                    <div className="mt-3 relative h-24 w-40">
                        <Image
                            src={URL.createObjectURL(formData.businessLicense)}
                            alt="business-license-preview"
                            width={160}
                            height={96}
                            className="h-24 w-40 rounded-3xl object-cover"
                            unoptimized
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({ ...formData, businessLicense: null })
                            }
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px] text-white"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
} 
            
