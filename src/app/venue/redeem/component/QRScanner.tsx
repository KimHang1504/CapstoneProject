"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Props = {
    onScan: (code: string) => void;
};

export default function QRScanner({ onScan }: Props) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isRunningRef = useRef(false);
    const hasStartedRef = useRef(false);
    const scannedRef = useRef(false);

useEffect(() => {
    console.log("🟢 useEffect chạy → component mount, chuẩn bị khởi tạo scanner");

    if (hasStartedRef.current) {
        console.log("⚠️ Scanner đã được khởi tạo trước đó → bỏ qua để tránh start 2 lần");
        return;
    }

    hasStartedRef.current = true;
    console.log("👉 Bắt đầu khởi tạo Html5Qrcode instance");

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    console.log("👉 Gọi start() → yêu cầu mở camera và bắt đầu quét QR");

    scanner
        .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                console.log("📸 Quét thành công → nội dung QR:", decodedText);

                if (scannedRef.current) {
                    console.log("⚠️ QR đã được xử lý trước đó → bỏ qua scan trùng");
                    return;
                }

                scannedRef.current = true;

                console.log("👉 Gọi callback onScan() để xử lý dữ liệu QR");
                onScan(decodedText);

                console.log("👉 Trạng thái scanner sau khi scan, isRunning =", isRunningRef.current);

                if (isRunningRef.current) {
                    console.log("🛑 Dừng scanner sau khi đã quét xong để tránh quét lại");

                    scanner
                        .stop()
                        .then(() => {
                            console.log("✅ Đã dừng camera thành công (sau scan)");
                            return scanner.clear();
                        })
                        .then(() => {
                            console.log("🧹 Đã giải phóng tài nguyên scanner (sau scan)");
                        })
                        .catch((err) => {
                            console.warn("⚠️ Lỗi khi dừng scanner sau scan:", err);
                        });

                    isRunningRef.current = false;
                } else {
                    console.log("⚠️ Scanner không ở trạng thái chạy → không cần stop");
                }
            },
            () => {
                // bỏ qua lỗi scan nhỏ (noise)
            }
        )
        .then(() => {
            console.log("✅ Camera đã mở → scanner bắt đầu hoạt động");
            isRunningRef.current = true;
        })
        .catch((err) => {
            console.error("❌ Không thể mở camera:", err);
        });

    return () => {
        console.log("🔴 Component unmount → bắt đầu cleanup scanner");

        console.log("👉 Trạng thái trước cleanup: isRunning =", isRunningRef.current);
        console.log("👉 Instance scanner hiện tại =", scannerRef.current);

        if (isRunningRef.current && scannerRef.current) {
            console.log("🛑 Scanner đang chạy → tiến hành stop camera");

            scannerRef.current
                .stop()
                .then(() => {
                    console.log("✅ Đã dừng camera thành công (cleanup)");
                })
                .catch((err) => {
                    console.warn("⚠️ Lỗi khi stop trong cleanup:", err);
                });

            isRunningRef.current = false;
        } else {
            console.log("⚠️ Scanner không chạy → bỏ qua bước stop");
        }

        if (scannerRef.current) {
            console.log("🧹 Gọi clear() → giải phóng DOM + resource của scanner");
            scannerRef.current.clear();
        } else {
            console.log("⚠️ Không có scanner → không cần clear");
        }
    };
}, [onScan]); 

    return <div id="reader" className="w-full aspect-square max-w-md mx-auto" />;
}