"use client";

import { createSpecialEvent } from "@/api/admin/api";
import { CreateSpecialEventRequest } from "@/api/admin/type";
import { uploadImage } from "@/api/upload";
import { useState } from "react";

export default function CreateEventPage() {
  const [form, setForm] = useState({
    eventName: "",
    description: "",
    bannerUrl: "",
    startDate: "",
    endDate: "",
    isYearly: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];

      if (file) {
        setFile(file);
        setBannerPreview(URL.createObjectURL(file));
      }
    } else if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {

      setForm({
        ...form,
        [name]: e.target.checked,
      });

    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = await uploadImage(file as File);
      const payload: CreateSpecialEventRequest = {
        eventName: form.eventName,
        description: form.description,
        bannerUrl: url,
        startDate: new Date(form.startDate + "T00:00:00").toISOString(),
        endDate: new Date(form.endDate + "T23:59:59").toISOString(),
        isYearly: form.isYearly,
      };

      console.log(payload);
      const res = await createSpecialEvent(payload);
      if (res.code === 201) {
        alert("Tạo sự kiện thành công");
      } else {
        alert("Tạo sự kiện thất bại: " + res.message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Có lỗi xảy ra khi tạo sự kiện");
    } finally {
      setForm({
        eventName: "",
        description: "",
        bannerUrl: "",
        startDate: "",
        endDate: "",
        isYearly: false,
      });
      setBannerPreview(null);
    }

  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Tạo sự kiện</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium mb-1">
            Tên sự kiện
          </label>
          <input
            type="text"
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mô tả sự kiện
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ảnh banner quảng cáo
          </label>

          <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition">
            {bannerPreview ? (
              <img
                src={bannerPreview}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 text-sm">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
                </svg>

                <p>Nhấn vào để upload ảnh</p>
              </div>
            )}

            <input
              type="file"
              name="bannerUrl"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày kết thúc
          </label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isYearly"
            checked={form.isYearly}
            onChange={handleChange}
            className="h-4 w-4 text-violet-600 border-gray-300 rounded"
          />
          <label className="text-sm font-medium">
            Sự kiện diễn ra hàng năm
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 text-white hover:bg-violet-700 py-2 rounded-lg"
        >
          Tạo sự kiện
        </button>
      </form>
    </div>
  );
}