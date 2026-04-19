"use client";

import { useState } from "react";
import { CreateVoucherRequest, DiscountType } from "@/api/venue/vouchers/type";
import SelectLocationModal from "@/app/venue/voucher/component/SelectLocationModal";
import { uploadImage } from "@/api/upload";
import { generateImage } from "@/utils/ai";
import { toast } from "sonner";
import {
  Upload,
  Wand2,
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
    usageValidDays: null,
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  //lỗi onblur


  const validateField = (
    key: keyof CreateVoucherRequest,
    value: any,
    form: CreateVoucherRequest
  ): string => {
    switch (key) {
      // case "title":
      //   if (!value?.trim()) return "Vui lòng nhập tên voucher";
      //   return "";

      // case "description":
      //   if (!value?.trim()) return "Vui lòng nhập mô tả voucher";
      //   return "";

      case "voucherPrice":
        // if (value == null) return "Vui lòng nhập giá đổi";
        if (value < 0) return "Giá đổi không được âm";
        if (value > 100_000_000) return "Không vượt quá 100,000,000";
        return "";

      case "quantity": {
        if (value == null || value === "") return "";

        const num = Number(value);
        if (Number.isNaN(num)) return "Giá trị không hợp lệ";

        if (num <= 0) return "Số lượng phải > 0";
        if (num > 100_000) return "Không vượt quá 100,000";

        return "";
      }

      case "usageLimitPerMember": {
        if (value == null || value === "") return "";

        const num = Number(value);
        if (Number.isNaN(num)) return "Giá trị không hợp lệ";

        if (num <= 0) return "Phải > 0";

        if (form.quantity != null && num > form.quantity)
          return "Không vượt quá số lượng";

        return "";
      }

      case "usageValidDays":
        if (value == null || value === "") return "";

        const num = Number(value);
        if (Number.isNaN(num)) return "Giá trị không hợp lệ";
        if (num <= 0) return "Phải > 0";
        if (num > 365) return "Không vượt quá 365 ngày";
        return "";

      case "discountAmount": {
        if (form.discountType !== "FIXED_AMOUNT") return "";

        if (value == null || value === "") return "";

        const num = Number(value);

        if (Number.isNaN(num)) return "Giá trị không hợp lệ";

        if (num <= 0) return "Số tiền giảm phải > 0";

        if (num > 100_000_000) return "Không vượt quá 100,000,000";

        return "";
      }

      case "discountPercent":
        if (form.discountType !== "PERCENTAGE") return "";
        if (value == null) return "Nhập % giảm";
        if (value <= 0) return "Phải > 0";
        if (value > 100) return "Không vượt quá 100%";
        return "";

      case "startDate":
        if (!value) return "Chọn ngày bắt đầu";
        if (value < getMinStartDate())
          return "Ngày bắt đầu không hợp lệ";
        return "";

      case "endDate":
        if (!value) return "Chọn ngày kết thúc";
        if (value < getMinEndDate())
          return "End date quá sớm";
        if (value > getMaxEndDate())
          return "End date quá xa";
        return "";

      // case "imageUrl":
      //   if (!value) return "Vui lòng tải ảnh";
      //   return "";

      default:
        return "";
    }
  };

  const handleBlur = (key: keyof CreateVoucherRequest) => {
    setTouched((prev) => ({ ...prev, [key]: true }));

    const rawValue = form[key];

    const error = validateField(key, rawValue, form);

    setErrors((prev) => {
      const updated = { ...prev };

      if (!error) delete updated[key];
      else updated[key] = error;

      return updated;
    });
  };

  const handleChangeField = (key: keyof CreateVoucherRequest, value: any) => {
    // console.log("[CHANGE]", key, value, typeof value);

    setForm((prev) => {
      const nextForm = {
        ...prev,
        [key]: value,
      };

      const error = validateField(key, value, nextForm);

      console.log("[VALIDATE]", key, {
        value,
        nextForm,
        error,
        touched: touched[key],
      });

      setErrors((prevErr) => {
        const updated = { ...prevErr };

        if (!error) delete updated[key];
        else updated[key] = error;

        return updated;
      });

      return nextForm;
    });
  };

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
    startDate.setDate(startDate.getDate() + 90);
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

  const handleGenerateImage = async () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tên voucher trước");
      return;
    }

    setIsGeneratingImage(true);
    try {
      const imagePrompt = `Professional voucher design for: ${form.title}. ${form.description ? `Description: ${form.description}.` : ""} High quality, modern style, attractive for restaurant/cafe/entertainment promotion.`;

      const imageUrl = await generateImage(imagePrompt, {
        size: "1024x1024",
        quality: "hd",
        style: "vivid",
      });

      if (imageUrl) {
        const proxyResponse = await fetch("/api/ai-image/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: imageUrl }),
        });

        if (!proxyResponse.ok) {
          throw new Error("Không thể tải ảnh AI để upload");
        }

        const imageBlob = await proxyResponse.blob();
        const extension = imageBlob.type.split("/")[1] || "png";
        const aiImageFile = new File(
          [imageBlob],
          `voucher-ai-${Date.now()}.${extension}`,
          { type: imageBlob.type || "image/png" }
        );

        const uploadedUrl = await uploadImage(aiImageFile);
        handleChange("imageUrl", uploadedUrl);
        toast.success("Đã tạo và tải ảnh voucher lên thành công!");
      } else {
        toast.error("Không thể tạo ảnh voucher, vui lòng thử lại");
      }
    } catch (error) {
      console.error("Generate voucher image error:", error);
      toast.error("Có lỗi xảy ra khi tạo ảnh voucher");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async () => {

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

      // if (form.discountAmount <= 0) {
      //   toast.error("Số tiền giảm phải lớn hơn 0");
      //   return;
      // }

      // if (form.discountAmount > 100_000_000) {
      //   toast.error("Số tiền giảm không được vượt quá 100,000,000 VND");
      //   return;
      // }
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

      // if (form.discountPercent > 100) {
      //   toast.error("Phần trăm giảm không được vượt quá 100%");
      //   return;
      // }
    }

    if (form.voucherPrice === null || form.voucherPrice === undefined) {
      toast.error("Vui lòng nhập giá đổi");
      return;
    }

    // if (form.voucherPrice < 0) {
    //   toast.error("Giá đổi không được âm");
    //   return;
    // }

    // if (form.voucherPrice > 100_000_000) {
    //   toast.error("Giá đổi không được vượt quá 100,000,000 điểm");
    //   return;
    // }

    if (
      form.quantity === null ||
      form.quantity === undefined ||
      Number.isNaN(form.quantity)
    ) {
      toast.error("Vui lòng nhập số lượng");
      return;
    }

    // if (form.quantity <= 0) {
    //   toast.error("Số lượng phải lớn hơn 0");
    //   return;
    // }

    // if (form.quantity > 100_000) {
    //   toast.error("Số lượng không được vượt quá 100,000");
    //   return;
    // }

    if (
      form.usageLimitPerMember === null ||
      form.usageLimitPerMember === undefined ||
      Number.isNaN(form.usageLimitPerMember)
    ) {
      toast.error("Vui lòng nhập giới hạn mỗi người");
      return;
    }

    // if (form.usageLimitPerMember != null) {
    //   if (form.usageLimitPerMember <= 0) {
    //     toast.error("Giới hạn mỗi người phải lớn hơn 0");
    //     return;
    //   }

    //   if (
    //     form.quantity != null &&
    //     form.usageLimitPerMember > form.quantity
    //   ) {
    //     toast.error("Giới hạn mỗi người không được vượt quá số lượng");
    //     return;
    //   }
    // }

    if (
      form.quantity != null &&
      form.usageLimitPerMember != null &&
      form.usageLimitPerMember > form.quantity
    ) {
      toast.error("Giới hạn mỗi người không được vượt quá số lượng");
      return;
    }

    if (!form.usageValidDays) {
      toast.error("Vui lòng nhập hạn sử dụng");
      return;
    }

    if (!form.startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return;
    }

    // const minStartDate = getMinStartDate();
    // if (form.startDate < minStartDate) {
    //   toast.error(`Ngày bắt đầu phải từ ${formatDateVN(minStartDate)} trở đi (cần 3 ngày để admin duyệt)`);
    //   return;
    // }

    if (!form.endDate) {
      toast.error("Vui lòng chọn ngày kết thúc");
      return;
    }

    // const minEndDate = getMinEndDate();
    // const maxEndDate = getMaxEndDate();
    // if (form.endDate < minEndDate) {
    //   toast.error(`Ngày kết thúc phải từ ${formatDateVN(minEndDate)} trở đi`);
    //   return;
    // }

    // if (form.endDate > maxEndDate) {
    //   toast.error(`Ngày kết thúc không được quá ${formatDateVN(maxEndDate)}`);
    //   return;
    // }

    if (selectedLocationIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một địa điểm");
      return;
    }

    if (!form.imageUrl) {
      toast.error("Vui lòng tải lên ảnh voucher");
      return;
    }

    if (
      form.usageValidDays === null ||
      form.usageValidDays === undefined ||
      Number.isNaN(form.usageValidDays)
    ) {
      toast.error("Vui lòng nhập hạn sử dụng");
      return;
    }

    // if (form.usageValidDays <= 0) {
    //   toast.error("Hạn sử dụng phải lớn hơn 0");
    //   return;
    // }

    // if (form.usageValidDays > 365) {
    //   toast.error("Hạn sử dụng không được vượt quá 365 ngày");
    //   return;
    // }

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
    } catch (error: any) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại");
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
        <label className={labelClass}>Tên voucher <span className="text-red-500">*</span></label>
        <input
          name="title"
          value={form.title}
          onChange={(e) => handleChangeField("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          placeholder="Nhập tên voucher..."
          className={`
    w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
    focus:outline-none focus:ring-1 transition placeholder-gray-300
    ${errors.title
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
            }
  `}
        />

        {errors.title && (
          <p className="text-red-500 text-xs mt-1">
            {errors.title}
          </p>
        )}
      </FieldWrapper>

      {/* DESCRIPTION */}
      <FieldWrapper>
        <label className={labelClass}>Mô tả <span className="text-red-500">*</span></label>
        {/* <Tiptap
            value={form.description || ""}
            onChange={(val) => handleChange("description", val)}
          /> */}
        <textarea
          name="description"
          value={form.description}
          onChange={(e) =>
            handleChangeField("description", e.target.value)
          }
          onBlur={() => handleBlur("description")}
          placeholder="Nhập mô tả voucher..."
          className={`
            w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
            focus:outline-none focus:ring-1 transition placeholder-gray-300
            ${errors.description
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
            }
  `}
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description}
          </p>
        )}
      </FieldWrapper>

      {/* IMAGE */}
      <FieldWrapper>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Ảnh voucher <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
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
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !form.title.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-pink-500 to-rose-600 text-white text-xs font-medium rounded-lg hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isGeneratingImage ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Wand2 size={14} />
                  Tạo ảnh AI
                </>
              )}
            </button>
          </div>
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
        <label className={labelClass}>Loại giảm giá <span className="text-red-500">*</span></label>
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
          <label className={labelClass}>Số tiền giảm (VND) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={form.discountAmount ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              handleChangeField(
                "discountAmount",
                value === "" ? null : Number(value)
              );
            }}
            className={`
                  w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                  focus:outline-none focus:ring-1 transition placeholder-gray-300
                  ${errors.discountAmount
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
              }
            `}
          />
          {errors.discountAmount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.discountAmount}
            </p>
          )}
        </FieldWrapper>
      )}

      {form.discountType === "PERCENTAGE" && (
        <FieldWrapper>
          <label className={labelClass}>Phần trăm giảm (%) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={form.discountPercent ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              handleChangeField(
                "discountPercent",
                value === "" ? null : Number(value)
              );
            }}
            className={`
                  w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                  focus:outline-none focus:ring-1 transition placeholder-gray-300
                  ${errors.discountPercent
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
              }
            `}
          />
          {errors.discountPercent && (
            <p className="text-red-500 text-xs mt-1">
              {errors.discountPercent}
            </p>
          )}
        </FieldWrapper>
      )}

      {/* PRICE + QUANTITY */}
      <div className="grid grid-cols-2 gap-5">
        <FieldWrapper>
          <label className={labelClass}>Giá đổi <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={form.voucherPrice ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              handleChangeField(
                "voucherPrice",
                value === "" ? null : Number(value)
              );
            }}
            className={`
                  w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                  focus:outline-none focus:ring-1 transition placeholder-gray-300
                  ${errors.voucherPrice
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
              }
            `}
          />
          {errors.voucherPrice && (
            <p className="text-red-500 text-xs mt-1">
              {errors.voucherPrice}
            </p>
          )}
        </FieldWrapper>

        <FieldWrapper>
          <label className={labelClass}>Số lượng <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={form.quantity ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              handleChangeField(
                "quantity",
                value === "" ? null : Number(value)
              );
            }}
            className={`
                  w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                  focus:outline-none focus:ring-1 transition placeholder-gray-300
                  ${errors.quantity
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
              }
            `}
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.quantity}
            </p>
          )}
        </FieldWrapper>
      </div>

      {/* LIMIT */}
      <div className="grid grid-cols-2 gap-5">
        <FieldWrapper>
          <label className={labelClass}>Giới hạn mỗi người <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={form.usageLimitPerMember ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              handleChangeField(
                "usageLimitPerMember",
                value === "" ? null : Number(value)
              );
            }}
            className={`
                  w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                  focus:outline-none focus:ring-1 transition placeholder-gray-300
                  ${errors.usageLimitPerMember
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
              }
            `}
          />
          {errors.usageLimitPerMember && (
            <p className="text-red-500 text-xs mt-1">
              {errors.usageLimitPerMember}
            </p>
          )}
        </FieldWrapper>

        <FieldWrapper>
          <label className={labelClass}>Hạn sử dụng (ngày) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={form.usageValidDays ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              handleChangeField(
                "usageValidDays",
                value === "" ? null : Number(value)
              );
            }}
            className={`
                  w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                  focus:outline-none focus:ring-1 transition placeholder-gray-300
                  ${errors.usageValidDays
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
              }
            `}
          />
          {errors.usageValidDays && (
            <p className="text-red-500 text-xs mt-1">
              {errors.usageValidDays}
            </p>
          )}
        </FieldWrapper>
      </div>

      {/* DATE */}
      <div className="grid grid-cols-2 gap-5">
        <FieldWrapper>
          <label className={labelClass}>Ngày bắt đầu <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            min={getMinStartDate()}
            className={`
                  w-full mt-2 border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                  focus:outline-none focus:ring-1 transition placeholder-gray-300
                  ${errors.startDate
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-violet-200 focus:ring-violet-400 focus:border-transparent"
              }
            `}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startDate}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Tối thiểu: {formatDateVN(getMinStartDate())} (cần 3 ngày để admin duyệt)</p>
        </FieldWrapper>

        <FieldWrapper>
          <label className={labelClass}>Ngày kết thúc <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            min={getMinEndDate()}
            max={getMaxEndDate()}
            disabled={!form.startDate}
            className={`${inputClass} ${!form.startDate ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endDate}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {form.startDate
              ? `Từ ${formatDateVN(getMinEndDate())} đến ${formatDateVN(getMaxEndDate())}`
              : "Chọn ngày bắt đầu trước"}
          </p>
        </FieldWrapper>
      </div>

      {/* LOCATION */}
      <FieldWrapper>
        <label className={labelClass}>Địa điểm áp dụng <span className="text-red-500">*</span></label>
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