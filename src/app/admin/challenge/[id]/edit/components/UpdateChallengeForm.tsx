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

const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

const inputClass = "w-full mt-2 border border-violet-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition placeholder-gray-300";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

export default function UpdateChallengeForm({ challenge }: any) {

    const router = useRouter();

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
            startDate: challenge.startDate?.slice(0, 16) || "",
            endDate: challenge.endDate?.slice(0, 16) || "",
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
            rulePayload.has_image = true;
        }

        if (showVenueId && ruleData.venue_id.length > 0) {
            rulePayload.venue_id = ruleData.venue_id;
        }

        if (showHashTag) {
            rulePayload.hash_tags = ruleData.hash_tags
                .filter(t => t.trim() !== "")
                .map(t => "#" + t.replace("#", ""));
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
            ruleData: Object.keys(rulePayload).length ? rulePayload : null
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
                                                    className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
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
                                        className="flex items-center gap-2 px-4 py-2 border border-violet-200 text-violet-600 rounded-xl hover:bg-violet-50 transition font-medium text-sm"
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
                            className="px-6 py-3 border border-violet-200 text-violet-600 rounded-xl hover:bg-violet-50 transition font-medium"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-medium"
                        >
                            <Trophy size={18} />
                            Cập nhật
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}