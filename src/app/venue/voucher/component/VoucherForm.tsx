"use client";

import { useState } from "react";
import { CreateVoucherRequest, DiscountType } from "@/api/venue/vouchers/type";
import SelectLocationModal from "@/app/venue/voucher/component/SelectLocationModal";
import { uploadImage } from "@/api/upload";
import { toast } from "sonner";
import {
  Upload,
} from "lucide-react";
import Tiptap from "@/components/Tiptap";

type Props = {
  initialData?: CreateVoucherRequest;
  onSubmit: (data: CreateVoucherRequest) => Promise<void>;
};

const inputClass =
  "w-full mt-2 border border-violet-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition placeholder-gray-300";

const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

export default function VoucherForm({ initialData, onSubmit }: Props) {
  const isEdit = !!initialData;

  const defaultForm: CreateVoucherRequest = {
    title: "",
    description: "",
    voucherPrice: null,
    discountType: "FIXED_AMOUNT",
    discountAmount: null,
    discountPercent: null,
    quantity: null,
    usageLimitPerMember: null,
    usageValiDays: null,
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

  // Date validation helpers (Vietnam timezone UTC+7)
  const getToday = () => {
    const today = new Date();
    const vietnamTime = new Date(today.getTime() + (7 - today.getTimezoneOffset() / 60) * 60 * 60 * 1000);
    vietnamTime.setHours(0, 0, 0, 0);
    return vietnamTime;
  };

  const formatDateVN = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getMinStartDate = () => {
    const today = getToday();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  };

  const getMinEndDate = () => {
    if (!form.startDate) return "";
    const startDate = new Date(form.startDate + 'T00:00:00');
    startDate.setDate(startDate.getDate() + 1);
    return startDate.toISOString().split('T')[0];
  };

  const getMaxEndDate = () => {
    if (!form.startDate) return "";
    const startDate = new Date(form.startDate + 'T00:00:00');
    startDate.setDate(startDate.getDate() + 30);
    return startDate.toISOString().split('T')[0];
  };

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

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không vượt quá 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadImage(file);
      handleChange("imageUrl", uploadedUrl);
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      console.error("Upload image error:", error);
      toast.error(error instanceof Error ? error.message : "Không thể tải ảnh lên");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tên voucher");
      return;
    }

    if (!form.description?.trim()) {
      toast.error("Vui lòng nhập mô tả voucher");
      return;
    }

    if (form.discountType === "FIXED_AMOUNT") {
      if (
        form.discountAmount === null ||
        form.discountAmount === undefined
      ) {
        toast.error("Vui lòng nhập số tiền giảm");
        return;
      }

      if (form.discountAmount <= 0) {
        toast.error("Số tiền giảm phải lớn hơn 0");
        return;
      }

      if (form.discountAmount > 100_000_000) {
        toast.error("Số tiền giảm không được vượt quá 100,000,000 VND");
        return;
      }
    }

    if (form.discountType === "PERCENTAGE") {
      if (
        form.discountPercent === null ||
        form.discountPercent === undefined ||
        form.discountPercent <= 0
      ) {
        toast.error("Vui lòng nhập phần trăm giảm");
        return;
      }

      if (form.discountPercent > 100) {
        toast.error("Phần trăm giảm không được vượt quá 100%");
        return;
      }
    }

    if (form.voucherPrice === null || form.voucherPrice === undefined) {
      toast.error("Vui lòng nhập giá đổi");
      return;
    }

    if (form.voucherPrice < 0) {
      toast.error("Giá đổi không được âm");
      return;
    }

    if (form.voucherPrice > 100_000_000) {
      toast.error("Giá đổi không được vượt quá 100,000,000 điểm");
      return;
    }

    if (
      form.quantity === null ||
      form.quantity === undefined ||
      Number.isNaN(form.quantity)
    ) {
      toast.error("Vui lòng nhập số lượng");
      return;
    }

    if (form.quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }

    if (form.quantity > 100_000) {
      toast.error("Số lượng không được vượt quá 100,000");
      return;
    }

    if (
      form.usageLimitPerMember === null ||
      form.usageLimitPerMember === undefined ||
      Number.isNaN(form.usageLimitPerMember)
    ) {
      toast.error("Vui lòng nhập giới hạn mỗi người");
      return;
    }

    if (form.usageLimitPerMember <= 0) {
      toast.error("Giới hạn mỗi người phải lớn hơn 0");
      return;
    }

    if (form.quantity && form.usageLimitPerMember > form.quantity) {
      toast.error("Giới hạn mỗi người không được vượt quá số lượng");
      return;
    }

    if (form.quantity && form.usageLimitPerMember > form.quantity) {
      toast.error("Giới hạn mỗi người không được vượt quá số lượng");
      return;
    }

    if (!form.usageValiDays) {
      toast.error("Vui lòng nhập hạn sử dụng");
      return;
    }

    if (!form.startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return;
    }

    const minStartDate = getMinStartDate();
    if (form.startDate < minStartDate) {
      toast.error(`Ngày bắt đầu phải từ ${formatDateVN(minStartDate)} trở đi (cần 3 ngày để admin duyệt)`);
      return;
    }

    if (!form.endDate) {
      toast.error("Vui lòng chọn ngày kết thúc");
      return;
    }

    const minEndDate = getMinEndDate();
    const maxEndDate = getMaxEndDate();
    if (form.endDate < minEndDate) {
      toast.error(`Ngày kết thúc phải từ ${formatDateVN(minEndDate)} trở đi`);
      return;
    }

    if (form.endDate > maxEndDate) {
      toast.error(`Ngày kết thúc không được quá ${formatDateVN(maxEndDate)}`);
      return;
    }

    if (selectedLocationIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một địa điểm");
      return;
    }

    if (!form.imageUrl) {
      toast.error("Vui lòng tải lên ảnh voucher");
      return;
    }

    if (
      form.usageValiDays === null ||
      form.usageValiDays === undefined ||
      Number.isNaN(form.usageValiDays)
    ) {
      toast.error("Vui lòng nhập hạn sử dụng");
      return;
    }

    if (form.usageValiDays <= 0) {
      toast.error("Hạn sử dụng phải lớn hơn 0");
      return;
    }

    if (form.usageValiDays > 365) {
      toast.error("Hạn sử dụng không được vượt quá 365 ngày");
      return;
    }

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
    } catch {
      toast.error("Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 space-y-7 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold text-gray-800">
        {isEdit ? "Chỉnh sửa voucher" : "Tạo mới voucher"}
      </h1>

      {/* TITLE */}
      <FieldWrapper>
        <label className={labelClass}>Tên voucher</label>
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Nhập tên voucher..."
          className={inputClass}
        />
      </FieldWrapper>

      {/* DESCRIPTION */}
      <FieldWrapper>
        <label className={labelClass}>Mô tả</label>
        {/* <Tiptap
          value={form.description || ""}
          onChange={(val) => handleChange("description", val)}
        /> */}
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Nhập mô tả voucher..."
          className={inputClass}
          rows={4}
        />
      </FieldWrapper>

      {/* IMAGE */}
      <FieldWrapper>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Ảnh voucher</label>
          <button
            type="button"
            onClick={() => document.getElementById("voucher-image-input")?.click()}
            disabled={isUploadingImage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-blue-500 to-cyan-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
          <div className="mt-3 rounded-2xl overflow-hidden border border-violet-100 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.imageUrl}
              alt="preview"
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </FieldWrapper>

      {/* DISCOUNT TYPE */}
      <FieldWrapper>
        <label className={labelClass}>Loại giảm giá</label>
        <select
          value={form.discountType}
          onChange={(e) => handleChange("discountType", e.target.value as DiscountType)}
          className={inputClass}
        >
          <option value="FIXED_AMOUNT">Giảm tiền</option>
          <option value="PERCENTAGE">Giảm phần trăm</option>
        </select>
      </FieldWrapper>

      {/* DISCOUNT VALUE */}
      {form.discountType === "FIXED_AMOUNT" && (
        <FieldWrapper>
          <label className={labelClass}>Số tiền giảm (VND)</label>
          <input
            type="number"
            value={form.discountAmount ?? ""}
            onChange={(e) => handleChange("discountAmount", Number(e.target.value))}
            className={inputClass}
          />
        </FieldWrapper>
      )}

      {form.discountType === "PERCENTAGE" && (
        <FieldWrapper>
          <label className={labelClass}>Phần trăm giảm (%)</label>
          <input
            type="number"
            value={form.discountPercent ?? ""}
            onChange={(e) => handleChange("discountPercent", Number(e.target.value))}
            className={inputClass}
          />
        </FieldWrapper>
      )}

      {/* PRICE + QUANTITY */}
      <div className="grid grid-cols-2 gap-5">
        <FieldWrapper>
          <label className={labelClass}>Giá đổi</label>
          <input
            type="number"
            value={form.voucherPrice ?? ""}
            onChange={(e) => handleChange("voucherPrice", Number(e.target.value))}
            className={inputClass}
          />
        </FieldWrapper>

        <FieldWrapper>
          <label className={labelClass}>Số lượng</label>
          <input
            type="number"
            value={form.quantity ?? ""}
            onChange={(e) => handleChange("quantity", Number(e.target.value) || 0)}
            className={inputClass}
          />
        </FieldWrapper>
      </div>

      {/* LIMIT */}
      <div className="grid grid-cols-2 gap-5">
        <FieldWrapper>
          <label className={labelClass}>Giới hạn mỗi người</label>
          <input
            type="number"
            value={form.usageLimitPerMember ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              handleChange(
                "usageLimitPerMember",
                value === "" ? null : Number(value)
              );
            }}
            className={inputClass}
          />
        </FieldWrapper>

        <FieldWrapper>
          <label className={labelClass}>Hạn sử dụng (ngày)</label>
          <input
            type="number"
            value={form.usageValiDays || ""}
            onChange={(e) => handleChange("usageValiDays", Number(e.target.value))}
            className={inputClass}
          />
        </FieldWrapper>
      </div>

      {/* DATE */}
      <div className="grid grid-cols-2 gap-5">
        <FieldWrapper>
          <label className={labelClass}>Ngày bắt đầu</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            min={getMinStartDate()}
            className={inputClass}
          />
          <p className="text-xs text-gray-500 mt-1">Tối thiểu: {formatDateVN(getMinStartDate())} (cần 3 ngày để admin duyệt)</p>
        </FieldWrapper>

        <FieldWrapper>
          <label className={labelClass}>Ngày kết thúc</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            min={getMinEndDate()}
            max={getMaxEndDate()}
            disabled={!form.startDate}
            className={`${inputClass} ${!form.startDate ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            {form.startDate
              ? `Từ ${formatDateVN(getMinEndDate())} đến ${formatDateVN(getMaxEndDate())}`
              : "Chọn ngày bắt đầu trước"}
          </p>
        </FieldWrapper>
      </div>

      {/* LOCATION */}
      <FieldWrapper>
        <label className={labelClass}>Địa điểm áp dụng</label>
        <button
          type="button"
          onClick={() => setOpenLocationModal(true)}
          className="w-full mt-2 border border-violet-200 rounded-xl px-4 py-3 text-left text-gray-800 bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all font-medium"
        >
          Chọn địa điểm
        </button>

        <p className="text-sm text-violet-600 font-medium mt-2">
          {selectedLocationIds.length > 0
            ? `✓ ${selectedLocationIds.length} địa điểm đã chọn`
            : "Chưa chọn địa điểm"}
        </p>
      </FieldWrapper>

      {/* SUBMIT */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          {loading
            ? "Đang lưu..."
            : isEdit
              ? "Cập nhật"
              : "Hoàn thành"}
        </button>
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