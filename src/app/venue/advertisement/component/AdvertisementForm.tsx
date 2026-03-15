"use client";

import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PlacementType } from "@/api/venue/advertisement/type";

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

export default function AdvertisementForm({
  initialData,
  onSubmit,
  submitLabel = "Hoàn thành",
}: Props) {

  const [desiredStartDate, setDesiredStartDate] = useState<Date | null>(
    initialData?.desiredStartDate
      ? new Date(initialData.desiredStartDate)
      : null
  );

  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    bannerUrl: initialData?.bannerUrl || "",
    targetUrl: initialData?.targetUrl || "",
    placementType: initialData?.placementType || "HOME_BANNER",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      desiredStartDate: desiredStartDate
        ? desiredStartDate.toISOString()
        : null,
    };

    await onSubmit(payload);
  };

  return (
    <div className="space-y-6">

      {/* Title */}
      <div>
        <label className="text-sm font-medium">
          Mục đích quảng cáo
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full mt-2 border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Nội dung
        </label>

        <input
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full mt-2 border rounded-xl px-4 py-3"
        />
      </div>
      {/* Target URL */}
      <div>
        <label className="text-sm font-medium">
          Link khi click
        </label>

        <input
          name="targetUrl"
          value={form.targetUrl}
          onChange={handleChange}
          className="w-full mt-2 border rounded-xl px-4 py-3"
        />
      </div>

      {/* Banner */}
      <div>
        <label className="text-sm font-medium">
          Banner URL
        </label>

        <input
          name="bannerUrl"
          value={form.bannerUrl}
          onChange={handleChange}
          className="w-full mt-2 border rounded-xl px-4 py-3"
        />

        {form.bannerUrl && (
          <div className="mt-4 border rounded-xl overflow-hidden">
            <Image
              src={form.bannerUrl}
              alt="preview"
              width={800}
              height={200}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </div>

      {/* Placement */}
      <div>
        <label className="text-sm font-medium">
          Vị trí
        </label>

        <select
          name="placementType"
          value={form.placementType}
          onChange={handleChange}
          className="w-full mt-2 border rounded-xl px-4 py-3"
        >
          <option value="HOME_BANNER">Banner đầu trang</option>
          <option value="POPUP">Popup</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="text-sm font-medium">
          Ngày bắt đầu
        </label>

        <DatePicker
          selected={desiredStartDate}
          onChange={(date: Date | null) => setDesiredStartDate(date)}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          className="w-full mt-2 border rounded-xl px-4 py-3"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-indigo-500 text-white rounded-xl"
      >
        {submitLabel}
      </button>

    </div>
  );
}