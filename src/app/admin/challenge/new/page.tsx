"use client";

import { useState } from "react";
import {
    Calendar,
    Target,
    Trophy,
    Image as ImageIcon,
    MapPin,
    Hash
} from "lucide-react";
import LocationSelectModal from "./components/LocationSelectModal";
import Image from "next/image";
import { ChallengeRequest, Location } from "@/api/admin/type";
import { createChallenge } from "@/api/admin/api";
import BackButton from "@/components/BackButton";

export default function CreateChallengePage() {

    const [form, setForm] = useState({
        title: "",
        description: "",
        triggerEvent: "",
        goalMetric: "",
        targetGoal: "",
        rewardPoints: "",
        startDate: "",
        endDate: ""
    });

    const [ruleData, setRuleData] = useState({
        has_image: false,
        venue_id: [] as number[],
        hash_tags: [] as string[]
    });

    const [openLocationModal, setOpenLocationModal] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        // reset ruleData khi đổi trigger
        if (name === "triggerEvent") {
            setRuleData({
                has_image: false,
                venue_id: [] as number[],
                hash_tags: []
            });
            setSelectedLocations([]);
        }

        if (name === "goalMetric") {

            setRuleData({
                has_image: false,
                venue_id: [],
                hash_tags: []
            });
            setSelectedLocations([]);

        }
    };

    const toISO = (date: string) => {
        if (!date) return null;
        return new Date(date).toISOString();
    };

    const handleSubmit = async (e: any) => {

        e.preventDefault();

        const rulePayload: any = {};

        // chỉ thêm has_image khi field đang hiển thị
        if (showHasImage && ruleData.has_image) {
            rulePayload.has_image = true;
        }

        // chỉ thêm venue_id khi field đang hiển thị
        if (showVenueId && ruleData.venue_id.length > 0) {
            rulePayload.venue_id = ruleData.venue_id;
        }

        // chỉ thêm hashtag khi field đang hiển thị
        if (showHashTag) {
            rulePayload.hash_tags = ruleData.hash_tags
                .filter(tag => tag.trim() !== "")
                .map(tag => "#" + tag.replace("#", ""));
        }

        const payload: ChallengeRequest = {
            title: form.title,
            description: form.description,
            triggerEvent: form.triggerEvent,
            goalMetric: form.goalMetric,
            targetGoal: Number(form.targetGoal),
            rewardPoints: Number(form.rewardPoints),
            startDate: toISO(form.startDate),
            endDate: toISO(form.endDate),
            ruleData: Object.keys(rulePayload).length > 0 ? rulePayload : null
        };

        console.log(payload);
        await createChallenge(payload);
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

        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <BackButton />
            <h1 className="text-3xl font-bold">
                Tạo Challenge
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* BASIC */}
                <div className="bg-white rounded-xl shadow p-6 space-y-4">

                    <h2 className="font-semibold text-lg">
                        Thông tin cơ bản
                    </h2>

                    <input
                        name="title"
                        placeholder="Tiêu đề challenge"
                        className="w-full border rounded-lg p-3"
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Mô tả challenge"
                        rows={4}
                        className="w-full border rounded-lg p-3"
                        onChange={handleChange}
                    />

                </div>


                {/* METRIC */}
                <div className="bg-white rounded-xl shadow p-6 space-y-4">

                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Target size={18} />
                        Mục tiêu
                    </h2>

                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Trigger Event
                        </label>

                        <select
                            name="triggerEvent"
                            className="w-full border rounded-lg p-3"
                            onChange={handleChange}
                        >

                            <option value="">
                                Chọn trigger event
                            </option>

                            <option value="POST">
                                POST
                            </option>

                            <option value="REVIEW">
                                REVIEW
                            </option>

                            <option value="CHECKIN">
                                CHECKIN
                            </option>

                        </select>

                    </div>

                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Goal Metric
                        </label>

                        <select
                            name="goalMetric"
                            className="w-full border rounded-lg p-3"
                            onChange={handleChange}
                        >

                            <option value="">
                                Chọn goal metric
                            </option>

                            <option value="COUNT">
                                COUNT
                            </option>

                            <option value="UNIQUE_LIST">
                                UNIQUE_LIST
                            </option>

                            <option value="STREAK">
                                STREAK
                            </option>

                        </select>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            name="targetGoal"
                            placeholder="Target Goal"
                            className="border rounded-lg p-3"
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="rewardPoints"
                            placeholder="Reward Points"
                            className="border rounded-lg p-3"
                            onChange={handleChange}
                        />

                    </div>

                </div>


                {/* DATE */}
                <div className="bg-white rounded-xl shadow p-6 space-y-4">

                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Calendar size={18} />
                        Thời gian
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="datetime-local"
                            name="startDate"
                            className="border rounded-lg p-3"
                            onChange={handleChange}
                        />

                        <input
                            type="datetime-local"
                            name="endDate"
                            className="border rounded-lg p-3"
                            onChange={handleChange}
                        />

                    </div>

                </div>


                {/* RULE DATA */}
                {showRuleData && (

                    <div className="bg-white rounded-xl shadow p-6 space-y-4">

                        <h2 className="font-semibold text-lg">
                            Quy tắc Challenge
                        </h2>

                        {showHasImage && (
                            <label className="flex items-center gap-3">

                                <ImageIcon size={18} />

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

                        {showVenueId && (
                            <div className="space-y-3">

                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <MapPin size={18} />
                                    Địa điểm áp dụng
                                </label>

                                {/* LIST VENUE */}
                                <div className="flex flex-wrap gap-2">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                        {selectedLocations.map((location) => {

                                            const image =
                                                location.coverImage?.[0] ??
                                                "https://placehold.co/100";

                                            return (

                                                <div
                                                    key={location.id}
                                                    className="flex items-center gap-3 border rounded-lg p-3 bg-white shadow-sm"
                                                >

                                                    {/* IMAGE */}
                                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden">

                                                        <Image
                                                            src={image}
                                                            alt={location.name}
                                                            fill
                                                            className="object-cover"
                                                        />

                                                    </div>

                                                    {/* INFO */}
                                                    <div className="flex-1">

                                                        <p className="font-semibold text-sm">
                                                            {location.name}
                                                        </p>

                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
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
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        ✕
                                                    </button>

                                                </div>

                                            );

                                        })}

                                    </div>

                                </div>

                                {/* ADD BUTTON */}
                                <button
                                    type="button"
                                    onClick={() => setOpenLocationModal(true)}
                                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                                >
                                    + Thêm địa điểm
                                </button>

                            </div>
                        )}

                        {showHashTag && (
                            <div className="space-y-3">

                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <Hash size={18} />
                                    Hashtag bắt buộc
                                </label>

                                {ruleData.hash_tags.map((tag, index) => (

                                    <div key={index} className="flex gap-2">

                                        <input
                                            className="border rounded-lg p-3 w-full"
                                            placeholder="Nhập hashtag"
                                            value={tag}
                                            onChange={(e) => {
                                                const newTags = [...ruleData.hash_tags];
                                                newTags[index] = e.target.value;

                                                setRuleData({
                                                    ...ruleData,
                                                    hash_tags: newTags
                                                });
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTags =
                                                    ruleData.hash_tags.filter((_, i) => i !== index);

                                                setRuleData({
                                                    ...ruleData,
                                                    hash_tags: newTags
                                                });
                                            }}
                                            className="px-3 text-red-500"
                                        >
                                            ✕
                                        </button>

                                    </div>

                                ))}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setRuleData({
                                            ...ruleData,
                                            hash_tags: [...ruleData.hash_tags, ""]
                                        });
                                    }}
                                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                                >
                                    + Thêm hashtag
                                </button>

                            </div>
                        )}

                    </div>

                )}


                {/* SUBMIT */}
                <div className="flex justify-end">

                    <button
                        type="submit"
                        className="bg-violet-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-violet-700"
                    >
                        <Trophy size={18} />
                        Tạo Challenge
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
    );
}