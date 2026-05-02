"use client";

import { useState } from "react";
import { updateStatusChallenge } from "@/api/admin/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CustomDropdown } from "@/components/CustomDropdown";

type Props = {
    challengeId: number;
    currentStatus: string;
};

export default function UpdateStatus({ challengeId, currentStatus }: Props) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await updateStatusChallenge(challengeId, status);
            toast.success("Cập nhật thành công!");
            router.refresh();
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Cập nhật thất bại";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const STATUS_OPTIONS = [
        { label: "Tạm dừng", value: "INACTIVE" },
        { label: "Kích hoạt", value: "ACTIVE" },
        { label: "Kết thúc", value: "ENDED" },
    ];

    return (
        <div className="flex items-center gap-3">
            <CustomDropdown
                value={status}
                onChange={setStatus}
                options={STATUS_OPTIONS}
                placeholder="Chọn trạng thái"
                className="min-w-[160px]"
            />
            <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-violet-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50"
            >
                {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
        </div>
    );
}