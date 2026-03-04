"use client";

import { useEffect, useState } from "react";
import { getMyVenueLocations } from "@/api/venue/location/api";
import { MyVenueLocation } from "@/api/venue/location/type";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: (venueId: number) => void;
};

export default function SelectVenueModal({
    open,
    onClose,
    onConfirm,
}: Props) {
    const [venues, setVenues] = useState<MyVenueLocation[]>([]);
    const [selectedVenue, setSelectedVenue] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        const fetchVenues = async () => {
            try {
                setLoading(true);
                const venues = await getMyVenueLocations();
                setVenues(venues);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                    Chọn địa điểm quảng cáo
                </h2>

                {loading && <p>Đang tải...</p>}

                {!loading && venues.length === 0 && (
                    <p>Không có địa điểm nào</p>
                )}

                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {venues.map((venue) => (
                        <div
                            key={venue.id}
                            onClick={() => setSelectedVenue(venue.id)}
                            className={`p-3 border rounded cursor-pointer ${selectedVenue === venue.id
                                    ? "border-blue-600 bg-blue-50"
                                    : ""
                                }`}
                        >
                            <div className="font-medium">{venue.name}</div>
                            <div className="text-sm text-gray-500">
                                {venue.address}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Hủy
                    </button>

                    <button
                        disabled={!selectedVenue}
                        onClick={() =>
                            selectedVenue && onConfirm(selectedVenue)
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}