"use client";

import VoucherInput from "@/app/venue/redeem/component/VoucherInput";
import VoucherScan from "@/app/venue/redeem/component/VoucherScan";
import { useState, useEffect } from "react";
import { getMyVenueLocations } from "@/api/venue/location/api";
import { MyVenueLocation } from "@/api/venue/location/type";

export default function RedeemVoucherPage() {
    const [mode, setMode] = useState<"input" | "scan">("input");
    const [locations, setLocations] = useState<MyVenueLocation[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

    useEffect(() => {
        getMyVenueLocations()
            .then((res) => {
                const active = res.filter((l) => l.status === "ACTIVE");
                setLocations(active);
                if (active.length > 0) setSelectedLocationId(active[0].id);
            })
            .catch(console.error);
    }, []);
    console.log("Location ID:", selectedLocationId);
    return (
        <div className="p-6 space-y-6 mx-50">

            {/* Location selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa điểm
                </label>
                <select
                    value={selectedLocationId ?? ""}
                    onChange={(e) => setSelectedLocationId(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-sm"
                >
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* TAB */}
            <div className="flex gap-6 border-b">
                <button
                    onClick={() => setMode("input")}
                    className={mode === "input" ? "text-blue-600 border-b-2 border-blue-600" : ""}
                >
                    Nhập mã
                </button>

                <button
                    onClick={() => setMode("scan")}
                    className={mode === "scan" ? "text-blue-600 border-b-2 border-blue-600" : ""}
                >
                    Quét QR
                </button>
            </div>

            {/* CONTENT */}
            {selectedLocationId && mode === "input" && (
                <VoucherInput venueLocationId={selectedLocationId} />
            )}
            {selectedLocationId && mode === "scan" && (
                <VoucherScan venueLocationId={selectedLocationId} />
            )}
            {!selectedLocationId && (
                <p className="text-sm text-gray-400">Vui lòng chọn địa điểm để tiếp tục.</p>
            )}
        </div>
    );
}
