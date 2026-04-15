'use client';

import { approveVoucher, rejectVoucher } from "@/api/admin/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    voucherId: number;
};

export default function VoucherApprovalActions({ voucherId }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState<string>("");
    const router = useRouter();

    const handleApprove = () => {
        toast("Bạn có chắc muốn duyệt voucher này?", {
            action: {
                label: "Duyệt",
                onClick: async () => {
                    try {
                        setLoading(true);

                        await approveVoucher(voucherId);

                        toast.success("Đã duyệt voucher");
                        router.push("/admin/voucher-management");
                    } catch (error) {
                        console.error(error);
                        const errorMessage = error instanceof Error ? error.message : "Duyệt voucher thất bại";
                        toast.error(errorMessage);
                    } finally {
                        setLoading(false);
                    }
                },
            },
            cancel: {
                label: "Hủy",
                onClick: () => { },
            },
        });
    };

    const handleReject = () => {
        toast("Bạn có chắc muốn từ chối voucher này?", {
            action: {
                label: "Từ chối",
                onClick: async () => {
                    try {
                        setLoading(true);

                        await rejectVoucher(voucherId, reason);

                        toast.success("Đã từ chối voucher");
                        router.push("/admin/voucher-management");
                    } catch (error) {
                        console.error(error);
                        const errorMessage = error instanceof Error ? error.message : "Từ chối voucher thất bại";
                        toast.error(errorMessage);
                    } finally {
                        setLoading(false);
                    }
                },
            },
            cancel: {
                label: "Hủy",
                onClick: () => { },
            },
        });
    };

    return (
        <div className="flex gap-3 justify-end pt-4">

            <button
                onClick={() => setOpen(true)}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-red-400 text-red-600 hover:bg-red-50 cursor-pointer"
            >
                Từ chối
            </button>

            <button
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 cursor-pointer"
            >
                Đồng ý
            </button>
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-100 space-y-4">
                        <h2 className="text-lg font-semibold">
                            Lí do từ chối
                        </h2>
                        <textarea
                            className="w-full border rounded-lg p-2"
                            rows={4}
                            placeholder="Nhập lý do..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded-lg cursor-pointer"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={() => handleReject()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}