"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlacementType } from "@/api/venue/advertisement/type";
import { createAdvertisement } from "@/api/venue/advertisement/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateAdvertisementPage() {
  const router = useRouter();

  const [desiredStartDate, setDesiredStartDate] = useState<Date | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    bannerUrl: "",
    targetUrl: "",
    placementType: "BANNER" as PlacementType,
    desiredStartDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        desiredStartDate: desiredStartDate
          ? desiredStartDate.toISOString()
          : "",
      };

      const response = await createAdvertisement(payload);

      console.log(response);

      alert("Tạo quảng cáo thành công!");

      router.push("/venue/advertisement");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4FB] flex justify-center py-12 px-6">

      <div className="w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-center mb-10">
          Thiết lập quảng cáo
        </h1>

        <div className="space-y-6">

          {/* Title */}
          <div>
            <label className="text-sm font-medium">
              Mục đích quảng cáo <span className="text-red-500">*</span>
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ra mắt nước uống mới"
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Target URL */}
          <div>
            <label className="text-sm font-medium">
              Link định hướng khi click
            </label>

            <input
              name="targetUrl"
              value={form.targetUrl}
              onChange={handleChange}
              placeholder="nuocuongmoi.com"
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Banner URL */}
          <div>
            <label className="text-sm font-medium">
              Ảnh quảng cáo
            </label>

            <input
              name="bannerUrl"
              value={form.bannerUrl}
              onChange={handleChange}
              placeholder="Dán link ảnh banner"
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {form.bannerUrl && (
              <div className="mt-4 rounded-2xl overflow-hidden border">
                <Image
                  src={form.bannerUrl}
                  alt="preview"
                  width={800}
                  height={200}
                  className="w-full h-50 object-cover"
                />
              </div>
            )}
          </div>

          {/* Placement */}
          <div>
            <label className="text-sm font-medium">
              Vị trí quảng cáo
            </label>

            <select
              name="placementType"
              value={form.placementType}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="BANNER">Banner đầu trang</option>
              <option value="LIST">Danh sách địa điểm</option>
              <option value="VOUCHER">Voucher nổi bật</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium">
              Ngày bắt đầu chạy quảng cáo
            </label>
            <div>
              <DatePicker
                selected={desiredStartDate}
                onChange={(date: Date | null) => setDesiredStartDate(date)}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Chọn ngày bắt đầu"
                className="w-full mt-2 border rounded-xl px-4 py-3 bg-white"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">

            <button
              onClick={() => router.back()}
              className="px-6 py-2 rounded-xl border bg-white hover:bg-gray-50"
            >
              Trở lại
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Hoàn thành
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}