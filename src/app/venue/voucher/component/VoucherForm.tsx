"use client";

import { useState } from "react";
import { CreateVoucherRequest, DiscountType } from "@/api/venue/vouchers/type";
import SelectLocationModal from "@/app/venue/voucher/component/SelectLocationModal";
import { uploadImage } from "@/api/upload";
import { toast } from "sonner";
import { Upload } from "lucide-react";

type Props = {
  initialData?: CreateVoucherRequest;
  onSubmit: (data: CreateVoucherRequest) => Promise<void>;
};

export default function VoucherForm({ initialData, onSubmit }: Props) {

  const isEdit = !!initialData;

  const defaultForm: CreateVoucherRequest = {
    title: "",
    description: "",
    voucherPrice: 0,

    discountType: "FIXED_AMOUNT",
    discountAmount: null,
    discountPercent: null,

    quantity: 1,

    usageLimitPerMember: null,
    usageValiDays: 7,

    venueLocationIds: [],
    imageUrl: "",

    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState<CreateVoucherRequest>({
    ...defaultForm,
    ...initialData,
    imageUrl: initialData?.imageUrl ?? "",
  });

  const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>(
    initialData?.venueLocationIds ?? []
  );

  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleChange = <K extends keyof CreateVoucherRequest>(
    key: K,
    value: CreateVoucherRequest[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không vượt quá 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadImage(file);
      handleChange('imageUrl', uploadedUrl);
      toast.success('Tải ảnh lên thành công!');
    } catch (error: any) {
      console.error('Upload image error:', error);
      toast.error(error?.message || 'Không thể tải ảnh lên');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {

    const payload: CreateVoucherRequest = {
      ...form,

      venueLocationIds: selectedLocationIds,

      discountAmount:
        form.discountType === "FIXED_AMOUNT"
          ? form.discountAmount
          : null,

      discountPercent:
        form.discountType === "PERCENTAGE"
          ? form.discountPercent
          : null,

      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };

    try {

      setLoading(true);

      await onSubmit(payload);

      if (!isEdit) {
        setForm(defaultForm);
        setSelectedLocationIds([]);
      }

    } catch (err) {

      console.error(err);
      toast.error("Submit failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="mx-20">

      <div className="bg-white space-y-7">

        {/* BASIC INFO */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tên voucher *
          </label>

          <input
            className="w-full border border-violet-200 rounded-xl px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Nhập tên voucher"
            value={form.title}
            onChange={(e) =>
              handleChange("title", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Mô tả
          </label>

          <textarea
            rows={3}
            className="w-full border border-violet-200 rounded-xl px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Mô tả ngắn về voucher"
            value={form.description}
            onChange={(e) =>
              handleChange("description", e.target.value)
            }
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              Ảnh voucher
            </label>
            <button
              type="button"
              onClick={() => document.getElementById('voucher-image-input')?.click()}
              disabled={isUploadingImage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition"
            >
              {isUploadingImage ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Tải ảnh lên
                </>
              )}
            </button>
          </div>
          <input
            id="voucher-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploadingImage}
            className="hidden"
          />
          {form.imageUrl && (
            <div className="mt-4">
              <img
                src={form.imageUrl}
                alt="preview"
                className="w-48 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>


        {/* DISCOUNT TYPE */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Loại giảm giá *
          </label>

          <select
            className="w-full border border-violet-200 rounded-xl px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={form.discountType}
            onChange={(e) =>
              handleChange(
                "discountType",
                e.target.value as DiscountType
              )
            }
          >
            <option value="FIXED_AMOUNT">
              Giảm tiền
            </option>

            <option value="PERCENTAGE">
              Giảm phần trăm
            </option>

          </select>
        </div>


        {/* DISCOUNT VALUE */}
        {form.discountType === "FIXED_AMOUNT" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Số tiền giảm (VND)
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={form.discountAmount ?? ""}
              onChange={(e) =>
                handleChange(
                  "discountAmount",
                  Number(e.target.value)
                )
              }
            />
          </div>
        )}

        {form.discountType === "PERCENTAGE" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Phần trăm giảm (%)
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={form.discountPercent ?? ""}
              onChange={(e) =>
                handleChange(
                  "discountPercent",
                  Number(e.target.value)
                )
              }
            />
          </div>
        )}


        {/* PRICE + QUANTITY */}
        <div className="grid grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Giá đổi
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.voucherPrice ?? ""}
              onChange={(e) =>
                handleChange(
                  "voucherPrice",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Số lượng
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.quantity ?? ""}
              onChange={(e) =>
                handleChange(
                  "quantity",
                  Number(e.target.value) || 0
                )
              }
            />
          </div>

        </div>


        {/* LIMIT */}
        <div className="grid grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Giới hạn mỗi người
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.usageLimitPerMember ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                handleChange(
                  "usageLimitPerMember",
                  value === "" ? null : Number(value)
                );
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Hạn sử dụng (ngày)
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.usageValiDays || ""}
              onChange={(e) =>
                handleChange(
                  "usageValiDays",
                  Number(e.target.value)
                )
              }
            />
          </div>

        </div>


        {/* DATE */}
        <div className="grid grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Ngày bắt đầu
            </label>

            <input
              type="date"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.startDate}
              onChange={(e) =>
                handleChange("startDate", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ngày kết thúc
            </label>

            <input
              type="date"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.endDate}
              onChange={(e) =>
                handleChange("endDate", e.target.value)
              }
            />
          </div>

        </div>


        {/* LOCATION */}
        <div>

          <label className="block text-sm font-medium mb-2">
            Địa điểm áp dụng
          </label>

          <button
            type="button"
            onClick={() => setOpenLocationModal(true)}
            className="border border-violet-200 px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            Chọn địa điểm
          </button>

          <p className="text-sm text-gray-500 mt-2">
            {selectedLocationIds.length} địa điểm đã chọn
          </p>

        </div>


        {/* SUBMIT */}
        <div className="flex justify-end pt-6">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700
            text-white px-8 py-3 rounded-xl"
          >
            {loading
              ? "Đang lưu..."
              : isEdit
                ? "Cập nhật"
                : "Tiếp tục"}
          </button>

        </div>

      </div>

      {openLocationModal && (
        <SelectLocationModal
          selectedIds={selectedLocationIds}
          onChange={setSelectedLocationIds}
          onClose={() => setOpenLocationModal(false)}
        />
      )}

    </div>

  );
}