"use client";

import { useEffect, useState } from "react";
import QRScanner from "@/app/venue/redeem/component/QRScanner";
import {
    validateVoucherItem,
    redeemVoucherItem,
} from "@/api/venue/vouchers/api";

export default function VoucherScan() {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);

        useEffect(() => {
        console.log("🟢 VoucherScan mounted");

        return () => {
            console.log("🔴 VoucherScan unmounted");
        };
    }, []);

    const handleScan = async (text: string) => {
        const value = text.toUpperCase();

        setCode(value);
        setLoading(true);
        setMessage("");

        try {
            const res = await validateVoucherItem(value);
            const data = res.data;

            if (data.isValid) {
                setValid(true);
                setMessage("Voucher hợp lệ. Có thể sử dụng.");
            } else {
                setValid(false);
                setMessage(data.validationMessage || "Không hợp lệ");
            }
        } catch (err: any) {
            setValid(false);
            setMessage(err?.response?.data?.message || "Không hợp lệ");
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        try {
            setLoading(true);

            await redeemVoucherItem(code);

            setMessage("Redeem thành công!");
            setValid(false);
        } catch {
            setMessage("Redeem thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <QRScanner onScan={handleScan} />

            {code && (
                <div className="p-3 rounded-lg border bg-gray-50 text-sm">
                    <span className="text-gray-500">Mã đã quét:</span>
                    <div className="font-semibold text-gray-900">
                        {code}
                    </div>
                </div>
            )}

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