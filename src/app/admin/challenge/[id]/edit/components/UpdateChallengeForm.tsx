"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    Target,
    Trophy,
    Image as ImageIcon,
    MapPin,
    Hash,
    Plus,
    X
} from "lucide-react";
import { updateChallenge } from "@/api/admin/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UpdateStatus from "./UpdateStatus";
import LocationSelectModal from "../../../new/components/LocationSelectModal";
import { Location } from "@/api/admin/type";
import Image from "next/image";

const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

const inputClass = "w-full mt-2 border border-violet-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition placeholder-gray-300";

function FieldWrapper({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col gap-0.5">{children}</div>;
}

export default function UpdateChallengeForm({ challenge }: any) {

    const router = useRouter();
    const [openLocationModal, setOpenLocationModal] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);

    const toVNDateTimeLocal = (dateStr: string) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);

        const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

        return vnTime.toISOString().slice(0, 16);
    };

    const goalMetricOptions: Record<string, string[]> = {
        POST: ["COUNT"],
        CHECKIN: ["STREAK"],
        REVIEW: ["COUNT", "UNIQUE_LIST"]
    };

    const statusConfig =
        challenge.status === "ACTIVE"
            ? {
                label: "Đang hoạt động",
                className: "bg-emerald-100 text-emerald-700"
            }
            : challenge.status === "INACTIVE"
                ? {
                    label: "Không hoạt động",
                    className: "bg-amber-100 text-amber-700"
                }
                : {
                    label: "Đã kết thúc",
                    className: "bg-slate-100 text-slate-700"
                };

    const [form, setForm] = useState({
        title: "",
        description: "",
        triggerEvent: "",
        goalMetric: "",
        targetGoal: "",
        rewardPoints: "",
        startDate: "",
        endDate: "",
        status: ""
    });

    const [ruleData, setRuleData] = useState({
        has_image: false,
        venue_id: [] as number[],
        hash_tags: [] as string[]
    });

    useEffect(() => {
        if (!challenge) return;

        setForm({
            title: challenge.title || "",
            description: challenge.description || "",
            triggerEvent: challenge.triggerEvent || "",
            goalMetric: challenge.goalMetric || "",
            targetGoal: challenge.targetGoal?.toString() || "",
            rewardPoints: challenge.rewardPoints?.toString() || "",
            startDate: toVNDateTimeLocal(challenge.startDate),
            endDate: toVNDateTimeLocal(challenge.endDate),
            status: challenge.status || "INACTIVE"
        });

        if (challenge.ruleData) {
            setRuleData({
                has_image: challenge.ruleData.has_image || false,
                venue_id: challenge.ruleData.venue_id || [],
                hash_tags: (challenge.ruleData.hash_tags || []).map((t: string) =>
                    t.replace("#", "")
                )
            });
        }

    }, [challenge]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === "triggerEvent") {
            setForm({
                ...form,
                triggerEvent: value,
                goalMetric: "" // reset
            });

            setRuleData({
                has_image: false,
                venue_id: [],
                hash_tags: []
            });

            return;
        }

        setForm({ ...form, [name]: value });

        if (name === "goalMetric") {
            setRuleData({
                has_image: false,
                venue_id: [],
                hash_tags: []
            });
        }
        if (name === "triggerEvent") {
            const defaultMetric = goalMetricOptions[value]?.[0] || "";

            setForm({
                ...form,
                triggerEvent: value,
                goalMetric: defaultMetric
            });

            setRuleData({
                has_image: false,
                venue_id: [],
                hash_tags: []
            });

            return;
        }
    };

    const toISO = (date: string) => {
        if (!date) return null;
        return new Date(date).toISOString();
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const rulePayload: any = {};

        if (showHasImage && ruleData.has_image) {
            rulePayload.has_image = ruleData.has_image ?? false;
        }

        if (showVenueId && ruleData.venue_id.length > 0) {
            rulePayload.venue_id = ruleData.venue_id;
        }

        if (showHashTag) {
            rulePayload.hash_tags = ruleData.hash_tags
                .filter(t => t.trim() !== "")
                .map(t => "#" + t.replace("#", ""));
        }


        if (form.triggerEvent === "REVIEW" && form.goalMetric === "UNIQUE_LIST" && rulePayload.venue_id?.length === 0) {
            toast.error("Vui lòng chọn ít nhất một địa điểm áp dụng cho challenge này");
            return;
        }

        if (new Date(form.startDate) > new Date(form.endDate)) {
            toast.error("Ngày bắt đầu phải trước ngày kết thúc");
            return;
        }

        if (Number(form.targetGoal) <= 0 || Number(form.rewardPoints) <= 0) {
            toast.error("Mục tiêu và điểm thưởng phải lớn hơn 0");
            return;
        }
        let finalRuleData;

        if (form.triggerEvent === "CHECKIN") {
            finalRuleData = {
            };
        } else {
            finalRuleData = rulePayload;
        }
        const payload = {
            title: form.title,
            description: form.description,
            triggerEvent: form.triggerEvent,
            goalMetric: form.goalMetric,
            targetGoal: Number(form.targetGoal),
            rewardPoints: Number(form.rewardPoints),
            startDate: toISO(form.startDate),
            endDate: toISO(form.endDate),
            status: 'INACTIVE',
            ruleData: finalRuleData
        };

        try {
            await updateChallenge(challenge.id, payload);

            toast.success("Cập nhật thành công");

            router.refresh();
            router.push("/admin/challenge");

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Cập nhật thất bại";
            toast.error(errorMessage || "Cập nhật thất bại");
        }
    };

    const showRuleData = form.triggerEvent !== "CHECKIN";

    const showHasImage =
        form.triggerEvent === "POST" ||
        form.triggerEvent === "REVIEW";

    const showHashTag =
        form.triggerEvent === "POST";

    const showVenueId =
        form.triggerEvent === "REVIEW" &&
        form.goalMetric === "UNIQUE_LIST";

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/40 to-violet-50/30 p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Cập nhật Challenge
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Chỉnh sửa thông tin và quy tắc challenge
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                                {statusConfig.label}
                            </span>
                        </div>

                        <UpdateStatus
                            challengeId={challenge.id}
                            currentStatus={challenge.status}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* BASIC INFO */}
                    <div className="bg-white rounded-2xl shadow p-8 space-y-7">
                        <h2 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h2>

                        <FieldWrapper>
                            <label className={labelClass}>Tiêu đề Challenge</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="VD: Summer Challenge..."
                                className={inputClass}
                                required
                            />
                        </FieldWrapper>

                        <FieldWrapper>
                            <label className={labelClass}>Mô tả Challenge</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết..."
                                rows={4}
                                className={`${inputClass} resize-none`}
                            />
                        </FieldWrapper>
                    </div>

                    {/* METRIC SECTION */}
                    <div className="bg-white rounded-2xl shadow p-8 space-y-7">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Target size={20} />
                            Mục tiêu Challenge
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            <FieldWrapper>
                                <label className={labelClass}>Loại sự kiện</label>
                                <select
                                    name="triggerEvent"
                                    value={form.triggerEvent}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                >
                                    <option value="POST">BÀI ĐĂNG</option>
                                    <option value="REVIEW">ĐÁNH GIÁ</option>
                                    <option value="CHECKIN">CHECK-IN</option>
                                </select>
                            </FieldWrapper>

                            <FieldWrapper>
                                <label className={labelClass}>Chỉ số mục tiêu</label>
                                <select
                                    name="goalMetric"
                                    value={form.goalMetric}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Chọn chỉ số mục tiêu</option>
                                    {goalMetricOptions[form.triggerEvent]?.map((metric) => (
                                        <option key={metric} value={metric}>
                                            {metric}
                                        </option>
                                    ))}
                                </select>
                            </FieldWrapper>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FieldWrapper>
                                <label className={labelClass}>Mục tiêu</label>
                                <input
                                    type="number"
                                    name="targetGoal"
                                    value={form.targetGoal}
                                    onChange={handleChange}
                                    placeholder="VD: 10"
                                    className={inputClass}
                                    required
                                />
                            </FieldWrapper>

                            <FieldWrapper>
                                <label className={labelClass}>Điểm thưởng</label>
                                <input
                                    type="number"
                                    name="rewardPoints"
                                    value={form.rewardPoints}
                                    onChange={handleChange}
                                    placeholder="VD: 50"
                                    className={inputClass}
                                    required
                                />
                            </FieldWrapper>
                        </div>
                    </div>

                    {/* TIME SECTION */}
                    <div className="bg-white rounded-2xl shadow p-8 space-y-7">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Calendar size={20} />
                            Thời gian Challenge
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            <FieldWrapper>
                                <label className={labelClass}>Ngày bắt đầu</label>
                                <input
                                    type="datetime-local"
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
                                    type="datetime-local"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                />
                            </FieldWrapper>
                        </div>
                    </div>

                    {/* RULES SECTION */}
                    {showRuleData && (
                        <div className="bg-white rounded-2xl shadow p-8 space-y-7">
                            <h2 className="text-lg font-semibold text-gray-800">Quy tắc Challenge</h2>

                            {showHasImage && (
                                <label className="flex items-center gap-3 p-4 rounded-xl border border-violet-200 bg-violet-50/50 cursor-pointer hover:bg-violet-50 transition">
                                    <input
                                        type="checkbox"
                                        checked={ruleData.has_image}
                                        onChange={(e) =>
                                            setRuleData({
                                                ...ruleData,
                                                has_image: e.target.checked
                                            })
                                        }
                                        className="w-4 h-4 text-violet-600 border-gray-300 rounded"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Bắt buộc có hình ảnh</p>
                                        <p className="text-xs text-gray-500">Người dùng phải đính kèm hình ảnh khi tham gia</p>
                                    </div>
                                </label>
                            )}

                            {showVenueId && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <MapPin size={18} />
                                            Địa điểm áp dụng
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">Chọn các địa điểm nơi challenge này áp dụng</p>
                                    </div>

                                    {selectedLocations.length > 0 && (
                                        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
                                            {selectedLocations.map((location) => {
                                                const image =
                                                    location.coverImage?.[0] ??
                                                    "https://placehold.co/100";

                                                return (
                                                    <div
                                                        key={location.id}
                                                        className="flex items-center gap-3 bg-white p-3 rounded-lg border border-violet-100 hover:border-violet-300 transition"
                                                    >
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                            <Image
                                                                src={image}
                                                                alt={location.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm text-gray-800 truncate">
                                                                {location.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                                                <MapPin size={12} />
                                                                {location.address}
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setRuleData({
                                                                    ...ruleData,
                                                                    venue_id: ruleData.venue_id.filter(v => v !== location.id)
                                                                })
                                                                setSelectedLocations(selectedLocations.filter(v => v.id !== location.id))
                                                            }}
                                                            className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setOpenLocationModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 border border-violet-200 text-violet-600 rounded-xl hover:bg-violet-50 transition font-medium text-sm"
                                    >
                                        <Plus size={16} />
                                        Thêm địa điểm
                                    </button>
                                </div>
                            )}

                            {showHashTag && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <Hash size={18} />
                                            Hashtag bắt buộc
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">Người dùng phải sử dụng những hashtag này</p>
                                    </div>

                                    <div className="space-y-3">
                                        {ruleData.hash_tags.map((tag, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    placeholder="VD: #summer2024"
                                                    value={tag}
                                                    onChange={(e) => {
                                                        const newTags = [...ruleData.hash_tags];
                                                        newTags[index] = e.target.value;
                                                        setRuleData({
                                                            ...ruleData,
                                                            hash_tags: newTags
                                                        });
                                                    }}
                                                    className={inputClass}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newTags = ruleData.hash_tags.filter((_, i) => i !== index);
                                                        setRuleData({
                                                            ...ruleData,
                                                            hash_tags: newTags
                                                        });
                                                    }}
                                                    className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRuleData({
                                                ...ruleData,
                                                hash_tags: [...ruleData.hash_tags, ""]
                                            })
                                        }
                                        className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-violet-200 text-violet-600 rounded-xl hover:bg-violet-50 transition font-medium text-sm"
                                    >
                                        <Plus size={16} />
                                        Thêm hashtag
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACTION */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border cursor-pointer border-violet-200 text-violet-600 rounded-xl hover:bg-violet-50 transition font-medium"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="flex items-center gap-2 cursor-pointer px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-medium"
                        >
                            <Trophy size={18} />
                            Cập nhật
                        </button>
                    </div>

                </form>
                <LocationSelectModal
                    open={openLocationModal}
                    onClose={() => setOpenLocationModal(false)}
                    onConfirm={(locations) => {
                        setSelectedLocations(locations);
                        setRuleData({
                            ...ruleData,
                            venue_id: locations.map(v => v.id)
                        });
                    }}
                />
            </div>
        </div>
    );
}