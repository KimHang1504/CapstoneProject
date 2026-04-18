"use client";

import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PlacementType } from "@/api/venue/advertisement/type";
import { toast } from "sonner";
import { generateText, generateImage } from "@/utils/ai";
import { uploadImage } from "@/api/upload";
import { Sparkles, Wand2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  initialData?: {
    title: string;
    content: string;
    bannerUrl: string;
    targetUrl: string;
    placementType: PlacementType;
    moodTypeId?: number | null;
    desiredStartDate?: string | null;
  };
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
  moodOptions: {
    id: number;
    name: string;
  }[];
};

const inputClass =
  "w-full mt-2 border border-violet-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition placeholder-gray-300";

const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

export default function AdvertisementForm({
  initialData,
  onSubmit,
  submitLabel = "Hoàn thành",
  moodOptions = [],
}: Props) {
  const [desiredStartDate, setDesiredStartDate] = useState<Date | null>(
    initialData?.desiredStartDate ? new Date(initialData.desiredStartDate) : null
  );

  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    bannerUrl: initialData?.bannerUrl || "",
    targetUrl: initialData?.targetUrl || "",
    placementType: initialData?.placementType || "",
    moodTypeId: initialData?.moodTypeId ?? "",
  });

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [dateError, setDateError] = useState<string>("");
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "moodTypeId" ? (value ? Number(value) : "") : value,
    }));
  };

  const handleGenerateContent = async () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập mục đích quảng cáo trước");
      return;
    }

    setIsGeneratingContent(true);
    try {
      const systemPrompt = "Bạn là chuyên gia viết nội dung quảng cáo hấp dẫn và chuyên nghiệp cho các địa điểm giải trí, nhà hàng, cafe.";
      const userPrompt = `Viết nội dung quảng cáo hấp dẫn cho mục đích: "${form.title}". Nội dung ngắn gọn, thu hút, tối đa 150 từ, phù hợp để hiển thị trên banner hoặc popup quảng cáo.`;

      const content = await generateText(userPrompt, systemPrompt);

      if (content) {
        setForm({ ...form, content });
        toast.success("Đã tạo nội dung thành công!");
      } else {
        toast.error("Không thể tạo nội dung, vui lòng thử lại");
      }
    } catch (error: any) {
      console.error("Generate content error:", error);
      toast.error("Có lỗi xảy ra khi tạo nội dung");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập mục đích quảng cáo trước");
      return;
    }

    setIsGeneratingImage(true);
    try {
      const imagePrompt = `Professional advertisement banner for: ${form.title}. High quality, attractive, modern design, suitable for restaurant/cafe/entertainment venue promotion.`;

      const imageUrl = await generateImage(imagePrompt, {
        size: '1792x1024',
        quality: 'hd',
        style: 'vivid'
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
          `advertisement-ai-${Date.now()}.${extension}`,
          { type: imageBlob.type || "image/png" }
        );

        const uploadedUrl = await uploadImage(aiImageFile);
        setForm({ ...form, bannerUrl: uploadedUrl });
        toast.success("Đã tạo và tải banner lên thành công!");
      } else {
        toast.error("Không thể tạo banner, vui lòng thử lại");
      }
    } catch (error: any) {
      console.error("Generate image error:", error);
      toast.error("Có lỗi xảy ra khi tạo banner");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploadingBanner(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setForm({ ...form, bannerUrl: uploadedUrl });
      toast.success('Tải ảnh lên thành công!');
    } catch (error: any) {
      console.error('Upload banner error:', error);
      toast.error(error?.message || 'Không thể tải ảnh lên');
    } finally {
      setIsUploadingBanner(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    const missingFields: string[] = [];

    if (!form.title.trim()) missingFields.push("Mục đích quảng cáo");
    if (!form.content.trim()) missingFields.push("Nội dung");
    if (!form.bannerUrl.trim()) missingFields.push("Banner");
    if (!form.targetUrl.trim()) missingFields.push("Link khi click");
    if (!form.moodTypeId) missingFields.push("Mood type");
    if (!desiredStartDate) missingFields.push("Ngày bắt đầu");

    if (missingFields.length > 0) {
      toast.error(`Vui lòng điền: ${missingFields.join(", ")}`);
      return;
    }

    // Validate date
    if (!validateDate(desiredStartDate)) {
      toast.error(dateError);
      return;
    }

    const payload = {
      ...form,
      moodTypeId: Number(form.moodTypeId),
      desiredStartDate: desiredStartDate ? desiredStartDate.toISOString() : null,
    };

    try {
      await onSubmit(payload);
      toast.success("Đã lưu quảng cáo thành công!");
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi khi lưu quảng cáo");
    }
  };


  const getMinDate = () => {
    const now = new Date();
    const minDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // Add 3 days
    return minDate;
  };

  const validateDate = (date: Date | null) => {
    if (!date) {
      setDateError("");
      return true;
    }

    const now = new Date();
    const minDate = getMinDate();

    if (date < now) {
      setDateError("Ngày bắt đầu không được là quá khứ");
      return false;
    }

    if (date < minDate) {
      const daysRemaining = Math.ceil((minDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      setDateError(`Ngày bắt đầu phải sau 72h ngày để admin có thời gian duyệt`);
      return false;
    }

    setDateError("");
    return true;
  };

  return (
    <div className="bg-white p-8 mx-50 space-y-7">
      <h1 className="text-2xl font-bold text-gray-800">
        {submitLabel === "Tạo mới quảng cáo" ? "Tạo mới quảng cáo" : "Chỉnh sửa quảng cáo"}
      </h1>
      {/* Title */}
      <FieldWrapper>
        <label className={labelClass}>Mục đích quảng cáo</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Nhập tiêu đề quảng cáo..."
          className={inputClass}
        />
      </FieldWrapper>

      {/* Content */}
      <FieldWrapper>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Nội dung</label>
          <button
            type="button"
            onClick={handleGenerateContent}
            disabled={isGeneratingContent || !form.title.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-purple-500 to-indigo-600 text-white text-xs font-medium rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {isGeneratingContent ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Tạo bằng AI
              </>
            )}
          </button>
        </div>
        <textarea
          name="content"
          value={form.content}
          onChange={(e) => {
            if (e.target.value.length <= 1000) {
              handleChange(e);
            } else {
              toast.error("Nội dung không được vượt quá 1000 ký tự");
            }
          }}
          placeholder="Mô tả ngắn về quảng cáo..."
          className={`${inputClass} resize-none h-32`}
        />
        <div className="text-xs text-gray-400 mt-1 text-right">
          {form.content.length} / 1000 ký tự
        </div>
      </FieldWrapper>

      {/* Target URL */}
      <FieldWrapper>
        <label className={labelClass}>Link khi click</label>
        <div className="relative mt-2">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </span>
          <input
            name="targetUrl"
            value={form.targetUrl}
            onChange={handleChange}
            placeholder="https://..."
            className={`${inputClass} mt-0 pl-10`}
          />
        </div>
      </FieldWrapper>

      {/* Banner + Preview */}
      <FieldWrapper>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Banner</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('banner-file-input')?.click()}
              disabled={isUploadingBanner}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-blue-500 to-cyan-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isUploadingBanner ? (
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
                  Tạo banner AI
                </>
              )}
            </button>
          </div>
        </div>
        <input
          id="banner-file-input"
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          disabled={isUploadingBanner}
          className="hidden"
        />

        {form.bannerUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-violet-100 shadow-sm relative">
            <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Preview</div>
            <Image
              src={form.bannerUrl}
              alt="preview"
              width={800}
              height={200}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </FieldWrapper>

      {/* Placement */}
      {/* <FieldWrapper>
        <label className={labelClass}>Vị trí hiển thị</label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {([
            {
              value: "HOME_BANNER", label: "Banner đầu trang", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
              )
            },
            {
              value: "POPUP", label: "Popup", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              )
            },
          ] as { value: PlacementType; label: string; icon: React.ReactNode }[]).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, placementType: opt.value })}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${form.placementType === opt.value
                ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:bg-violet-50/50"
                }`}
            >
              <span className={form.placementType === opt.value ? "text-violet-500" : "text-gray-400"}>
                {opt.icon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>

        <select
          name="placementType"
          value={form.placementType}
          onChange={handleChange}
          className="sr-only"
          aria-hidden="true"
        >
          <option value="HOME_BANNER">Banner đầu trang</option>
          <option value="POPUP">Popup</option>
        </select>
      </FieldWrapper> */}

      <FieldWrapper>
        <label className={labelClass}>Tâm trạng</label>

        <div className="mt-2 flex flex-wrap gap-2">
          {(moodOptions ?? []).map((mood) => {
            const isSelected = Number(form.moodTypeId) === mood.id;

            return (
              <button
                key={mood.id}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    moodTypeId: mood.id,
                  }))
                }
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
            ${isSelected
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-white text-gray-700 border-violet-200 hover:border-violet-400 hover:text-violet-600"
                  }`}
              >
                {mood.name}
              </button>
            );
          })}
        </div>
      </FieldWrapper>

      {/* Date */}
      <FieldWrapper>
        <label className={labelClass}>Ngày bắt đầu</label>
        <div className="relative mt-2">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400 z-10 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <DatePicker
            selected={desiredStartDate}
            onChange={(date: Date | null) => {
              setDesiredStartDate(date);
              validateDate(date);
            }}
            minDate={getMinDate()}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Chọn ngày bắt đầu..."
            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition ${dateError
                ? "border-rose-300 focus:ring-rose-400"
                : "border-violet-200 focus:ring-violet-400"
              }`}
          />
        </div>
        {dateError && (
          <p className="text-xs text-rose-600 mt-2 flex items-center gap-1.5">
              <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.415-1.414L11 16.586V9.5a1 1 0 10-2 0v7.086L3.314 11.516a1 1 0 00-1.414 1.414l9.9 9.9a1 1 0 001.415 0l9.9-9.9z" clipRule="evenodd" />
            {dateError}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2.5 flex items-start gap-2">
          <svg className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Quảng cáo cần ít nhất <span className="font-semibold text-gray-700">72h</span> để admin duyệt. Vui lòng lên lịch trước khoảng thời gian này.</span>
        </p>
      </FieldWrapper>

      {/* Submit */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          {submitLabel}
        </button>
      </div>

    </div>
  );
}
