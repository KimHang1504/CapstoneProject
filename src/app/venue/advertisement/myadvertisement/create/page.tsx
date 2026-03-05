"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlacementType } from "@/api/venue/advertisement/type";
import { createAdvertisement } from "@/api/venue/advertisement/api";

export default function CreateAdvertisementPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    bannerUrl: "",
    targetUrl: "",
    placementType: "HOME_BANNER" as PlacementType,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await createAdvertisement(form);

      console.log(response); // full ApiResponse
      alert("Tạo thành công!");

      router.push("/venue/advertisement");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Tạo quảng cáo
      </h1>

      <div className="space-y-4">
        <input
          name="title"
          placeholder="Tiêu đề"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="content"
          placeholder="Nội dung"
          value={form.content}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="bannerUrl"
          placeholder="Banner URL"
          value={form.bannerUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="targetUrl"
          placeholder="Target URL"
          value={form.targetUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="placementType"
          value={form.placementType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="HOME_BANNER">
            HOME_BANNER
          </option>
          <option value="DETAIL_BANNER">
            DETAIL_BANNER
          </option>
          <option value="POPUP">
            POPUP
          </option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Tạo quảng cáo
        </button>
      </div>
    </div>
  );
}