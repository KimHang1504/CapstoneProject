"use client";

import { useEffect, useState } from "react";
import { getMyVenueLocations } from "@/api/venue/location/api";
import { MyVenueLocation } from "@/api/venue/location/type";

type Props = {
    selectedIds: number[];
    onConfirm: (ids: number[]) => void;
    onClose: () => void;
};

export default function SelectVenueModal({
    selectedIds,
    onConfirm,
    onClose,
}: Props) {
    const [locations, setLocations] = useState<MyVenueLocation[]>([]);
    const [tempSelected, setTempSelected] = useState<number[]>([]);

    useEffect(() => {
        setTempSelected(selectedIds);
    }, [selectedIds]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await getMyVenueLocations();

                const active = res.filter(
                    (l) => l.status === "ACTIVE"
                );

                setLocations(active);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLocations();
    }, []);

    const toggle = (id: number) => {
        setTempSelected((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    const confirm = () => {
        onConfirm(tempSelected);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-105">

                <h2 className="text-lg font-semibold mb-4">
                    Chọn địa điểm ({tempSelected.length})
                </h2>

                <div className="space-y-2 max-h-75 overflow-y-auto">

                    {locations.map((loc) => (
                        <label
                            key={loc.id}
                            className="flex gap-2 items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={tempSelected.includes(loc.id)}
                                onChange={() => toggle(loc.id)}
                            />

                            <div>
                                <div className="font-medium">
                                    {loc.name}
                                </div>

                                <div className="text-sm text-gray-500">
                                    {loc.address}
                                </div>
                            </div>
                        </label>
                    ))}

                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 border rounded"
                    >
                        Hủy
                    </button>

                    <button
                        disabled={tempSelected.length === 0}
                        onClick={confirm}
                        className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
                    >
                        Thanh toán
                    </button>
                </div>

            </div>
        </div>
    );
}