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
    const isStartingRef = useRef(false);

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
        isStartingRef.current = true;
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
                    console.log("✅ start xong");
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
            console.log("🔴 Cleanup bắt đầu");

            const scanner = scannerRef.current;

            if (!scanner) {
                console.log("⚠️ Không có scanner");
                return;
            }

            // ❗ CASE 1: đang start dở → KHÔNG được stop
            if (isStartingRef.current) {
                console.log("⚠️ Scanner đang trong quá trình start → skip stop để tránh crash");
                return;
            }

            // ❗ CASE 2: chưa chạy → cũng không stop
            if (!isRunningRef.current) {
                console.log("⚠️ Scanner chưa chạy → không cần stop");
                return;
            }

            console.log("👉 Stop scanner an toàn");

            scanner
                .stop()
                .then(() => {
                    console.log("✅ Stop xong → clear");
                    return scanner.clear();
                })
                .then(() => {
                    console.log("🧹 Clear xong");
                })
                .catch((err) => {
                    console.warn("⚠️ Lỗi cleanup:", err);
                });

            isRunningRef.current = false;
        };
    }, [onScan]);

    return <div id="reader" className="w-full aspect-square max-w-md mx-auto" />;
}