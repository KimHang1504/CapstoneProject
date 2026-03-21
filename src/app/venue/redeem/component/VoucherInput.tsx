"use client";

import { useEffect, useState } from "react";
import {
    validateVoucherItem,
    redeemVoucherItem,
} from "@/api/venue/vouchers/api";

export default function VoucherInput() {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleValidate = async (voucherCode: string) => {
        if (!voucherCode) return;

        try {
            setLoading(true);
            setMessage("");

            const res = await validateVoucherItem(voucherCode);
            const data = res.data;

            if (data.isValid) {
                setValid(true);
                setMessage("Voucher hợp lệ. Có thể sử dụng.");
            } else {
                setValid(false);
                setMessage(data.validationMessage || "Voucher không hợp lệ");
            }
        } catch (err: any) {
            setValid(false);
            setMessage(
                err?.response?.data?.message || "Voucher không hợp lệ"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        try {
            setLoading(true);

            await redeemVoucherItem(code);

            setMessage("Redeem voucher thành công!");
            setValid(false);
            setCode("");
        } catch (err: any) {
            setMessage(
                err?.response?.data?.message || "Redeem thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!code) return;

        const delay = setTimeout(() => {
            handleValidate(code);
        }, 500);

        return () => clearTimeout(delay);
    }, [code]);

    return (
        <div className="space-y-4">
            <input
                value={code}
                onChange={(e) =>
                    setCode(e.target.value.toUpperCase())
                }
                placeholder="VD: ABCD-1234"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            {loading && <p className="text-sm">Đang kiểm tra...</p>}

            {valid && (
                <button
                    onClick={handleRedeem}
                    className="bg-emerald-600 text-white px-4 py-2 rounded"
                >
                    Xác nhận sử dụng
                </button>
            )}

            {message && <p className="text-sm">{message}</p>}
        </div>
    );
}