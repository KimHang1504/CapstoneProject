"use client";

import { createSpecialEvent } from "@/api/admin/api";
import { CreateSpecialEventRequest } from "@/api/admin/type";
import { uploadImage } from "@/api/upload";
import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Upload, Image as ImageIcon } from "lucide-react";

const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

const inputClass = "w-full mt-2 border border-violet-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition placeholder-gray-300";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

export default function CreateEventPage() {
  const router = useRouter();
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
      if (!file) {
        toast.error("Vui lòng chọn ảnh banner cho sự kiện");
        return;
      }
      if (new Date(form.startDate) > new Date(form.endDate)) {
        toast.error("Ngày bắt đầu phải trước ngày kết thúc");
        return;
      }
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
        toast.success("Tạo sự kiện thành công");
        router.push("/admin/special-event-management");
      } else {
        toast.error("Tạo sự kiện thất bại: " + res.message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo sự kiện";
      toast.error(errorMessage);
    } finally {
    }

  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/40 to-violet-50/30 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Tạo sự kiện đặc biệt
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Thêm sự kiện của bạn vào hệ thống
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFO */}
          <div className="bg-white rounded-2xl shadow p-8 space-y-7">
            <h2 className="text-lg font-semibold text-gray-800">Thông tin sự kiện</h2>

            <FieldWrapper>
              <label className={labelClass}>Tên sự kiện</label>
              <input
                type="text"
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
                placeholder="VD: Tết Nguyên Đán, Lễ Phục Sinh..."
                className={inputClass}
                required
              />
            </FieldWrapper>

            <FieldWrapper>
              <label className={labelClass}>Mô tả sự kiện</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về sự kiện này..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </FieldWrapper>

            <label className="flex items-center gap-3 p-4 rounded-xl border border-violet-200 bg-violet-50/50 cursor-pointer hover:bg-violet-50 transition">
              <input
                type="checkbox"
                name="isYearly"
                checked={form.isYearly}
                onChange={handleChange}
                className="w-4 h-4 text-violet-600 border-gray-300 rounded"
              />
              <div>
                <p className="font-medium text-gray-800">Sự kiện diễn ra hàng năm</p>
                <p className="text-xs text-gray-500">Được lặp lại vào cùng khoảng thời gian hàng năm</p>
              </div>
            </label>
          </div>

          {/* BANNER SECTION */}
          <div className="bg-white rounded-2xl shadow p-8 space-y-7">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ImageIcon size={20} />
              Banner sự kiện
            </h2>

            <div>
              <label className={labelClass}>Ảnh banner</label>
              <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-violet-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition mt-2">
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500 text-sm">
                    <Upload size={32} className="mb-3 text-violet-400" />
                    <p className="font-medium">Nhấp để upload ảnh banner</p>
                    <p className="text-xs text-gray-400 mt-1">Hoặc kéo thả tệp vào đây</p>
                  </div>
                )}

                <input
                  type="file"
                  name="bannerUrl"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* TIME SECTION */}
          <div className="bg-white rounded-2xl shadow p-8 space-y-7">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Calendar size={20} />
              Thời gian sự kiện
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <FieldWrapper>
                <label className={labelClass}>Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </FieldWrapper>

              <FieldWrapper>
                <label className={labelClass}>Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </FieldWrapper>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-violet-200 text-violet-600 rounded-xl hover:bg-violet-50 transition font-medium"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-medium"
            >
              <Calendar size={18} />
              Tạo sự kiện
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}