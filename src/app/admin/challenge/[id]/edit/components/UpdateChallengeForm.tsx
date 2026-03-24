"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    Target,
    Trophy,
    Image as ImageIcon,
    MapPin,
    Hash
} from "lucide-react";
import { updateChallenge } from "@/api/admin/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UpdateStatus from "./UpdateStatus";

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
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Cập nhật Challenge
                    </h1>
                    <p className="text-gray-500 text-sm">
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

                {/* BASIC */}
                <div className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <h2 className="font-semibold text-lg text-gray-800">
                        Thông tin cơ bản
                    </h2>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-600">
                            Tiêu đề
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-400"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-600">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-400"
                        />
                    </div>
                </div>

                {/* METRIC */}
                <div className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                        <Target size={18} />
                        Mục tiêu
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm text-gray-600">
                                Trigger Event
                            </label>
                            <select
                                name="triggerEvent"
                                value={form.triggerEvent}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            >
                                <option value="POST">POST</option>
                                <option value="REVIEW">REVIEW</option>
                                <option value="CHECKIN">CHECKIN</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">
                                Goal Metric
                            </label>
                            <select
                                name="goalMetric"
                                value={form.goalMetric}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            >
                                <option value="">Chọn goal metric</option>

                                {goalMetricOptions[form.triggerEvent]?.map((metric) => (
                                    <option key={metric} value={metric}>
                                        {metric}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm text-gray-600">
                                Mục tiêu
                            </label>
                            <input
                                type="number"
                                name="targetGoal"
                                value={form.targetGoal}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">
                                Điểm thưởng
                            </label>
                            <input
                                type="number"
                                name="rewardPoints"
                                value={form.rewardPoints}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                    </div>
                </div>

                {/* DATE + STATUS */}
                <div className="bg-white rounded-2xl shadow p-6 space-y-5">

                    <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                        <Calendar size={18} />
                        Thời gian & trạng thái
                    </h2>

                    <div className="grid grid-cols-3 gap-4">

                        <div>
                            <label className="text-sm text-gray-600">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                    </div>
                </div>

                {/* RULE */}
                {showRuleData && (
                    <div className="bg-white rounded-2xl shadow p-6 space-y-5">

                        <h2 className="font-semibold text-lg text-gray-800">
                            Quy tắc
                        </h2>

                        {showHasImage && (
                            <label className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={ruleData.has_image}
                                    onChange={(e) =>
                                        setRuleData({
                                            ...ruleData,
                                            has_image: e.target.checked
                                        })
                                    }
                                />
                                Bắt buộc có hình ảnh
                            </label>
                        )}

                        {showHashTag && (
                            <div className="space-y-3 flex flex-col">
                                <label className="text-sm text-gray-600">
                                    Hashtags
                                </label>

                                {ruleData.hash_tags.map((tag, i) => (
                                    <input
                                        key={i}
                                        value={tag}
                                        onChange={(e) => {
                                            const newTags = [...ruleData.hash_tags];
                                            newTags[i] = e.target.value;
                                            setRuleData({ ...ruleData, hash_tags: newTags });
                                        }}
                                        className="w-full border rounded-lg p-3"
                                    />
                                ))}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setRuleData({
                                            ...ruleData,
                                            hash_tags: [...ruleData.hash_tags, ""]
                                        })
                                    }
                                    className="text-sm text-violet-600 hover:bg-violet-100 border rounded-lg px-2 py-1 w-fit cursor-pointer"
                                >
                                    + Thêm hashtag
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
                        className="px-5 py-3 rounded-lg border text-gray-600 hover:bg-gray-50"
                    >
                        Huỷ
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 shadow-md"
                    >
                        Cập nhật
                    </button>

                </div>

            </form>
        </div>
    );
}