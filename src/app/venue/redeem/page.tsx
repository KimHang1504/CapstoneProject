"use client";

import { useState } from "react";
import {
    validateVoucherItem,
    redeemVoucherItem,
} from "@/api/venue/vouchers/api";

export default function RedeemVoucherPage() {

    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleValidate = async () => {
        if (!code) {
            setMessage("Vui lòng nhập mã voucher");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const res = await validateVoucherItem(code);

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

    return (
        <div className="p-6 space-y-6 mx-50">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Xác nhận sử dụng voucher
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Nhập mã voucher của khách để kiểm tra và xác nhận sử dụng
                </p>
            </div>

            {/* CARD */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">

                {/* INPUT */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Mã voucher
                    </label>

                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="VD: ABCD-1234"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">

                    <button
                        onClick={handleValidate}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Kiểm tra
                    </button>

                    {valid && (
                        <button
                            onClick={handleRedeem}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Xác nhận sử dụng
                        </button>
                    )}

                </div>

                {/* MESSAGE */}
                {message && (
                    <div
                        className={`text-sm p-3 rounded-lg border
            ${valid
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                    >
                        {message}
                    </div>
                )}

            </div>

        </div>
    );
}