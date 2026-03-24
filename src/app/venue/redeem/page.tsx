"use client";

import VoucherInput from "@/app/venue/redeem/component/VoucherInput";
import VoucherScan from "@/app/venue/redeem/component/VoucherScan";
import { useState, useEffect, useRef } from "react";
import { getMyVenueLocations } from "@/api/venue/location/api";
import { MyVenueLocation } from "@/api/venue/location/type";

export default function RedeemVoucherPage() {
    const [mode, setMode] = useState<"input" | "scan">("input");
    const [locations, setLocations] = useState<MyVenueLocation[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getMyVenueLocations()
            .then((res) => {
                const active = res.filter((l) => l.status === "ACTIVE");
                setLocations(active);
                if (active.length > 0) setSelectedLocationId(active[0].id);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLocation = locations.find((loc) => loc.id === selectedLocationId);
    console.log("Location ID:", selectedLocationId);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Sử dụng Voucher</h1>
                            <p className="text-sm text-gray-500">Quét hoặc nhập mã để xác nhận</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Voucher Input/Scan */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => setMode("input")}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                        mode === "input"
                                            ? "text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Nhập mã
                                </button>

                                <button
                                    onClick={() => setMode("scan")}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                        mode === "scan"
                                            ? "text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                    Quét QR
                                </button>
                            </div>

                            <div className="p-6">
                                {selectedLocationId && mode === "input" && (
                                    <VoucherInput venueLocationId={selectedLocationId} />
                                )}
                                {selectedLocationId && mode === "scan" && (
                                    <VoucherScan venueLocationId={selectedLocationId} />
                                )}
                                {!selectedLocationId && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-500">Vui lòng chọn địa điểm để tiếp tục</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Location Selector */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-semibold text-gray-900">Địa điểm</h2>
                            </div>
                            
                            {/* Custom Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                        <span className="font-medium text-gray-900 truncate">
                                            {selectedLocation?.name || "Chọn địa điểm"}
                                        </span>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                                            isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="max-h-64 overflow-y-auto">
                                            {locations.map((loc, index) => (
                                                <button
                                                    key={loc.id}
                                                    onClick={() => {
                                                        setSelectedLocationId(loc.id);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                                                        selectedLocationId === loc.id
                                                            ? "bg-emerald-50 text-emerald-900"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                    } ${index !== 0 ? "border-t border-gray-100" : ""}`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                            selectedLocationId === loc.id
                                                                ? "bg-emerald-500"
                                                                : "bg-gray-300"
                                                        }`}
                                                    ></div>
                                                    <span className="flex-1 font-medium truncate">{loc.name}</span>
                                                    {selectedLocationId === loc.id && (
                                                        <svg
                                                            className="w-5 h-5 text-emerald-600 flex-shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedLocationId && (
                                <div className="mt-4 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-semibold text-emerald-700">Đang hoạt động</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
