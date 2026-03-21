"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getMyVenueLocations } from "@/api/venue/location/api";
import { MyVenueLocation } from "@/api/venue/location/type";

type Props = {
    selectedIds: number[];
    onConfirm: (ids: number[]) => void;
    onClose: () => void;
};

export default function SelectVenueModal({ selectedIds, onConfirm, onClose }: Props) {
    const [locations, setLocations] = useState<MyVenueLocation[]>([]);
    const [tempSelected, setTempSelected] = useState<number[]>([]);

    useEffect(() => {
        setTempSelected(selectedIds);
    }, [selectedIds]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await getMyVenueLocations();
                const active = res.filter((l) => l.status === "ACTIVE");
                setLocations(active);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLocations();
    }, []);

    const toggle = (id: number) => {
        setTempSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const confirm = () => {
        onConfirm(tempSelected);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-7 py-5 shrink-0">
                    <h2 className="text-lg font-bold text-white">Chọn địa điểm</h2>
                    <p className="text-violet-200 text-xs mt-1">
                        Đã chọn {tempSelected.length} / {locations.length} địa điểm
                    </p>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 p-5 space-y-3">
                    {locations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <svg className="w-10 h-10 mb-3 text-violet-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm">Không có địa điểm nào đang hoạt động</p>
                        </div>
                    ) : (
                        locations.map((loc) => {
                            const isSelected = tempSelected.includes(loc.id);
                            return (
                                <label
                                    key={loc.id}
                                    className={`flex items-center gap-4 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                        isSelected
                                            ? "border-violet-500 bg-violet-50"
                                            : "border-gray-100 hover:border-violet-200 hover:bg-violet-50/40"
                                    }`}
                                >
                                    {/* Hidden native checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggle(loc.id)}
                                        className="sr-only"
                                    />

                                    {/* Custom checkbox */}
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                        isSelected ? "bg-violet-500 border-violet-500" : "border-gray-300"
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Image */}
                                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-violet-100">
                                        <Image
                                            src={loc.coverImage?.[0] || "/placeholder.png"}
                                            alt={loc.name}
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-sm truncate ${isSelected ? "text-violet-700" : "text-gray-800"}`}>
                                            {loc.name}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{loc.address}</p>
                                    </div>
                                </label>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-5 border-t border-violet-50 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition"
                    >
                        Hủy
                    </button>
                    <button
                        disabled={tempSelected.length === 0}
                        onClick={confirm}
                        className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                    >
                        Thanh toán
                    </button>
                </div>

            </div>
        </div>
    );
}
