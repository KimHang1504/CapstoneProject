"use client";

import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PlacementType } from "@/api/venue/advertisement/type";
import toast from "react-hot-toast";

type Props = {
  initialData?: {
    title: string;
    content: string;
    bannerUrl: string;
    targetUrl: string;
    placementType: PlacementType;
    desiredStartDate?: string | null;
  };
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
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
}: Props) {
  const [desiredStartDate, setDesiredStartDate] = useState<Date | null>(
    initialData?.desiredStartDate ? new Date(initialData.desiredStartDate) : null
  );

  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    bannerUrl: initialData?.bannerUrl || "",
    targetUrl: initialData?.targetUrl || "",
    placementType: initialData?.placementType || "HOME_BANNER",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const missingFields: string[] = [];
    if (!form.title.trim()) missingFields.push("Mục đích quảng cáo");
    if (!form.content.trim()) missingFields.push("Nội dung");
    if (!form.bannerUrl.trim()) missingFields.push("Banner URL");
    if (!form.targetUrl.trim()) missingFields.push("Link khi click");
    if (!desiredStartDate) missingFields.push("Ngày bắt đầu");

    if (missingFields.length > 0) {
      toast.error(`Vui lòng điền: ${missingFields.join(", ")}`);
      return;
    }

    const payload = {
      ...form,
      desiredStartDate: desiredStartDate ? desiredStartDate.toISOString() : null,
    };

    try {
      await onSubmit(payload);
      toast.success("Đã lưu quảng cáo thành công!");
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi khi lưu quảng cáo");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-violet-100 shadow-sm p-8 mx-50 space-y-7">

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
        <label className={labelClass}>Nội dung</label>
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
          className={`${inputClass} resize-none h-32`} // h-32 để cao hơn, resize-none để cố định chiều cao
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

      {/* Banner URL + Preview */}
      <FieldWrapper>
        <label className={labelClass}>Banner URL</label>
        <div className="relative mt-2">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            name="bannerUrl"
            value={form.bannerUrl}
            onChange={handleChange}
            placeholder="https://..."
            className={`${inputClass} mt-0 pl-10`}
          />
        </div>

        {form.bannerUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-violet-100 shadow-sm relative">
            <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Preview
            </div>
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
      <FieldWrapper>
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
        {/* hidden select to keep form.placementType in sync */}
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
            onChange={(date: Date | null) => setDesiredStartDate(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Chọn ngày bắt đầu..."
            className="w-full border border-violet-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
          />
        </div>
      </FieldWrapper>

      {/* Submit */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          {submitLabel}
        </button>
      </div>

    </div>
  );
}
