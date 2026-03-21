"use client";

import VoucherInput from "@/app/venue/redeem/component/VoucherInput";
import VoucherScan from "@/app/venue/redeem/component/VoucherScan";
import { useState } from "react";


export default function RedeemVoucherPage() {
    const [mode, setMode] = useState<"input" | "scan">("input");

    return (
        <div className="p-6 space-y-6 mx-50">

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
            {mode === "input" && <VoucherInput />}
            {mode === "scan" && <VoucherScan />}
        </div>
    );
}