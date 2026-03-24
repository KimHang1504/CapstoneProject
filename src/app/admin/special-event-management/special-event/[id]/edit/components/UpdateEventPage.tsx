"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";
import { updateSpecialEvent } from "@/api/admin/api";
import { uploadImage } from "@/api/upload";

export default function UpdateEventPage({ event }: any) {
    const router = useRouter();

    const [form, setForm] = useState({
        eventName: "",
        description: "",
        bannerUrl: "",
        startDate: "",
        endDate: "",
        isYearly: false,
    });

    const toLocalDateInput = (iso: string) => {
        if (!iso) return "";

        const date = new Date(iso);

        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).split("/").reverse().join("-");
    };

    const [file, setFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!event) return;

        setForm({
            eventName: event.eventName || "",
            description: event.description || "",
            bannerUrl: event.bannerUrl || "",
            startDate: toLocalDateInput(event.startDate),
            endDate: toLocalDateInput(event.endDate),
            isYearly: event.isYearly || false,
        });

        setBannerPreview(event.bannerUrl);
    }, [event]);

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
        } else if (
            e.target instanceof HTMLInputElement &&
            e.target.type === "checkbox"
        ) {
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
            let bannerUrl = form.bannerUrl;

            if (file) {
                bannerUrl = await uploadImage(file);
            }

            const payload = {
                eventName: form.eventName,
                description: form.description,
                bannerUrl,
                startDate: new Date(form.startDate + "T00:00:00").toISOString(),
                endDate: new Date(form.endDate + "T23:59:59").toISOString(),
                isYearly: form.isYearly,
            };

            const res = await updateSpecialEvent(event.id, payload);

            if (res.code === 200) {
                toast.success("Cập nhật sự kiện thành công");
                router.push("/admin/special-event-management");
            } else {
                toast.error("Cập nhật thất bại: " + res.message);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <BackButton />

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Cập nhật sự kiện
                </h1>
                <p className="text-sm text-gray-500">
                    Chỉnh sửa thông tin sự kiện
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className="text-sm font-medium">Tên sự kiện</label>
                    <input
                        type="text"
                        name="eventName"
                        value={form.eventName}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-400"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Mô tả</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-400"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Banner
                    </label>

                    <label className="flex items-center justify-center w-full h-60 border-2 border-dashed rounded-xl cursor-pointer hover:border-violet-400 hover:bg-gray-50 transition overflow-hidden">

                        {bannerPreview ? (
                            <img
                                src={bannerPreview}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-400 text-sm">
                                Click để upload ảnh
                            </span>
                        )}

                        <input
                            type="file"
                            name="bannerUrl"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <input
                        type="checkbox"
                        name="isYearly"
                        checked={form.isYearly}
                        onChange={handleChange}
                    />
                    <span className="text-sm">Sự kiện hàng năm</span>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                        Huỷ
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 cursor-pointer transition"
                    >
                        Cập nhật
                    </button>
                </div>

            </form>
        </div>
    );
}