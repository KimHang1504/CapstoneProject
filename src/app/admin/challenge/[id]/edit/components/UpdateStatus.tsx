"use client";

import { useState } from "react";
import { updateStatusChallenge } from "@/api/admin/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

    return (
        <div className="flex items-center gap-3">
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
            >
                <option value="INACTIVE">INACTIVE</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ENDED">ENDED</option>
            </select>

            <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50"
            >
                {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
        </div>
    );
}