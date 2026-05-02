"use client";

import { useState } from "react";
import { updateStatusChallenge } from "@/api/admin/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Props = {
    challengeId: number;
    currentStatus: string;
};

export default function UpdateStatus({ challengeId, currentStatus }: Props) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) {
            setShowDropdown(false);
            return;
        }

        try {
            setLoading(true);
            await updateStatusChallenge(challengeId, newStatus);
            setStatus(newStatus);
            toast.success("Cập nhật trạng thái thành công!");
            setShowDropdown(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Cập nhật thất bại";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
        ACTIVE: {
            label: "Đang hoạt động",
            className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        },
        INACTIVE: {
            label: "Không hoạt động",
            className: "bg-amber-100 text-amber-700 hover:bg-amber-200"
        },
        ENDED: {
            label: "Đã kết thúc",
            className: "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }
    };

    const STATUS_OPTIONS = [
        { label: "Đang hoạt động", value: "ACTIVE" },
        { label: "Không hoạt động", value: "INACTIVE" },
        { label: "Đã kết thúc", value: "ENDED" },
    ];

    const currentConfig = STATUS_CONFIG[status] || STATUS_CONFIG.INACTIVE;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={loading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${currentConfig.className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? "Đang cập nhật..." : currentConfig.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && !loading && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20">
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition cursor-pointer ${
                                    option.value === status ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-700'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}